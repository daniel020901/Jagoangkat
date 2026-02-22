import HeroSection from "@/components/hero-section";
import ChooseUs from "@/components/choose-us";
import Testimonial from "@/components/testimonial";
import ProductList from "@/components/ProductList";
import Hero from "@/components/hero";
import LogoMarquee from "@/components/LogoMarquee";

export default function Home() {

  return (
    <div>
      <Hero/>
      <LogoMarquee />
      <HeroSection />
      <ChooseUs />
      <Testimonial />
    </div>
  );
};
