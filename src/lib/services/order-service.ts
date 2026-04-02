import prisma from "@/lib/prisma";
import { OrderStatus, Prisma } from "@/lib/generated/prisma/client";
import { CartItemType } from "@/types";
import { getServerSession } from "@/lib/get-session";
import { redirect, notFound } from "next/navigation";


const FINAL_ORDERS_STATES = new Set<OrderStatus>(["DELIVERED", "CANCELLED"])
const REQUIRES_PAYMENT_COMPLETED = new Set<OrderStatus>(["PROCESSING", "SHIPPED", "DELIVERED"])


/**
 * ── UTILITY: WITH RETRY ───────────────────────────────────────
 * Menangani deadlock atau serialization failure pada level DB.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isRetryable =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        ["P2034"].includes(err.code);

      if (!isRetryable || attempt === maxAttempts) throw err;

      lastError = err;
      const delay = 50 * 2 ** (attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}


export async function updateOrderStatusService(orderId: string, newStatus: OrderStatus) {
  return await prisma.$transaction(async (tx) => {
    // 1. Ambil data terbaru (Lock untuk pencegahan Race Condition)
    const current = await tx.order.findUnique({
      where: { id: orderId },
      include: { 
        payment: { select: { status: true } },
        orderItems: true 
      },
    });

    if (!current) throw new Error("Order tidak ditemukan");

    // 2. Guard: Jangan ubah jika sudah selesai/batal
    if (FINAL_ORDERS_STATES.has(current.status)) {
      throw new Error(`Order sudah final (${current.status}) dan tidak bisa diubah.`);
    }

    // 3. Guard: Payment Gate (Sesuai alur: Harus lunas sebelum diproses)
    if (REQUIRES_PAYMENT_COMPLETED.has(newStatus) && current.payment?.status !== "COMPLETED") {
      throw new Error("Gagal: Pembayaran belum lunas. Admin belum bisa memproses pesanan ini.");
    }

    // 4. Update Status Order
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus as OrderStatus },
    });

    // 5. Logika Auto-Restock jika CANCELLED
    if (newStatus === "CANCELLED" && current.status !== "CANCELLED") {
      for (const item of current.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return updated;
  }, { isolationLevel: "Serializable" });
}



/**
 * ── SERVICE: GET USER ORDERS ──────────────────────────────────
 * Digunakan di /orders/page.tsx untuk list riwayat pesanan.
 */
export async function getUserOrdersService(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      payment: true,
      orderItems: {
        include: { 
          product: { 
            select: { name: true, images: true, sku: true } 
          } 
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * ── SERVICE: CREATE ORDER ─────────────────────────────────────
 * Logika kompleks checkout dengan atomic stock update.
 */
export async function createOrderService(
  userId: string,
  items: CartItemType[],
  shippingAddress: string,
  paymentMethod: string
) {
  // PHASE 1: GUARD & DEDUPLICATION
  if (!items || items.length === 0) throw new Error("Keranjang belanja kosong");

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

  // PHASE 2: VALIDATE (Outside Transaction)
  const productIds = consolidatedItems.map((i) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (dbProducts.length !== productIds.length) {
    throw new Error("Beberapa produk tidak ditemukan");
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Pre-check stok
  for (const item of consolidatedItems) {
    const p = productMap.get(item.id);
    if (!p || p.stock < item.quantity) {
      throw new Error(`Stok ${p?.name || 'produk'} tidak mencukupi`);
    }
  }

  let dbSubtotal = new Prisma.Decimal(0);
  const orderItemsData = consolidatedItems.map((item) => {
    const product = productMap.get(item.id)!;
    dbSubtotal = dbSubtotal.add(product.price.mul(item.quantity));
    return { productId: item.id, quantity: item.quantity, price: product.price };
  });

  const finalTotal = dbSubtotal.add(new Prisma.Decimal(10000)); // Biaya layanan 10rb

  // PHASE 3: TRANSACTION (With Retry Logic)
  const order = await withRetry(() => 
    prisma.$transaction(async (tx) => {
      const valuesList = Prisma.join(
        consolidatedItems.map(
          (item) => Prisma.sql`(${item.id}::text, ${item.quantity}::int)`
        )
      );

      const updatedProducts = await tx.$queryRaw<{ id: string }[]>`
        UPDATE "products" AS p
        SET stock = p.stock - v.qty
        FROM (VALUES ${valuesList}) AS v(id, qty)
        WHERE p.id = v.id AND p.stock >= v.qty
        RETURNING p.id
      `;

      if (updatedProducts.length !== consolidatedItems.length) {
        throw new Error("Stok berubah di detik terakhir");
      }

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
    }, { timeout: 15000 })
  );

  return {
    ...order,
    totalAmount: order.totalAmount.toString(),
  };
}

/**
 * ── SERVICE: GET ORDER BY ID ──────────────────────────────────
 * Digunakan di /orders/[id]/page.tsx untuk detail pesanan.
 */
export async function getOrderByIdService(id: string) {
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
      payment: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) return notFound();

  // Authorization check
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    return redirect("/");
  }

  return order;
}