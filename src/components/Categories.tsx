"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Filter as FilterIcon, X } from "lucide-react"

// Interface untuk tipe data kategori dari DB
interface CategoryDB {
  id: number;
  name: string;
  slug: string;
}

export default function Categories({ categories }: { categories: CategoryDB[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // State lokal untuk filter harga
  const [tempMinPrice, setTempMinPrice] = useState(searchParams.get("minPrice") || "0")
  const [tempMaxPrice, setTempMaxPrice] = useState(searchParams.get("maxPrice") || "5000000")

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.set("minPrice", tempMinPrice)
    params.set("maxPrice", tempMaxPrice)
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    setIsModalOpen(false)
  }

  return (
    <div className="flex items-center gap-4 ">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all border border-gray-500"
      >
        <FilterIcon className="w-4 h-4" />
        <span>Filter & Kategori</span>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Filter Produk</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Bagian Kategori (Data dari DB) */}
              <div>
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider block mb-4">Kategori</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        const p = new URLSearchParams(searchParams)
                        p.set("category", cat.slug)
                        router.push(`${pathname}?${p.toString()}`)
                      }}
                      className={`px-3 py-2 rounded-md text-sm transition-all ${
                        searchParams.get("category") === cat.slug 
                        ? "bg-orange-600 text-white" 
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bagian Range Harga */}
              <div>
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider block mb-4">Rentang Harga (Rp)</label>
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="10000000" 
                    step="100000"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <span className="text-[10px] text-zinc-500 block mb-1">Min</span>
                      <input 
                        type="number" 
                        value={tempMinPrice} 
                        onChange={(e) => setTempMinPrice(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] text-zinc-500 block mb-1">Max</span>
                      <input 
                        type="number" 
                        value={tempMaxPrice} 
                        onChange={(e) => setTempMaxPrice(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-5 bg-zinc-800/50 border-t border-zinc-800 flex gap-3">
              <button 
                onClick={() => {
                    setTempMinPrice("0");
                    setTempMaxPrice("5000000");
                }}
                className="flex-1 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={handleApplyFilter}
                className="flex-[2] bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}