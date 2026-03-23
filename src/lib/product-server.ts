import prisma from "./prisma";
import { ProductType } from "@/types";
import { Prisma } from "./generated/prisma/client";

export async function getProductsData(
  isAdmin: boolean = false,
  page : number = 1,
  pageSize: number = 20,
  sort : string = "newest",
  categoryId ?: number,
  search ?:string,

)
{
  try {

    const skip = (page - 1) * pageSize;

    let orderBy: Prisma.ProductOrderByWithRelationInput = {createdAt: "desc"}
    if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sort === "asc") {
      orderBy = { price: "asc" }; // Urutkan harga termurah
    } else if (sort === "desc") {
      orderBy = { price: "desc" }; // Urutkan harga termahal
    }
    const whereClause = {
      
      ...(isAdmin ? {} : { isActive: true }),
      ...(categoryId ?   { categoryId: categoryId } : {} ),
      ...(search ? { name:{ contains: search, mode:'insensitive' as const}} : {} ),
      
      
    };

    const [productsFromDb, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip: skip,
        take: pageSize,
        orderBy: orderBy,
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
          category: {
        select: {
          name: true,
          id: true,
            },
          }
        },
      }),
   
      prisma.product.count({ where: whereClause }),
    ]);

    const products = productsFromDb.map((p): ProductType => ({
       id: p.id,
       name: p.name,
       slug: p.slug,
       shortDescription: p.shortDescription || "",
       description: p.description || "",
       sku: p.sku,
       price: p.price.toNumber(),
       capacityTon: p.capacityTon || 0,
       lengthM: p.lengthM,
       stock: p.stock,
       images: (p.images as string[]) || [],
       isActive: p.isActive,
       categoryName: p.category?.name || "Tanpa Kategori",
    }));

    return { products, totalCount };
  } catch (error) {
    console.error("Error Fetching Products:", error);
    return { products: [], totalCount: 0 };
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
        category: {
      select: { name: true, id: true }
        }
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
      price: product.price.toNumber(),
      capacityTon: product.capacityTon || 0,
      lengthM: product.lengthM,
      stock: product.stock,
      images: (product.images as string[]) || [],
      isActive: product.isActive,
      categoryName: product.category?.name || "Tanpa Kategori",
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw new Error("Failed to fetch product by slug");
  }
}