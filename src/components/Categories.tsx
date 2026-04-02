"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Filter as FilterIcon, X, Check, RotateCcw, Plus } from "lucide-react"

interface CategoryDB {
  id: number;
  name: string;
  slug: string | null;
}

export default function Categories({ categories }: { categories: CategoryDB[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Ambil kategori dari URL dan ubah menjadi Array
  const urlCategories = searchParams.get("category")?.split(",").filter(Boolean) || []
  const urlMin = searchParams.get("minPrice") || "0"
  const urlMax = searchParams.get("maxPrice") || "20000000"

  // State lokal
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(urlCategories)
  const [tempMinPrice, setTempMinPrice] = useState(urlMin)
  const [tempMaxPrice, setTempMaxPrice] = useState(urlMax)

  const toggleCategory = (slug: string) => {
    setSelectedSlugs(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug) 
        : [...prev, slug]
    )
  }

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("minPrice", tempMinPrice)
    params.set("maxPrice", tempMaxPrice)
    
    if (selectedSlugs.length > 0) {
      params.set("category", selectedSlugs.join(","))
    } else {
      params.delete("category")
    }

    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    setIsModalOpen(false)
  }

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => {
          setSelectedSlugs(urlCategories)
          setTempMinPrice(urlMin)
          setTempMaxPrice(urlMax)
          setIsModalOpen(true)
        }}
        className="group flex items-center gap-2 bg-white dark:bg-zinc-900 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-orange-500 transition-all active:scale-95"
      >
        <FilterIcon className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-bold dark:text-zinc-200">
          Filter {urlCategories.length > 0 && `(${urlCategories.length})`}
        </span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-8 border-b border-zinc-100 dark:border-zinc-900">
              <h3 className="text-2xl font-black dark:text-white">Filter Alat Berat</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            <div className="p-8 space-y-10 overflow-y-auto max-h-[60vh]">
              {/* Multi-Select Kategori */}
              <div>
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block mb-6">Pilih Kategori (Bisa lebih dari satu)</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSlugs([])}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      selectedSlugs.length === 0 
                      ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/20" 
                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    Semua
                  </button>
                  {categories.map((cat) => {
                    const isSelected = selectedSlugs.includes(cat.slug || "");
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.slug || "")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                          isSelected 
                          ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/20" 
                          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-orange-500"
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 opacity-40" />}
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Range Harga (UI sama seperti sebelumnya) */}
              <div>
                <div className="flex justify-between items-end mb-6">
                   <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block">Maksimal Harga</label>
                   <span className="text-orange-600 font-black">Rp {parseInt(tempMaxPrice).toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="50000000" step="1000000"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>

            <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex gap-4">
              <button onClick={() => { setSelectedSlugs([]); setTempMaxPrice("20000000"); }} className="flex-1 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
                Bersihkan
              </button>
              <button onClick={handleApplyFilter} className="flex-[2] bg-zinc-900 dark:bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl">
                Tampilkan Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}