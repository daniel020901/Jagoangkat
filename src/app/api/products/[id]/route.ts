import { getServerSession } from "@/lib/get-session"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { supabaseAdmin } from "@/lib/supabase/supabase-admin"
import { productSchema } from "@/types"

const BUCKET_NAME = "product-images" 

// ── Helper: ekstrak filePath dari URL dan validasi format ─────────────────
function extractFilePaths(urls: string[]): string[] {
  return urls
    .map((url) => url.split(`/${BUCKET_NAME}/`)[1])
    .filter((path): path is string =>
      typeof path === "string" &&
      /^products\/[0-9a-f-]{36}\.webp$/.test(path)
    )
}

// ── Helper: hapus file dari Supabase Storage ──────────────────────────────
// Selalu dipanggil SETELAH operasi DB berhasil
// Kalau gagal: tidak crash, hanya log untuk cleanup manual
async function deleteFromStorage(urls: string[]): Promise<void> {
  const filePaths = extractFilePaths(urls)
  if (filePaths.length === 0) return

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove(filePaths)

  if (error) {
    console.warn("Orphan files (storage delete failed):", filePaths)
  }
}

// ── DELETE: Hapus produk beserta semua gambarnya ──────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product tidak ditemukan" },
        { status: 404 }
      )
    }

    await prisma.product.delete({ where: { id } })

    const imageUrls = Array.isArray(product.images)
      ? (product.images as string[])
      : []

    await deleteFromStorage(imageUrls)

    return NextResponse.json({ message: "Product deleted successfully" })

  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params 

    const body = await request.json()
    const validation = productSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Ambil gambar lama sebelum update
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { images: true },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    const oldImages = Array.isArray(existingProduct.images)
      ? (existingProduct.images as string[])
      : []

    const newImages = Array.isArray(data.images) ? data.images : []

    const removedImages = oldImages.filter((url) => !newImages.includes(url))

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        price: data.price,
        stock: data.stock,
        capacityTon: data.capacityTon,
        lengthM: data.lengthM,
        shortDescription: data.shortDescription,
        description: data.description,
        images: data.images,
        isActive: data.isActive,
      },
    })

    await deleteFromStorage(removedImages)

    return NextResponse.json(
      {
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error updating product:", error)

    // Prisma: record tidak ditemukan
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    )
  }
}