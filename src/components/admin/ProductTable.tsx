"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Edit, Trash2, CheckCircle, XCircle, Plus, X } from "lucide-react" 
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm,  Resolver} from "react-hook-form"
import { productSchema, ProductType, type ProductFormInputs} from "@/types"
import { updateProduct } from "@/lib/product-service"
import { set } from "zod"



export default function ProductTable() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [ isModalOpen, setIsModalOpen] = useState(false)
    const [ selectedProduct, setSelectedProduct] = useState<ProductType | null>(null) // State untuk menyimpan produk yang akan diedit
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);


    const { 
        register, 
        handleSubmit, 
        reset, 
        getValues,
        setValue,

        formState:
        {errors, isSubmitting},
    }= useForm<ProductFormInputs>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormInputs>
    })


    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/products?isAdmin=true')
            if (!response.ok) throw new Error("Gagal memuat data")
            
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error("Error fetching products", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProducts() }, [])

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

   const handleAddNew = () => {
        setSelectedProduct(null); // Reset mode ke Create
        setImagePreviews([]); // Kosongkan preview gambar
        reset({ // Kosongkan form dengan nilai default
            name: "",
            sku: "",
            price: 0,
            stock: 0,
            capacityTon: 0,
            lengthM: 0,
            shortDescription: "",
            description: "",
            images: [],
            isActive: true,
        });
        setIsModalOpen(true);
    }

    
    // --- HANDLER UNTUK TOMBOL EDIT (DATA LAMA) ---
    const handleEdit = (product: ProductType) => {
        setSelectedProduct(product); // Set mode ke Edit & simpan data lama
        const imgs = Array.isArray(product.images) ? product.images : [];
        setImagePreviews(imgs);
        reset({ // Isi form dengan data produk yang diklik
            ...product,
            shortDescription: product.shortDescription ?? "",
            description: product.description ?? "",
            capacityTon: product.capacityTon ?? 0,
            lengthM: product.lengthM ?? 0,
            images: Array.isArray(product.images) ? product.images : [],
        });
        setIsModalOpen(true);
    }
    
    // --- HANDLER SUBMIT (GABUNGAN CREATE & EDIT) ---
    const onSubmitForm = async (data: ProductFormInputs) => {
        try {
            if (selectedProduct) {
                // MODE EDIT: Jalankan PUT
                await updateProduct(selectedProduct.id, data);
                alert("Produk berhasil diperbaharui");
            } else {
                // MODE CREATE: Jalankan POST
                const response = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Gagal menambah produk");
                alert("Produk berhasil ditambahkan");
            }
            
            setIsModalOpen(false);
            fetchProducts(); // Refresh data tabel tanpa reload halaman penuh
        } catch (error) {
            alert(error instanceof Error ? error.message : "Terjadi kesalahan");
        }
    }

     useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow="hidden"

        }else{
            document.body.style.overflow="auto"
        }
    }, [isModalOpen])

    const handleDelete = async (id: string | number) => {
        const confirmDelete = window.confirm("Are you sure You want to delete this product?")
        if(confirmDelete) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: "DELETE",
                })
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error (errorData.message || " gagal menghapus produk")
                }
                setProducts ((prevProducts) => prevProducts.filter((product) => product.id !== id) )
                alert ("produk berhasil dihapus")
            }catch (error: unknown) {
                console.error("Error deleting product:", error)
                alert(error instanceof Error ? error.message : "Failed to delete product")
            }
            
        }
    }


    // Fungsi untuk menghapus gambar dari tampilan saat edit
const removeImage = (indexToRemove: number) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    // Jika Anda menggunakan react-hook-form, update juga value di formnya
    const currentImages = getValues("images") || [];
    setValue("images", currentImages.filter((_, index) => index !== indexToRemove));
};


    return (
        <motion.div
            className="bg-white dark:bg-[#121212] rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-[#1f1f1f]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
             {/* Header Section  */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Product Management</h2>
              
                <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1  md:flex-initial">
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
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg transition-colors text-sm font-medium whitespace-nowrap h-10 cursor-pointer">
                        <Plus size={20}/>
                        <span className="hidden sm:inline">Tambah Produk</span>
                     </button>
                     
                     </div>
                     
            </div>
            {/* Tabel Section  */}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr>
                            {["No","Product", "SKU", "Price", "Stock", "Status", "Actions"].map((header) => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-10">Loading Data...</td></tr>
                        ) : filteredProducts.map((product, index) => {
                            const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
                            const firstImage = images[0] || "/placeholder.jpg";

                            return (
                                <motion.tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     {index + 1}
                                     </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 relative flex-shrink-0">
                                                <Image src={firstImage} alt={product.name} fill className="rounded-lg object-cover" />
                                            </div>
                                            <div className="ml-4 font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Rp {product.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                                    
                                    {/* Kolom IsActive */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${
                                            product.isActive 
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                            {product.isActive ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                                            {product.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex space-x-3 text-gray-400">
                                            <button  onClick={() => handleEdit(product)} className="hover:text-blue-500 transition-colors"><Edit size={24} /></button>
                                            <button className="hover:text-red-500 transition-colors"><Trash2 size={24} onClick={() => handleDelete(product.id)} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pop-up Modal Create  */}
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
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {selectedProduct ? `Edit ${selectedProduct.name}`  : "Create New Product"}
                </h3>

                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <XCircle size={24} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Product Images</label>
                    
                    {/* List GAmbar yang sudah ada  */}
                    {selectedProduct && imagePreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {imagePreviews.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border dark:border-[#333]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt="preview" className="w-full  h-full object-cover" />
                                <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-md"

                                >
                                    <X size={14} />
                                </button>
                            </div>
                            ))}
                        </div>
                    )}

                    {/* Dropzone upload gambar  */}
                    <div className="relative group">
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-[#333] border-dashed rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all bg-gray-50 dark:bg-[#1a1a1a] cursor-pointer">
                            <div className="space-y-1 text-center">
                                <svg
                                className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                                >
                                    <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                            <span>Upload a file</span>
                                            <input type="file" className="sr-only" multiple accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>
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
                    <input type="number" {...register("price")} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    {errors.price && <p className="text-red-500 text-[10px] font-bold">{errors.price.message}</p>}
                  </div>
                   <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Panjang (Mtr) Opsional</label>
                    <input type="number" {...register("lengthM")} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    {errors.lengthM && <p className="text-red-500 text-[10px] font-bold">{errors.lengthM.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Stok</label>
                    <input type="number" {...register("stock")} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    {errors.stock && <p className="text-red-500 text-[10px] font-bold">{errors.stock.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Kapasitas (Ton)</label>
                    <input type="number" {...register("capacityTon")} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Singkat</label>
                  <input
                  type="text" 
                    {...register("shortDescription")} 
                    placeholder="e.g. Webbing sling dengan kapasitas 2 ton dan panjang 4 meter"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Lengkap</label>
                  <textarea 
                    {...register("description")} 
                    rows={2} 
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-3 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#1f1f1f]">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all text-sm"
                  >
                    {isSubmitting ? "Menyimpan..." : (selectedProduct ? "Update Product" : "Confirm Create")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </motion.div>
    )
}