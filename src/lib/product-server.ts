import prisma from "./prisma";
import { ProductType } from "@/types";

export async function getProductsData(isAdmin: boolean = false): Promise<ProductType[]> {
  try {
    const productsFromDb = await prisma.product.findMany({
      // JIKA admin, where kosong (ambil semua). JIKA bukan, filter isActive: true
      where: isAdmin ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        sku: true,
        price: true,
        capacityTon: true,
        lengthM: true,
        stock: true,
        images: true,
        isActive: true,
      },
    });

    return productsFromDb.map((p): ProductType => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription || "",
      description: p.description || "",
      sku: p.sku,
      price: p.price,
      capacityTon: p.capacityTon || 0,
      lengthM: p.lengthM,
      stock: p.stock,
      images: (p.images as string[]) || [],
      isActive: p.isActive,
    }));
  } catch (error) {
    console.error("Error Fetching Products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductBySlug(slug: string, isAdmin: boolean = false): Promise<ProductType | null> {
  try {
    const product = await prisma.product.findFirst({ // Gunakan findFirst agar bisa gabung slug & isActive
      where: {
        slug: slug,
        ...(isAdmin ? {} : { isActive: true }) // Admin bisa lihat meski inactive
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        sku: true,
        price: true,
        capacityTon: true,
        lengthM: true,
        stock: true,
        images: true,
        isActive: true,
      }
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      sku: product.sku,
      price: product.price,
      capacityTon: product.capacityTon || 0,
      lengthM: product.lengthM,
      stock: product.stock,
      images: (product.images as string[]) || [],
      isActive: product.isActive,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw new Error("Failed to fetch product by slug");
  }
}