// import { PrismaClient } from '@prisma/client';

// export const prismaTooling = new PrismaClient({
//   // 1. Ganti 'datasourceUrl' dengan 'datasources'
//   datasources: {
//     db: {
//       // Gunakan fallback ke DATABASE_URL jika DIRECT_DATABASE_URL tidak ada
//       url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!,
//     },
//   },
//   log: ['query', 'error', 'warn'], // Logging sangat berguna untuk debugging
// });

// export async function disconnectToolingDb() {
//   await prismaTooling.$disconnect();
// }