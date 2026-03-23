"use client"
import { ProductType } from "@/types"
import { ShoppingCart } from "lucide-react";
import Image from "next/image"
import UseCartStore from "@/stores/cartStore";
import { toast } from "react-toastify"
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const { addToCart } = UseCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 })
    toast.success(`${product.name} added to cart!`)
  }

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  }
   const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const firstImage = product.images[0] || "/placeholder.jpg";

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-300 dark:border-zinc-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container - Menggunakan aspect-square agar tidak ada gap atas-bawah yang jauh */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-800">
        <Image 
          src={firstImage}
          alt={product.name}
          fill
          priority = {images.length <=5}
          className="object-contain group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Detail */}
      <div className="p-4 flex flex-col flex-grow">
        {/* SKU & Category Style Mini */}
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
          {product.sku}
        </span>
        
        <h2 className="font-semibold text-base leading-tight mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h2>
        
        {/* Ringkasan Spek Mini (Horizontal) */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mb-3">
          <span>Cap: <b>{product.capacityTon}T</b></span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Stock: <b>{product.stock}</b></span>
        </div>

        {/* Price & Action - Mepet ke bawah (mt-auto) */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 dark:border-zinc-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">Harga</span>
            <p className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Rp{product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <button 
            onClick={handleAddToCart}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black p-2.5 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-500 transition-colors shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div> 
      </div>
    </div>
  )
}

export default ProductCard;