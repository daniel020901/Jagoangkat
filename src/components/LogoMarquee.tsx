"use client"
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const Logos = [
    { src: "/assets/krisbow.png", alt: "Krisbow Logo" },
    { src: "/assets/Leonerwigi.png", alt: "Leonerwigi Logo" },
    { src: "/assets/monotaro.png", alt: "Monotaro Logo" },
    { src: "/assets/sinarmas.png", alt: "Sinarmas Logo" },
    { src: "/assets/franklin.jfif", alt: "Franklin Logo" },
];

export default function LogoMarquee() {
    return (
        <div className='my-10 max-w-6xl mx-auto py-16'>
            <h1 className='text-4xl font-semibold text-foreground text-center uppercase tracking-tighter'>
                Our Partners
            </h1>

            <div className="mx-auto py-8 mt-10">
                
                <Marquee 
                    speed={60} 
                    gradient={true} 
                    gradientColor="var(--background)" 
                    gradientWidth={100}
                    pauseOnHover={true}
                >
                    {Logos.map((logo, index) => (
                        <div 
                            key={index} 
                            className=" relative mx-10 w-[360px] h-[180px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                        >
                            <Image 
                                src={logo.src} 
                                alt={logo.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                className="object-contain"
                                // Mempercepat loading untuk LCP
                                priority={index < 3} 
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    );
}