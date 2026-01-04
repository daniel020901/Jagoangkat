import { Card, CardContent } from "../components/ui/card";
import { Star } from "lucide-react";

export default function Testimonial() {
    return (
        <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Trusted by industry professionals worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-foreground mb-4">
                    Excellent quality lifting equipment. Fast delivery and great customer
                    service. Will definitely order again!
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-gray-600">Construction Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    
    )}