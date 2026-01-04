import { Card } from "../components/ui/card";
import { Truck, Shield, RefreshCw, Package } from "lucide-react";

export default  function ChooseUs() {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-foreground">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-for">Mengapa Memilih Kami?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen untuk memberikan produk terbaik dan pengalaman berbelanja yang tak tertandingi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-sm text-muted-foreground">
                Pengiriman gratis dan cepat untuk semua pesanan di atas Rp 500.000
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Garansi 100%</h3>
              <p className="text-sm text-muted-foreground">
                Jaminan keaslian produk dan garansi uang kembali 30 hari
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Layanan 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Tim support kami siap membantu Anda kapan saja
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Kualitas Premium</h3>
              <p className="text-sm text-muted-foreground">
                Produk berkualitas tinggi dari brand ternama dan terpercaya
              </p>
            </Card>
          </div>
        </div>
      </section>

    
    )
}