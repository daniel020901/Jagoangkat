import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default  function HeroSection() {
    return (
    <section className="relative bg-primary/10 dark:bg-dark  py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Premium Lifting Equipment
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional grade lifting equipment for industrial applications. 
              Quality certified and built to last!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8 cursor-pointer">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" size="lg" className="text-lg px-8">
                    Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
 
    )
}