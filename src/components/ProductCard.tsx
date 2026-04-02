"use client"
import { ProductType } from "@/types"
import { ShoppingCart, Ban } from "lucide-react"; // Tambah icon Ban
import Image from "next/image"
import UseCartStore from "@/stores/cartStore";
import { toast } from "react-toastify"
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const { addToCart } = UseCartStore();

  // Tentukan status stok
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return; // Proteksi tambahan

    addToCart({ ...product, quantity: 1 })
    toast.success(`${product.name} berhasil ditambah ke keranjang!`)
  }

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  }

  const firstImage = product.images[0] || "/placeholder.jpg";

  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-300 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative
        ${isOutOfStock ? "opacity-80" : ""}`} // Beri sedikit transparansi jika stok habis
    >
      {/* Label Sold Out Overlay */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            Sold Out
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-800">
        <Image 
          src={firstImage}
          alt={product.name}
          fill
          priority={false}
          // Tambahkan filter grayscale jika stok habis agar visual lebih jelas
          className={`object-contain group-hover:scale-105 transition-transform duration-500 
            ${isOutOfStock ? "grayscale contrast-75" : ""}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Detail */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
          {product.sku}
        </span>
        
        <h2 className={`font-semibold text-base leading-tight mb-1 line-clamp-2 transition-colors
          ${isOutOfStock ? "text-gray-500" : "group-hover:text-orange-600"}`}>
          {product.name}
        </h2>
        
        <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mb-3">
          <span>Cap: <b>{product.capacityTon}T</b></span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          {/* Warna teks stok berubah jika kritis */}
          <span className={isOutOfStock ? "text-red-500 font-bold" : ""}>
            Stock: <b>{isOutOfStock ? "Habis" : product.stock}</b>
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 dark:border-zinc-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">Harga</span>
            <p className={`font-bold text-base ${isOutOfStock ? "text-gray-400 line-through" : "text-zinc-900 dark:text-zinc-100"}`}>
              Rp{product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock} // Nonaktifkan tombol secara teknis
            className={`p-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center
              ${isOutOfStock 
                ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed" 
                : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-500 active:scale-95"}`}
          >
            {isOutOfStock ? <Ban className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div> 
      </div>
    </div>
  )
}

export default ProductCard;