import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase-admin"
import sharp from "sharp"
import crypto from "crypto"
import { getServerSession } from "@/lib/get-session"

const BUCKET_NAME = "product-images"
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const MAX_DIMENSION = 5000
const OUTPUT_MAX_DIMENSION = 1200
const OUTPUT_QUALITY = 80

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format tidak didukung" }, { status: 400 })
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()

    const magicBytes = new Uint8Array(arrayBuffer).slice(0, 12)
    const isValidImage =
      (magicBytes[0] === 0xff && magicBytes[1] === 0xd8) ||  // JPEG
      (magicBytes[0] === 0x89 && magicBytes[1] === 0x50) ||  // PNG
      (magicBytes[0] === 0x52 && magicBytes[8] === 0x57)     // WEBP

    if (!isValidImage) {
      return NextResponse.json({ error: "File bukan gambar valid" }, { status: 400 })
    }

    let metadata: sharp.Metadata
    try {
      metadata = await sharp(Buffer.from(arrayBuffer)).metadata()
    } catch {
      return NextResponse.json({ error: "File bukan gambar yang valid" }, { status: 400 })
    }

    if ((metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION) {
      return NextResponse.json({ error: `Resolusi maksimal ${MAX_DIMENSION}px` }, { status: 400 })
    }
    if ((metadata.pages ?? 1) > 1) {
      return NextResponse.json({ error: "Animated image tidak didukung" }, { status: 400 })
    }

    let webpBuffer: Buffer
    try {
      webpBuffer = await sharp(Buffer.from(arrayBuffer), { failOn: "truncated" })
        .rotate()
        .resize(OUTPUT_MAX_DIMENSION, OUTPUT_MAX_DIMENSION, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: OUTPUT_QUALITY, effort: 4 })
        .toBuffer()
    } catch {
      return NextResponse.json({ error: "Gagal memproses gambar" }, { status: 400 })
    }

    const fileName = `${crypto.randomUUID()}.webp`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, new Uint8Array(webpBuffer), {
        contentType: "image/webp",
        cacheControl: "3600",  // ✅ 1 jam, bukan 30 hari
        upsert: false,
      })

    if (uploadError) throw new Error(uploadError.message)

    const { data } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return NextResponse.json({ url: data.publicUrl }, { status: 201 })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL tidak valid" }, { status: 400 })
    }
    if (!url.includes(BUCKET_NAME)) {
      return NextResponse.json({ error: "URL tidak dikenali" }, { status: 400 })
    }

    const urlParts = url.split(`/${BUCKET_NAME}/`)
    if (urlParts.length < 2) {
      return NextResponse.json({ error: "Format URL tidak valid" }, { status: 400 })
    }

    const filePath = urlParts[1]

    // ✅ Validasi format path — cegah path traversal
    if (!/^products\/[0-9a-f-]{36}\.webp$/.test(filePath)) {
      return NextResponse.json({ error: "Path tidak valid" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}