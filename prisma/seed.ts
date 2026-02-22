import "dotenv/config";
import prisma from "@/lib/prisma";


async function main() {
  console.log("🚀 Seeding database...");

  // =========================
  // 1️⃣ CLEAN DATABASE (URUTAN PENTING)
  // =========================
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("🧹 Database cleaned.");

  // =========================
  // 2️⃣ SEED PRODUCTS
  // =========================
  const products = [
    {
      name: "Webbing Sling 1 Ton - 2 meter",
      slug: "webbing-sling-1t-2m",
      shortDescription: "Webbing Sling polester ply ganda",
      description: "Webbing sling standar internasional dengan safety factor 7:1",
      sku: "WS-1T2M",
      price: 45000,
      capacityTon: 1,
      lengthM: 2,
      stock: 100,
      images: ["/assets/webbing-1ton.png"],
      isActive: true,
    },
    {
      name: "Webbing Sling 2 Ton - 4 meter",
      slug: "webbing-sling-2t-4m",
      shortDescription: "Webbing Sling polester ply ganda",
      description: "Webbing sling standar internasional dengan safety factor 7:1",
      sku: "WS-2T4M",
      price: 90000,
      capacityTon: 2,
      lengthM: 4,
      stock: 75,
      images: ["/assets/webbing-2ton.png"],
      isActive: true,
    },
    {
      name: "Webbing Sling 3 Ton - 6 meter",
      slug: "webbing-sling-3t-6m",
      shortDescription: "Webbing Sling polester ply ganda",
      description: "Webbing sling standar internasional dengan safety factor 7:1",
      sku: "WS-3T6M",
      price: 185000,
      capacityTon: 3,
      lengthM: 6,
      stock: 100,
      images: ["/assets/webbing-3ton.png"],
      isActive: true,
    },
    {
      name: "Webbing Sling 5 Ton - 8 meter",
      slug: "webbing-sling-5t-8m",
      shortDescription: "Webbing Sling polester ply ganda",
      description: "Webbing sling standar internasional dengan safety factor 7:1",
      sku: "WS-5T8M",
      price: 420000,
      capacityTon: 5,
      lengthM: 8,
      stock: 50,
      images: ["/assets/webbing-5ton.png"],
      isActive: true,
    },
    {
      name: "Webbing Sling 10 Ton - 10 meter",
      slug: "webbing-sling-10t-10m",
      shortDescription: "Heavy duty",
      description: "Industrial grade",
      sku: "WS-10T10M",
      price: 950000,
      capacityTon: 10,
      lengthM: 10,
      stock: 15,
      images: ["/assets/webbing-10ton.png"],
      isActive: true,
    },
    {
      name: "Round Sling 2 Ton - 3 meter",
      slug: "round-sling-2t-3m",
      shortDescription: "Round sling",
      description: "Flexible lifting",
      sku: "RS-2T3M",
      price: 110000,
      capacityTon: 2,
      lengthM: 3,
      stock: 60,
      images: ["/assets/cover-roundsling2ton.png"],
      isActive: true,
    },
    {
      name: "Round Sling 5 Ton - 5 meter",
      slug: "round-sling-5t-5m",
      shortDescription: "Round sling",
      description: "Heavy lifting",
      sku: "RS-5T5M",
      price: 380000,
      capacityTon: 5,
      lengthM: 5,
      stock: 40,
      images: ["/assets/cover-roundsling5ton.png"],
      isActive: true,
    },
    {
      name: "Round Sling 8 Ton - 6 meter",
      slug: "round-sling-8t-6m",
      shortDescription: "Industrial",
      description: "Rigging use",
      sku: "RS-8T6M",
      price: 650000,
      capacityTon: 8,
      lengthM: 6,
      stock: 20,
      images: ["/assets/cover-roundsling8ton.png"],
      isActive: true,
    },
    {
      name: "Round Sling 12 Ton - 8 meter",
      slug: "round-sling-12t-8m",
      shortDescription: "Extra heavy",
      description: "Very heavy duty",
      sku: "RS-12T8M",
      price: 1250000,
      capacityTon: 12,
      lengthM: 8,
      stock: 10,
      images: ["/assets/cover-roundlsing12ton.png"],
      isActive: true,
    },
    {
      name: "Shackle 2 Ton",
      slug: "shackle-2t",
      shortDescription: "Steel shackle",
      description: "Standard shackle",
      sku: "SHK-2T12",
      price: 150000,
      capacityTon: 0,
      lengthM: 0,
      stock: 200,
      images: ["/assets/shackle.png"],
      isActive: false,
    },
  ];

  await prisma.product.createMany({ data: products });

  console.log("📦 Products seeded.");

  // =========================
  // 3️⃣ SEED USERS
  // =========================
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          emailVerified: true,
          role: i === 0 ? "ADMIN" : "USER",
        },
      })
    )
  );

  console.log("👤 Users seeded.");

  // =========================
  // 4️⃣ SKU LOOKUP MAP
  // =========================
  const dbProducts = await prisma.product.findMany();
  const skuMap = new Map(
    dbProducts.map((p) => [p.sku, p.id])
  );

  // =========================
  // 5️⃣ ORDERS DATA
  // =========================
  const ordersData = [
    { userIdx: 0, status: "DELIVERED", total: 135000, addr: "Jl. Merdeka No.1", items: [{ sku: "WS-1T2M", q: 1, p: 45000 }, { sku: "WS-2T4M", q: 1, p: 90000 }] },
    { userIdx: 1, status: "PENDING", total: 185000, addr: "Jl. Sudirman No.2", items: [{ sku: "WS-3T6M", q: 1, p: 185000 }] },
    { userIdx: 2, status: "PROCESSING", total: 420000, addr: "Jl. Gatot No.3", items: [{ sku: "WS-5T8M", q: 1, p: 420000 }] },
    { userIdx: 3, status: "SHIPPED", total: 950000, addr: "Jl. Thamrin No.4", items: [{ sku: "WS-10T10M", q: 1, p: 950000 }] },
    { userIdx: 4, status: "CANCELLED", total: 110000, addr: "Jl. Asia No.5", items: [{ sku: "RS-2T3M", q: 1, p: 110000 }] },
    { userIdx: 5, status: "DELIVERED", total: 380000, addr: "Jl. Diponegoro No.6", items: [{ sku: "RS-5T5M", q: 1, p: 380000 }] },
    { userIdx: 6, status: "PROCESSING", total: 650000, addr: "Jl. Veteran No.7", items: [{ sku: "RS-8T6M", q: 1, p: 650000 }] },
    { userIdx: 7, status: "PENDING", total: 1250000, addr: "Jl. Pemuda No.8", items: [{ sku: "RS-12T8M", q: 1, p: 1250000 }] },
    { userIdx: 8, status: "SHIPPED", total: 150000, addr: "Jl. Cempaka No.9", items: [{ sku: "SHK-2T12", q: 1, p: 150000 }] },
    { userIdx: 9, status: "CANCELLED", total: 135000, addr: "Jl. Anggrek No.10", items: [{ sku: "WS-1T2M", q: 3, p: 45000 }] },
  ];

  // =========================
  // 6️⃣ CREATE ORDERS + PAYMENTS
  // =========================
  for (const data of ordersData) {
    const order = await prisma.order.create({
      data: {
        status: data.status as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
        totalAmount: data.total,
        shippingAddress: data.addr,
        userId: users[data.userIdx].id,
        orderItems: {
          create: data.items.map((item) => ({
            productId: skuMap.get(item.sku)!,
            quantity: item.q,
            price: item.p,
          })),
        },
      },
    });

    await prisma.payment.create({
      data: {
        amount: data.total,
        status:
          data.status === "DELIVERED"
            ? "COMPLETED"
            : data.status === "CANCELLED"
            ? "FAILED"
            : "PENDING",
        paymentMethod: "BANK_TRANSFER",
        transactionId: `TRX-${Date.now()}-${Math.random()}`,
        userId: users[data.userIdx].id,
        orderId: order.id,
      },
    });
  }

  console.log("🛒 Orders & Payments seeded.");
  console.log("✅ Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
