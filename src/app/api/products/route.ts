import { getServerSession } from "@/lib/get-session";
import { NextResponse, NextRequest } from "next/server";
import { getProductsData, _getProductsData } from "@/lib/product-server";
import { revalidateTag } from "next/cache";
import { randomBytes } from "crypto";
import { productSchema } from "@/types";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest) {
  
  try {
    const session = await getServerSession()

    const isAdmin = session?.user?.role === "ADMIN"

    //ambil query params dari URL
    const {searchParams} = new URL (request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const sort = searchParams.get("sort") || "newest"
    const categoryId = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")!) : undefined;
    const search = searchParams.get("search") || undefined;

    const {products, totalCount } = isAdmin
    ? await _getProductsData(true, page, pageSize, sort, categoryId, search)
      : await getProductsData(false, page, pageSize, sort, categoryId, search);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json( {

      data : products,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    }, {
      status: 200,
      headers: {
        "Cache-Control": isAdmin
          ? "no-store, max-age=0"
          : "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error){
    return NextResponse.json({ message: "Internal Server Error"}, { status:500})
  }
}

export async function POST(request: NextRequest) {
  try{
    const session  =  await getServerSession()
    if(!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const body = await request.json()
    const validation = productSchema.safeParse(body)

    if(!validation.success) {
      return NextResponse.json({ message: validation.error.issues[0]?.message}, {status: 400})
    }
    const {sku, name, categoryId, ...data} = validation.data
    const cleanSku = sku.toUpperCase().trim()
    
    const existingSku = await prisma.product.findUnique({
      where: { sku: cleanSku},
    })
    if(existingSku) {
      return NextResponse.json({message: "SKU  sudah terdaftar!"}, {status: 400})
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
           + "-" + randomBytes(4).toString("hex");
    const newProduct = await prisma.product.create({
      data: {
        name,
        sku: cleanSku,
        slug,
        ...data,
        category: {
          connect: { id: categoryId } 
        }
      },
    })

    return NextResponse.json({ product: newProduct}, {status:201})
  }catch(error){
    return NextResponse.json({message: "Error Saving Product"}, { status: 500})
  }
}