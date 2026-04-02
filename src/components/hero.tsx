'use client'

import Image from 'next/image'
import { Badge } from './ui/badge'
import { ChevronRightIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    tag: "News",
    title: "Elevate your gear. Elevate your style.",
    price: 199999,
    img: "/assets/body_harness1.png",
    bgColor: "bg-gradient-to-br from-[#C05621]/20 to-[#C05621]/5 dark:from-[#C05621]/30 dark:to-slate-900",
    accentColor: "text-[#C05621] bg-[#C05621]/10 dark:bg-[#C05621]/20 dark:text-[#ed8936]"
  },
  {
    id: 2,
    tag: "Special Offer",
    title: "Premium Protection. Maximum Comfort.",
    price: 249000,
    img: "/assets/Spreader-Bar-Tekniko.jpeg",
    bgColor: "bg-[#ddd6ff] dark:bg-gradient-to-br dark:from-indigo-950 dark:to-slate-900",
    accentColor: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300"
  }
];

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

const LiveBadge = () => {
  return (
    <Badge
      variant="outline"
      className="flex items-center gap-3 w-fit mx-auto px-4 py-1.5 mb-8 mt-6 text-xs sm:text-sm backdrop-blur-sm border-primary/20"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
      <span className="text-muted-foreground font-medium">
        Pertama dan Terbesar di Indonesia
      </span>
    </Badge>
  )
}

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full pb-10">
      <LiveBadge />
      
      {/* Container Utama - Membatasi lebar agar tidak oversize */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col xl:flex-row gap-5">
          
          {/* BANNER UTAMA (CAROUSEL) */}
          <div className="relative flex-[2] overflow-hidden rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides.map((slide) => (
                <div 
                  key={slide.id} 
                  className={`relative min-w-full flex flex-col md:flex-row items-center min-h-[380px] md:min-h-[460px] ${slide.bgColor}`}
                >
                  <div className="p-8 sm:p-12 z-10 w-full md:w-3/5">
                    <div className={`inline-flex items-center gap-2 pr-4 p-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${slide.accentColor}`}>
                      <span className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full shadow-sm">{slide.tag}</span> 
                      <span>Free shipping over Rp 500k</span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.1] my-4 font-bold text-slate-900 dark:text-white max-w-md">
                      {slide.title}
                    </h2>

                    <div className="mt-6">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">Starts from</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {formatter.format(slide.price)}
                      </p>
                    </div>

                    <button className="group flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold py-3 px-8 mt-8 rounded-xl hover:bg-[#C05621] dark:hover:bg-[#ed8936] transition-all hover:scale-105 active:scale-95">
                      Learn More
                      <ChevronRightIcon size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                  </div>

                  {/* Gambar Produk - Terkendali dengan aspect ratio */}
                  <div className="relative w-full md:absolute md:right-4 md:bottom-4 md:w-1/2 h-64 md:h-[80%]">
                    <Image 
                      src={slide.img} 
                      alt={slide.title}
                      fill
                      priority
                      className="object-contain object-bottom p-4 drop-shadow-2xl"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigasi Dot */}
            <div className="absolute bottom-6 left-8 flex gap-2">
              {slides.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${currentIndex === idx ? 'w-8 bg-slate-800 dark:bg-white' : 'w-2 bg-slate-400/30'}`} 
                />
              ))}
            </div>
          </div>

          {/* BANNER KANAN (PROMO) */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-5 flex-1">
            <div className="flex-1 relative aspect-video xl:aspect-auto xl:h-full rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm border border-gray-100 dark:border-slate-800">
              <Image
                src="/assets/Best_seller.png"
                alt="Best Seller"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 relative aspect-video xl:aspect-auto xl:h-full rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm border border-gray-100 dark:border-slate-800">
              <Image
                src="/assets/Diskon_promo.png"
                alt="Discount Promo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero