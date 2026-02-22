'use client'

import Image from 'next/image'
import { Badge } from './ui/badge'
import { ChevronRightIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react';



const slides = [
    {
        id: 1,
        tag: "News",
        title : " Elevate your gear. Elevate your style.",
        price: 199999,
        img:"/assets/body_harness1.png",
        bgColor: "bg-gradient-to-br from-[#C05621]/20 to-[#C05621]/5 dark:from-[#C05621]/30 dark:to-slate-900",
        accentColor: "text-[#C05621] bg-[#C05621]/10 dark:bg-[#C05621]/20 dark:text-[#ed8936]"
    },
    {
        id: 2,
        tag: "Special Offer",
        title : "Premium Protection. Maximum Comfort.",
        price: 249000,
        img:"/assets/Spreader-Bar-Tekniko.jpeg",
        bgColor: "bg-[#ddd6ff] dark:bg-gradient-to-br dark:from-indigo-950 dark:to-slate-900",
        accentColor: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300"
    }
];



const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0, // Remove decimal digits for whole numbers
});



const LiveBadge = () => {
    return (

    <Badge
      variant="outline"
      className="flex items-center gap-3 w-fit mx-auto px-4 py-2 mb-12 mt-10 text-sm backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>

      <span className="text-muted-foreground text-lg">
        Pertama dan Terbesar di Indonesia
      </span>
    </Badge>
        
    )
}


const Hero = () => {
    const [ currentIndex, setCurrentIndex] = React.useState(0);

useEffect(() => {
    const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
}, []);


    return (
        <div>
            <LiveBadge />
            <div className='mx-6'>
                <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                    {/* BANNER UTAMA (CAROUSEL) */}
        <div className="relative flex-1 overflow-hidden rounded-3xl group border border-transparent dark:border-slate-800">
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div 
                key={slide.id} 
                className={`relative min-w-full flex flex-col md:flex-row items-center justify-between xl:min-h-100 transition-colors duration-500 ${slide.bgColor}`}
              >
                <div className='p-5 sm:p-16 z-10 w-full'>
                  <div className={`inline-flex items-center gap-3 pr-4 p-1 rounded-full text-xs sm:text-sm font-medium ${slide.accentColor}`}>
                    <span className="bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full shadow-sm">{slide.tag}</span> 
                    Free shipping on orders above $50! 
                    <ChevronRightIcon size={16} className='group-hover:ml-2 transition-all'/>
                  </div>
                  
                  <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#C05621] dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                    {slide.title}
                  </h2>

                  <div className='text-slate-800 dark:text-slate-200 text-sm font-medium mt-4 sm:mt-8'>
                    <p>Starts from</p>
                    <p className='text-3xl font-bold'>{formatter.format(slide.price)}</p>
                  </div>

                  <button className='bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 dark:hover:bg-white transition-all hover:scale-105 active:scale-95 cursor-pointer'>
                    Learn More
                  </button>
                </div>

                <Image 
                  className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm object-contain object-bottom transition-all items-center mb-8'
                  src={slide.img} alt="" width={600} height={600} priority
                />
              </div>
            ))}
          </div>

          {/* Navigasi Dot  */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 flex gap-2">
            {slides.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${currentIndex === idx ? 'w-6 bg-slate-800 dark:bg-slate-100' : 'w-2 bg-slate-400/50'}`} />
            ))}
          </div>
        </div>
                    <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                        <div className='flex-1 relative w-full h-full min-h-[300px] bg-orange-200 rounded-3xl overflow-hidden group cursor-pointer'>

                            <Image
                            src="/assets/Best_seller.png"
                            alt="10 Ton"
                            fill
                            priority
                            className='flex-1 relative w-full h-full min-h-[300px] bg-orange-200 rounded-3xl overflow-hidden group hover:scale-110 transition-all duration-300'
                            />
                        </div>
                        <div className='flex-1 relative w-full h-full min-h-[300px] bg-orange-200 rounded-3xl overflow-hidden group cursor-pointer'>

                            <Image
                            src="/assets/Diskon_promo.png"
                            alt="10 Ton"
                            fill
                            priority
                            className='flex-1 relative w-full h-full min-h-[300px] bg-orange-200 rounded-3xl overflow-hidden group hover:scale-110 transition-all duration-300'
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero