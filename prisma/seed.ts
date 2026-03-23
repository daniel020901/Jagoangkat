import "dotenv/config";
import prisma from "@/lib/prisma";

async function main() {
  console.log("🚀 Seeding database...");

  // ==========================================
  // 1️⃣ CLEAN DATABASE (URUTAN PENTING)
  // ==========================================
  // Hapus tabel yang bergantung pada Product & User dulu
  
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  
  // Hapus Product sebelum Category
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Database cleaned.");

  // ==========================================
  // 2️⃣ SEED CATEGORIES
  // ==========================================
  const slingBelt = await prisma.category.create({ data: { name: "Sling Belt", slug: "sling-belt" } });
  const hoist = await prisma.category.create({ data: { name: "Hoist", slug: "hoist" } });
  const wireRope = await prisma.category.create({ data: { name: "Wire Rope", slug: "wire-rope" } });
  const chain = await prisma.category.create({ data: { name: "Chain", slug: "chain" } });
  const riggingHardware = await prisma.category.create({ data: { name: "Rigging Hardware", slug: "rigging-hardware" } });
  const materialHandling = await prisma.category.create({ data: { name: "Material Handling", slug: "material-handling" } });

  console.log("📂 Categories seeded.");

  // ==========================================
  // 3️⃣ SEED PRODUCTS
  // ==========================================
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
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
      categoryId: slingBelt.id,
    },
    {
      name: "Shackle 2 Ton",
      slug: "shackle-2t",
      shortDescription: "Steel shackle",
      description: "Standard shackle for rigging hardware",
      sku: "SHK-2T12",
      price: 150000,
      capacityTon: 2,
      lengthM: 0,
      stock: 200,
      images: ["/assets/shackle.png"],
      isActive: true, // Saya ubah jadi true agar muncul di katalog
      categoryId: riggingHardware.id, // Lebih cocok masuk Rigging Hardware
    },
  ];

  await prisma.product.createMany({ data: products });
  console.log("📦 Products seeded.");

  // ==========================================
  // 4️⃣ SEED USERS
  // ==========================================
  await prisma.user.create({
    data: {
      name: "Daniel Admin",
      email: "admin@jagoangkat.com",
      emailVerified: true,
      role: "ADMIN",
    },
  });

  console.log("👤 Admin user seeded.");
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