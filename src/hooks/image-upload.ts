// hooks/use-image-upload.ts
'use client'

import { useState, useCallback } from 'react'
import imageCompression from 'browser-image-compression'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ImageItem {
  id: string            // ID unik per item — hindari race condition index
  previewUrl: string    // ObjectURL lokal — untuk tampilan
  publicUrl: string     // URL Supabase — untuk disimpan ke DB
  isUploading: boolean
  progress: number      // 0-100
  error?: string
}

export interface AddImagesResult {
  accepted: number      // Jumlah file yang diproses
  skipped: number       // Jumlah file yang di-skip karena limit
  rejected: string[]    // Nama file yang ditolak + alasannya
}

// ── Konstanta ────────────────────────────────────────────────────────────────

const MAX_IMAGES = 3
const MAX_RAW_SIZE_MB = 10       // Batas sebelum kompresi
const MAX_RAW_SIZE_BYTES = MAX_RAW_SIZE_MB * 1024 * 1024

// Format yang didukung browser-image-compression
// HEIC/HEIF tidak didukung library ini — harus ditolak dengan pesan jelas
const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

// Format yang tidak didukung tapi sering diupload user
const UNSUPPORTED_WITH_REASON: Record<string, string> = {
  'image/heic': 'Format HEIC (foto iPhone) belum didukung. Ubah ke JPG di pengaturan kamera.',
  'image/heif': 'Format HEIF belum didukung. Ubah ke JPG di pengaturan kamera.',
  'image/gif':  'Format GIF tidak didukung. Gunakan JPG atau PNG.',
  'image/bmp':  'Format BMP tidak didukung. Gunakan JPG atau PNG.',
  'image/tiff': 'Format TIFF tidak didukung. Gunakan JPG atau PNG.',
  'image/svg+xml': 'Format SVG tidak didukung. Gunakan JPG atau PNG.',
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.2,              // Target 150KB — sedikit lebih longgar dari 100KB
  maxWidthOrHeight: 1200,       // Match dengan OUTPUT_MAX_DIMENSION di server
  useWebWorker: true,           // Tidak freeze UI
  initialQuality: 0.85,
  // Tidak set fileType di sini — biarkan server yang convert ke WebP
  // agar konsisten dengan sharp di API route
}

// ── Helper ───────────────────────────────────────────────────────────────────

