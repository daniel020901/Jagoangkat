import { getServerSession } from "@/lib/get-session";
import { NextResponse, NextRequest } from "next/server";
import { getProductsData } from "@/lib/product-server";
import { productSchema } from "@/types";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest) {
  const isAdminParam = request.nextUrl.searchParams.get("isAdmin")?.toLowerCase() ===  "true"

  try {
    let isAdmin = false;

    //proteksi jika request meminta data admin
    if(isAdminParam ) {
      const session = await getServerSession()
      if(session?.user?.role === "ADMIN") {
        isAdmin = true
      } else {
        return NextResponse.json ({ message: " Forbidden"}, { status: 403})
      }
    }

    const products = await getProductsData(isAdmin)
    return NextResponse.json(products, {
      status:200,
      headers: {
        "Cache-Control": isAdmin
        ? "no-store , max-age=0"
        : "public, s-maxage=60, stale-while-revalidate=30",
      },
    })
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
    const {sku, name, ...data} = validation.data
    const cleanSku = sku.toUpperCase().trim()
    
    const existingSku = await prisma.product.findUnique({
      where: { sku: cleanSku},
    })
    if(existingSku) {
      return NextResponse.json({message: "SKU  sudah terdaftar!"}, {status: 400})
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now()
    const newProduct = await prisma.product.create({
      data: {
        name,
        sku: cleanSku,
        slug,
        ...data
      },
    })
    return NextResponse.json({ product: newProduct}, {status:201})
  }catch(error){
    return NextResponse.json({message: "Error Saving Product"}, { status: 500})
  }
}