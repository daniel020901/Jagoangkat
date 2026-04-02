"use client"
import { useState } from "react"
import Image from "next/image"

export function ProductGallery({ images, name, isOutOfStock }: { images: string[], name: string, isOutOfStock: boolean }) {
  const [mainImage, setMainImage] = useState(images[0] || "/placeholder.jpg")

  return (
    <div className="flex flex-col gap-4 w-full lg:w-5/12">
      {/* Main Image Box */}
      <div className="relative aspect-square w-full max-w-[400px] mx-auto bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <Image 
          src={mainImage} 
          alt={name} 
          fill 
          priority
          className={`object-contain p-6 transition-all duration-500 ${isOutOfStock ? "grayscale opacity-50" : ""}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <span className="bg-red-600 text-white font-black px-6 py-2 rounded-full text-sm uppercase tracking-tighter shadow-xl rotate-[-5deg]">
              Habis Terjual
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 justify-center overflow-x-auto py-2 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0
                ${mainImage === img ? "border-orange-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              <Image src={img} alt={`${name}-${idx}`} fill className="object-cover p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}