function generateId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function revokeIfBlob(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

// Validasi file sebelum diproses — return string error atau null jika valid
function validateFile(file: File): string | null {
  // Cek tipe yang diketahui tidak didukung dengan pesan spesifik
  if (file.type in UNSUPPORTED_WITH_REASON) {
    return UNSUPPORTED_WITH_REASON[file.type]
  }

  // Cek apakah MIME type adalah gambar sama sekali
  if (!file.type.startsWith('image/')) {
    return `"${file.name}" bukan file gambar`
  }

  // Cek apakah format didukung library kompresi
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return `Format ${file.type} tidak didukung`
  }

  // Cek ukuran sebelum diproses
  if (file.size > MAX_RAW_SIZE_BYTES) {
    return `"${file.name}" terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${MAX_RAW_SIZE_MB}MB`
  }

  // Cek ukuran minimum — file 0 byte atau corrupt
  if (file.size < 1024) {
    return `"${file.name}" terlalu kecil atau corrupt`
  }

  return null // Valid
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useImageUpload(initialUrls: string[] = []) {
  const [images, setImages] = useState<ImageItem[]>(
    initialUrls.map((url) => ({
      id: generateId(),
      previewUrl: url,
      publicUrl: url,
      isUploading: false,
      progress: 100,
    }))
  )
  const [urlsToDelete, seturlsToDelete] = useState<string[]>([])

  // ── Update helper — pakai ID bukan index ──────────────────────────────────
  const updateById = useCallback(
    (id: string, updates: Partial<ImageItem>) => {
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
      )
    },
    []
  )

  // ── addImages ─────────────────────────────────────────────────────────────
  const addImages = useCallback(
    async (files: FileList): Promise<AddImagesResult> => {
      const fileArray = Array.from(files)
      const remaining = MAX_IMAGES - images.length
      const result: AddImagesResult = {
        accepted: 0,
        skipped: Math.max(0, fileArray.length - remaining),
        rejected: [],
      }

      if (remaining <= 0) {
        result.skipped = fileArray.length
        return result
      }

      // Validasi semua file dulu sebelum mulai proses apapun
      const validFiles: File[] = []
      for (const file of fileArray.slice(0, remaining)) {
        const error = validateFile(file)
        if (error) {
          result.rejected.push(error)
        } else {
          validFiles.push(file)
        }
      }

      if (validFiles.length === 0) return result
      result.accepted = validFiles.length

      const newItems: ImageItem[] = validFiles.map((file) => ({
        id: generateId(),
        previewUrl: URL.createObjectURL(file),
        publicUrl: '',
        isUploading: true,
        progress: 0,
      }))

      setImages((prev) => [...prev, ...newItems])

      // Upload paralel — partial success via Promise.allSettled
      await Promise.allSettled(
        validFiles.map(async (file, index) => {
          const itemId = newItems[index].id  // ID sudah fixed, tidak berubah

          try {
            // ── Step 1: Kompresi di browser ─────────────────────────────────
            const compressed = await imageCompression(file, {
              ...COMPRESSION_OPTIONS,
              onProgress: (progress) => {
                // Progress 0-50 untuk fase kompresi
                updateById(itemId, { progress: Math.round(progress * 0.5) })
              },
            })

            // Progress 50 — kompresi selesai, mulai upload
            updateById(itemId, { progress: 50 })

            // ── Step 2: Cek koneksi sebelum upload ──────────────────────────
            if (!navigator.onLine) {
              throw new Error('Tidak ada koneksi internet. Coba lagi setelah online.')
            }

            // ── Step 3: Kirim ke API Route ──────────────────────────────────
            const formData = new FormData()
            formData.append('file', compressed, `upload.${compressed.type.split('/')[1] || 'jpg'}`)

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 30_000) // 30s timeout

            let res: Response
            try {
              res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                signal: controller.signal,
              })
            } catch (fetchError) {
              if ((fetchError as Error).name === 'AbortError') {
                throw new Error('Upload timeout. Koneksi terlalu lambat, coba lagi.')
              }
              if (!navigator.onLine) {
                throw new Error('Koneksi terputus saat upload. Coba lagi.')
              }
              throw new Error('Gagal terhubung ke server. Periksa koneksi kamu.')
            } finally {
              clearTimeout(timeoutId)
            }

            // Progress 90 — response diterima
            updateById(itemId, { progress: 90 })

            // ── Step 4: Handle response error ──────────────────────────────
            if (!res.ok) {
              let errorMessage = 'Upload gagal'
              try {
                const data = await res.json()
                errorMessage = data.error ?? errorMessage
              } catch {
                if (res.status === 413) errorMessage = 'File terlalu besar untuk server'
                else if (res.status === 415) errorMessage = 'Format file tidak didukung server'
                else if (res.status === 503) errorMessage = 'Server sedang sibuk, coba lagi'
                else errorMessage = `Upload gagal (${res.status})`
              }
              throw new Error(errorMessage)
            }

            const { url } = await res.json()

            if (!url || typeof url !== 'string') {
              throw new Error('Server tidak mengembalikan URL yang valid')
            }

            // ── Sukses ──────────────────────────────────────────────────────
            updateById(itemId, {
              publicUrl: url,
              isUploading: false,
              progress: 100,
              error: undefined,
            })

          } catch (err) {
            const errorMessage = err instanceof Error
              ? err.message
              : 'Terjadi kesalahan tidak diketahui'

            updateById(itemId, {
              isUploading: false,
              progress: 0,
              error: errorMessage,
            })
          }
        })
      )

      return result
    },
    [images.length, updateById]
  )

  // ── retryImage — upload ulang gambar yang gagal ───────────────────────────
  const retryImage = useCallback(
    async (id: string) => {
      updateById(id, { error: undefined, progress: 0 })
    },
    [updateById]
  )

  // ── removeImage ───────────────────────────────────────────────────────────
  const removeImage = useCallback(
    async (id: string) => {
      const image = images.find((img) => img.id === id)
      if (!image) return

      if (image.isUploading) return

      if (image.publicUrl) {
        seturlsToDelete((prev) => [...prev, image.publicUrl])
      }

      // Bebaskan memori objectURL
      revokeIfBlob(image.previewUrl)

      setImages((prev) => prev.filter((img) => img.id !== id))
    },
    [images]
  )

  const confirmDeletion = useCallback(async () =>{
    if( urlsToDelete.length === 0 ) return;

    await Promise.allSettled(
      urlsToDelete.map((url) =>
      fetch('/api/upload', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ url })
      }))
    )
    seturlsToDelete([])
  }, [urlsToDelete])

  // ── resetImages — dipakai saat buka modal edit ────────────────────────────
  const resetImages = useCallback((urls: string[] = []) => {
    seturlsToDelete([])
    // Revoke semua blob URL yang ada untuk cegah memory leak
    setImages((prev) => {
      prev.forEach((img) => revokeIfBlob(img.previewUrl))
      return urls.map((url) => ({
        id: generateId(),
        previewUrl: url,
        publicUrl: url,
        isUploading: false,
        progress: 100,
      }))
    })
  }, [])

  // ── getUploadedUrls — hanya URL yang sukses ───────────────────────────────
  const getUploadedUrls = useCallback(
    () =>
      images
        .filter((img) => img.publicUrl && !img.isUploading && !img.error)
        .map((img) => img.publicUrl),
    [images]
  )

  // ── Derived state ─────────────────────────────────────────────────────────
  const isAnyUploading = images.some((img) => img.isUploading)
  const hasError = images.some((img) => !!img.error)
  const canAddMore = images.length < MAX_IMAGES
  const uploadedCount = images.filter(
    (img) => img.publicUrl && !img.isUploading && !img.error
  ).length

  return {
    images,
    addImages,       // Tambah gambar baru
    removeImage,     // Hapus berdasarkan ID (bukan index)
    retryImage,      // Reset error state untuk upload ulang
    resetImages,     // Reset semua — untuk buka modal edit
    getUploadedUrls, // Ambil URL sukses — untuk submit form
    confirmDeletion,
    urlsToDeleteCount: urlsToDelete.length,
    isAnyUploading,
    hasError,
    canAddMore,
    uploadedCount,
    imageCount: images.length,
  }
}