import ProductInteraction from "@/components/ProductInteraction";
import { getProductBySlug } from "@/lib/product-server";
import { ProductType } from "@/types"
import Image from "next/image"
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";

interface Props {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} - Jago Angkat`,
    description: product.shortDescription, 
  }
}

const ProductPage = async ({ params }: { params: Promise<{ slug: string }>; }) => {
  const { slug } = await params
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound()
  }

  // Logika parsing gambar
  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-8 lg:flex-row md:gap-12 mt-12 pb-12 px-4 max-w-7xl mx-auto">
      
      {/* 1. Image Section (Menggunakan Gallery yang support multi-image) */}
      <ProductGallery images={images} name={product.name} isOutOfStock={isOutOfStock} />

      {/* 2. Details Section */}
      <div className="w-full lg:w-7/12 flex flex-col gap-6">
        
        {/* Badges */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            {product.categoryName}
          </span>
          
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border
            ${isOutOfStock 
              ? "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" 
              : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"}`}>
            {isOutOfStock ? "Out of Stock" : `Ready: ${product.stock} Unit`}
          </span>
        </div>

        {/* Title & Price */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {product.name}
          </h1>
          <h2 className={`text-2xl font-black ${isOutOfStock ? "text-zinc-400 line-through italic" : "text-orange-600"}`}>
            Rp {product.price.toLocaleString("id-ID")}
          </h2>
        </div>
        
        {/* Description Section */}
        <div className="space-y-2">
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Description</span>
          <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
            {product.description}
          </p>
        </div>

        {/* Interaction (Cart/Buy) - Disabled if out of stock */}
        <div className={isOutOfStock ? "opacity-50 pointer-events-none grayscale" : ""}>
          <ProductInteraction product={product} />
        </div>

        {/* Payment & Terms Section */}
        <div className="flex flex-col gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Image src="/atm.jpg" alt="atm" width={50} height={25} className="rounded-md  transition-all"/>
            <Image src="/prima.jpg" alt="prima" width={50} height={25} className="rounded-md  transition-all"/>
            <Image src="/cards.png" alt="cards" width={50} height={25} className="rounded-md transition-all"/>
          </div>
          
          <p className="text-gray-500 text-[10px] leading-relaxed italic">
            By clicking Buy Now, you agree to our {" "}
            <span className="underline hover:text-black dark:hover:text-white cursor-pointer">Terms & Conditions</span> and {" "}
            <span className="underline hover:text-black dark:hover:text-white cursor-pointer">Privacy Policy</span>. 
            You authorize us to charge your card for this purchase.
          </p>
        </div>
      </div>

    </div>
  )
}

export default ProductPage;