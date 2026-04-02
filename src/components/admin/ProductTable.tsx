"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Edit, Trash2, CheckCircle, XCircle, Plus, X, AlertCircle, RefreshCw } from "lucide-react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Resolver } from "react-hook-form"
import { productSchema, ProductType, type ProductFormInputs } from "@/types"
import { getProduct, updateProduct, createProduct, deleteProduct } from "@/lib/services/product-service"
import { useImageUpload } from "@/hooks/image-upload"

export default function ProductTable() {
  const [productData, setProductData] = useState<{ products: ProductType[], totalCount: number }>({
    products: [],
    totalCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]) // Pesan rejected/skipped
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Hook Upload ────────────────────────────────────────────────────────────
  const {
    images,
    addImages,
    removeImage,
    retryImage,
    resetImages,
    getUploadedUrls,
    isAnyUploading,
    hasError,
    confirmDeletion,
    urlsToDeleteCount,
    canAddMore,
    uploadedCount,
    imageCount,
  } = useImageUpload()

  // ── React Hook Form ────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormInputs>,
  })

  // ── Fetch Products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getProduct(true, 1, 50)
      console.log("Raw Data from API:", response )
      setProductData({
      products: response.data || [], 
      totalCount: response.pagination?.totalCount || 0
    });
    } catch (error) {
      console.error("Error fetching products", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // ── Lock body scroll saat modal buka ───────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [isModalOpen])

  // ── Filter produk ──────────────────────────────────────────────────────────
  const filteredProducts = (productData.products || []).filter((product: ProductType) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ── Handle file input change ───────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploadWarnings([])
    const result = await addImages(e.target.files)

    // Tampilkan warning jika ada file yang di-skip atau di-reject
    const warnings: string[] = []
    if (result.skipped > 0) {
      warnings.push(`${result.skipped} file di-skip karena sudah mencapai batas 3 foto`)
    }
    if (result.rejected.length > 0) {
      warnings.push(...result.rejected)
    }
    setUploadWarnings(warnings)

    // Reset input agar file yang sama bisa diupload lagi
    e.target.value = ''
  }

  // ── Buka modal Tambah ──────────────────────────────────────────────────────
  const handleAddNew = () => {
    setSelectedProduct(null)
    setUploadWarnings([])
    resetImages([])
    reset({
      name: "", sku: "", price: 0, stock: 0,
      capacityTon: 0, lengthM: 0,
      shortDescription: "", description: "",
      images: [], isActive: true,
    })
    setIsModalOpen(true)
  }

  // ── Buka modal Edit ────────────────────────────────────────────────────────
  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product)
    setUploadWarnings([])
    const existingImages = Array.isArray(product.images) ? product.images : []
    resetImages(existingImages)   
    reset({
      ...product,
      shortDescription: product.shortDescription ?? "",
      description: product.description ?? "",
      capacityTon: product.capacityTon ?? 0,
      lengthM: product.lengthM ?? 0,
      images: existingImages,
    })
    setIsModalOpen(true)
  }

  // ── Submit form ────────────────────────────────────────────────────────────
  const onSubmitForm = async (data: ProductFormInputs) => {
    const uploadedUrls = getUploadedUrls()

    if (uploadedUrls.length === 0) {
      setUploadWarnings(["Minimal unggah 1 foto produk sebelum menyimpan"])
      return
    }

    if (isAnyUploading) {
      setUploadWarnings(["Tunggu semua foto selesai diunggah"])
      return
    }

    try {
      const payload = { ...data, images: uploadedUrls }

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload)
        await confirmDeletion()
        alert("Produk berhasil diupdate")
      } else {
        await createProduct(payload)
        alert("Produk berhasil ditambahkan")
      }

      setIsModalOpen(false)
      fetchProducts()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan")
    }
  }

  // ── Delete produk ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string | number) => {

    const productToDelete = productData.products.find((p) => p.id === id)
    if(!productToDelete) return;

    if (!window.confirm("Yakin ingin menghapus produk ini?")) return
    try {
      await deleteProduct(id)

      const imageUrls = Array.isArray(productToDelete.images) ? productToDelete.images : []
      
      if (imageUrls.length > 0) {
        resetImages(imageUrls)
        

        for (const url of imageUrls) {
          const imgItem = images.find( img => img.publicUrl === url)
          if(imgItem) await removeImage(imgItem.id)
        }

        await confirmDeletion()
      }

      setProductData((prev) => ({
        ...prev,
        products: prev.products.filter((p: ProductType) => p.id !== id),
        totalCount: prev.totalCount - 1
      }));
      alert("Produk berhasil dihapus")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert(error instanceof Error ? error.message : "Gagal menghapus produk")
      fetchProducts()
    }
  }

  // ── Tutup modal ────────────────────────────────────────────────────────────
 const handleCloseModal = () => {
    if (isAnyUploading) {
      if (!window.confirm("Upload sedang berjalan. Yakin ingin menutup?")) return
    }

    if (selectedProduct) {
      if (urlsToDeleteCount > 0) {
        if (!window.confirm("Perubahan (termasuk foto yang dihapus) tidak akan disimpan. Yakin keluar?")) {
          const originalImages = Array.isArray(selectedProduct.images) ? selectedProduct.images : [];
          resetImages(originalImages); 
          return; 
        }
      }
      
     const originalImages = Array.isArray(selectedProduct.images) ? selectedProduct.images : [];
      resetImages(originalImages); 
    }
    
    else if (!selectedProduct && uploadedCount > 0) {
      if (!window.confirm("Gambar yang sudah diunggah akan dihapus. Lanjutkan?")) return
      images.forEach((img) => removeImage(img.id))
    }

    setIsModalOpen(false)
    setUploadWarnings([])
  }

  return (
    <motion.div
      className="bg-white dark:bg-[#121212] rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-[#1f1f1f]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Product Management</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <input
              type="text"
              placeholder="Search SKU or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 dark:bg-[#1a1a1a] text-gray-800 dark:text-white rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg transition-colors text-sm font-medium whitespace-nowrap h-10 cursor-pointer"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* ── Tabel ── */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              {["No", "Product", "SKU", "Price", "Stock", "Status", "Actions"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Loading Data...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Tidak ada produk ditemukan
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => {
                const imgs = Array.isArray(product.images) ? product.images : []
                const firstImage = imgs[0] || "/placeholder.jpg"
                return (
                  <motion.tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 relative flex-shrink-0">
                          <Image
                            src={firstImage}
                            alt={product.name}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4 font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${
                        product.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {product.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3 text-gray-400">
                        <button
                          onClick={() => handleEdit(product)}
                          className="hover:text-blue-500 transition-colors"
                          title="Edit produk"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="hover:text-red-500 transition-colors"
                          title="Hapus produk"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1f1f1f] flex justify-between items-center bg-gray-50/50 dark:bg-transparent">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {selectedProduct ? `Edit ${selectedProduct.name}` : "Tambah Produk Baru"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedProduct ? "Perbarui informasi produk" : "Isi detail produk baru"}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmitForm)}
                className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
              >

                {/* ── Warning Messages ── */}
                {uploadWarnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 space-y-1">
                    {uploadWarnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <p className="text-xs">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Section Upload Gambar ── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Foto Produk
                    </label>
                    <span className={`text-xs font-medium ${
                      imageCount >= 5
                        ? "text-red-500"
                        : imageCount >= 3
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}>
                      {uploadedCount}/{imageCount} foto · maks 3
                    </span>
                  </div>

                  {/* Grid Thumbnail */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img) => (
                        <div
                          key={img.id}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                            img.error
                              ? "border-red-400"
                              : img.isUploading
                              ? "border-blue-400"
                              : "border-transparent"
                          }`}
                        >
                          {/* Preview gambar */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.previewUrl}
                            alt="preview"
                            className={`w-full h-full object-cover transition-opacity ${
                              img.isUploading ? "opacity-50" : "opacity-100"
                            }`}
                          />

                          {/* Overlay: Uploading */}
                          {img.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 px-2">
                              <div className="w-full bg-white/30 rounded-full h-1">
                                <div
                                  className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${img.progress}%` }}
                                />
                              </div>
                              <span className="text-white text-[9px] font-medium">
                                {img.progress}%
                              </span>
                            </div>
                          )}

                          {/* Overlay: Error */}
                          {img.error && !img.isUploading && (
                            <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center gap-1 p-1">
                              <AlertCircle size={14} className="text-white flex-shrink-0" />
                              <span className="text-white text-[9px] text-center leading-tight line-clamp-2">
                                {img.error}
                              </span>
                              {/* Tombol retry */}
                              <button
                                type="button"
                                onClick={() => retryImage(img.id)}
                                className="mt-1 flex items-center gap-0.5 bg-white/20 hover:bg-white/30 text-white text-[9px] px-1.5 py-0.5 rounded-full transition-colors"
                              >
                                <RefreshCw size={8} />
                                Hapus & ulang
                              </button>
                            </div>
                          )}

                          {/* Overlay: Success badge */}
                          {!img.isUploading && !img.error && img.publicUrl && (
                            <div className="absolute bottom-1 right-1">
                              <div className="bg-green-500 rounded-full p-0.5">
                                <CheckCircle size={10} className="text-white" />
                              </div>
                            </div>
                          )}

                          {/* Tombol hapus */}
                          {!img.isUploading && (
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="absolute top-1 left-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 transition-colors"
                              title="Hapus foto"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropzone — hanya tampil jika belum penuh */}
                  {canAddMore && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-[#333] rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all bg-gray-50 dark:bg-[#1a1a1a] cursor-pointer group"
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                          <span className="font-medium text-blue-600 group-hover:text-blue-500">
                            Pilih foto
                          </span>
                          <p className="pl-1">atau drag & drop</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          JPG, PNG, WebP · Maks 5MB · Otomatis dikonversi ke WebP
                        </p>
                        {imageCount > 0 && (
                          <p className="text-xs text-blue-500 font-medium">
                            Bisa tambah {3 - imageCount} foto lagi
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pesan saat sudah penuh */}
                  {!canAddMore && (
                    <p className="text-xs text-center text-gray-400 py-2">
                      Batas maksimal 3 foto tercapai
                    </p>
                  )}

                  {/* Input file tersembunyi */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                  />
                </div>

                {/* ── Field Form ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nama Produk</label>
                    <input
                      {...register("name")}
                      placeholder="e.g. Webbing Sling 2 Ton"
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">SKU</label>
                    <input
                      {...register("sku")}
                      placeholder="e.g. WS-2T4M"
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    {errors.sku && <p className="text-red-500 text-[10px] font-bold">{errors.sku.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Harga (Rp)</label>
                    <input
                      type="number"
                      {...register("price")}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.price && <p className="text-red-500 text-[10px] font-bold">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Panjang (Mtr)</label>
                    <input
                      type="number"
                      {...register("lengthM")}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Stok</label>
                    <input
                      type="number"
                      {...register("stock")}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.stock && <p className="text-red-500 text-[10px] font-bold">{errors.stock.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Kapasitas (Ton)</label>
                    <input
                      type="number"
                      {...register("capacityTon")}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Singkat</label>
                  <input
                    type="text"
                    {...register("shortDescription")}
                    placeholder="e.g. Webbing sling kapasitas 2 ton panjang 4 meter"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Lengkap</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status isActive */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    Produk aktif — tampil di katalog publik
                  </label>
                </div>

                {/* ── Footer Modal ── */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-[#1f1f1f]">
                  {/* Info status upload */}
                  <div className="text-xs text-gray-400">
                    {isAnyUploading && (
                      <span className="text-blue-500 font-medium animate-pulse">
                        Mengunggah foto...
                      </span>
                    )}
                    {!isAnyUploading && hasError && (
                      <span className="text-red-500 font-medium">
                        Beberapa foto gagal diunggah
                      </span>
                    )}
                    {!isAnyUploading && !hasError && uploadedCount > 0 && (
                      <span className="text-green-500 font-medium">
                        {uploadedCount} foto siap
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isAnyUploading}
                      className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all text-sm"
                    >
                      {isSubmitting
                        ? "Menyimpan..."
                        : isAnyUploading
                        ? "Menunggu upload..."
                        : selectedProduct
                        ? "Update Produk"
                        : "Simpan Produk"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}