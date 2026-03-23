import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { CartItemType } from "@/types";
import { getServerSession } from "@/lib/get-session";
import { redirect, notFound } from "next/navigation";

export async function createOrderService(
  userId: string,
  items: CartItemType[],
  shippingAddress: string,
  paymentMethod: string
) {
  // ── PHASE 1: GUARD & DEDUPLICATION ──────────────────────────
  //
  //  Tolak lebih awal sebelum menyentuh DB sama sekali.
  //  Deduplication pakai Map — O(n), bukan O(n²) seperti .find()

  if (!items || items.length === 0) {
    throw new Error("Keranjang belanja kosong");
  }

  const itemMap = new Map<string, CartItemType>();
  for (const item of items) {
    const existing = itemMap.get(item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      itemMap.set(item.id, { ...item });
    }
  }
  const consolidatedItems = Array.from(itemMap.values());

  // Validasi wajib sebelum raw query — first line of defense SQL injection
  for (const item of consolidatedItems) {
    if (typeof item.id !== "string" || item.id.trim() === "") {
      throw new Error("Invalid product id");
    }

    

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Quantity tidak valid");
    }
  }

  // ── PHASE 2: VALIDATE ───────────────────────────────────────
  //
  //  Semua validasi di luar transaksi — tolak request yang jelas
  //  salah sebelum membuka transaksi DB yang lebih mahal.
  //
  //  Query 1 — fetch semua produk sekaligus, bukan per item

  const productIds = consolidatedItems.map((i) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (dbProducts.length !== productIds.length) {
    throw new Error("Beberapa produk tidak ditemukan di sistem");
  }

  // Buat Map sekali — semua lookup berikutnya O(1), bukan O(n)
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Pre-check stok sebelum buka transaksi
  const stockErrors = consolidatedItems
    .filter((item) => productMap.get(item.id)!.stock < item.quantity)
    .map((item) => {
      const p = productMap.get(item.id);
      if(!p) throw new Error ("Product not found")
      return `${p.name} (stok: ${p.stock}, butuh: ${item.quantity})`;
    });

  if (stockErrors.length > 0) {
    throw new Error("Beberapa produk stoknya tidak mencukupi");
  }

  // Hitung total di server — tidak percaya angka dari client
  let dbSubtotal = new Prisma.Decimal(0);
  const orderItemsData = consolidatedItems.map((item) => {
    const product = productMap.get(item.id);
    
      if(!product) throw new Error ("Product not found")
    dbSubtotal = dbSubtotal.add(product.price.mul(item.quantity));
    return { productId: item.id, quantity: item.quantity, price: product.price };
  });

  const finalTotal = dbSubtotal.add(new Prisma.Decimal(10000));

  // ── PHASE 3: TRANSACTION ─────────────────────────────────────
  
  const order = await prisma.$transaction(async (tx) => {

    const values = consolidatedItems
      .map((item) => `('${item.id}', ${item.quantity})`)
      .join(", ");

    const updatedProducts = await tx.$queryRawUnsafe<{ id: string }[]>(`
      UPDATE "products" AS p
      SET stock = p.stock - v.qty
      FROM (VALUES ${values}) AS v(id, qty)
      WHERE p.id = v.id::text
        AND p.stock >= v.qty
      RETURNING p.id
    `);

    // Kalau jumlah RETURNING kurang dari consolidatedItems
    // berarti ada race condition — stok habis di detik terakhir
    if (updatedProducts.length !== consolidatedItems.length) {
      throw new Error("Stok berubah di detik terakhir, silakan coba lagi");
    }

    // Query 3 — buat order + payment setelah stok aman
    // Urutan ini disengaja: stok dulu, order belakangan
    return await tx.order.create({
      data: {
        userId,
        totalAmount: finalTotal,
        shippingAddress,
        status: "PENDING",
        orderItems: { create: orderItemsData },
        payment: {
          create: {
            amount: finalTotal,
            userId,
            status: "PENDING",
            currency: "IDR",
            paymentMethod,
          },
        },
      },
    });

  }, { timeout: 15000 });

  // ── PHASE 4: SERIALIZATION ───────────────────────────────────
  //
  //  Prisma Decimal tidak bisa dikirim langsung ke Client Component.
  //  Konversi ke string di sini sebelum return ke API route.

  return {
    ...order,
    totalAmount: order.totalAmount.toString(),
  };
}

// ─────────────────────────────────────────────────────────────

export async function getOrderByIdService(id: string) {
  // Session dicek paling awal — sebelum query DB apapun
  // Kode lama: session dicek setelah id check, DB tetap kena hit
  // untuk request yang tidak login
  const session = await getServerSession();
  if (!session?.user) return redirect("/login");

  if (!id) return notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
              sku: true,
              capacityTon: true,
            },
          },
        },
      },
      payment: {
        select: {
          status: true,
          paymentMethod: true,
          amount: true,
          currency: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // return eksplisit — eksekusi benar-benar berhenti di sini
  // Kode lama tanpa return: baris berikutnya tetap jalan
  // dan throw TypeError saat order null
  if (!order) return notFound();

  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    return redirect("/");
  }

  return order;
}