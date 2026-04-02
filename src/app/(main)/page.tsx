import HeroSection from "@/components/hero-section";
import ChooseUs from "@/components/choose-us";
import Testimonial from "@/components/testimonial";
import ProductList from "@/components/ProductList";
import Hero from "@/components/hero";
import LogoMarquee from "@/components/LogoMarquee";

export default function Home() {
  return (
    // Gunakan min-h-screen agar background konsisten
    // overflow-x-hidden untuk mencegah scroll ke samping yang bikin layout berantakan
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      
        <Hero />
      
      <LogoMarquee />

        <HeroSection />
        <ChooseUs />
        <Testimonial />
      
    </main>
  );
};
