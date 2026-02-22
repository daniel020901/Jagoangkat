'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Award, 
  Globe, 
  Shield, 
  Truck, 
  Headphones,
  Target,
  Lightbulb,
  Heart,
  ArrowRight,
  CheckCircle,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const stats = [
    { label: 'Tahun Pengalaman', value: '15+', icon: Award },
    { label: 'Pelanggan Puas', value: '10,000+', icon: Users },
    { label: 'Produk Terjual', value: '50,000+', icon: Package },
    { label: 'Kota Terjangkau', value: '100+', icon: Globe }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Kepercayaan',
      description: 'Kami membangun kepercayaan melalui produk berkualitas dan layanan yang konsisten.'
    },
    {
      icon: Target,
      title: 'Komitmen',
      description: 'Dedikasi penuh untuk memberikan solusi lifting dan rigging terbaik bagi industri.'
    },
    {
      icon: Lightbulb,
      title: 'Inovasi',
      description: 'Selalu mengadopsi teknologi terbaru dan metode inovatif dalam produk kami.'
    },
    {
      icon: Heart,
      title: 'Pelanggan',
      description: 'Kepuasan pelanggan adalah prioritas utama dalam setiap keputusan kami.'
    }
  ]

  const milestones = [
    { year: '2009', title: 'Perusahaan Didirikan', description: 'Memulai perjalanan sebagai distributor kecil peralatan lifting' },
    { year: '2012', title: 'Ekspansi Produk', description: 'Menambahkan berbagai jenis webbing sling dan aksesoris rigging' },
    { year: '2015', title: 'Sertifikasi ISO', description: 'Mendapatkan sertifikasi ISO 9001 untuk manajemen kualitas' },
    { year: '2018', title: 'Go Digital', description: 'Meluncurkan platform e-commerce untuk kemudahan pelanggan' },
    { year: '2021', title: 'Ekspansi Nasional', description: 'Melayani pelanggan di seluruh Indonesia dengan jaringan distribusi luas' },
    { year: '2024', title: 'Inovasi Berkelanjutan', description: 'Meluncurkan produk generasi baru dengan teknologi terkini' }
  ]

  const team = [
    {
      name: 'Adrian J Turangan',
      position: 'CEO & Founder',
      description: '15+ tahun pengalaman dalam industri lifting dan rigging'
    },
    {
      name: 'Pak Agam',
      position: 'Operations Manager',
      description: 'Ahli logistik dan manajemen rantai pasokan'
    },
    {
      name: 'Ahmad Wijaya',
      position: 'Technical Director',
      description: 'Spesialis sertifikasi dan keamanan produk industri'
    },
    {
      name: 'Maya Putri',
      position: 'Customer Service Head',
      description: 'Kepemimpinan dalam layanan pelanggan yang prima'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
 

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Tentang Perusahaan
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Kami adalah leader dalam industri webbing sling dan peralatan lifting di Indonesia, 
              berkomitmen untuk menyediakan produk berkualitas tinggi dengan standar keselamatan internasional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8">
                  Lihat Produk Kami
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Cerita Kami</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Berdiri sejak tahun 2009, kami memulai perjalanan sebagai distributor kecil peralatan lifting 
                  di Jakarta. Dengan visi untuk menyediakan produk berkualitas dengan harga terjangkau, kami 
                  secara perlahan membangun reputasi sebagai supplier terpercaya.
                </p>
                <p>
                  Seiring berjalannya waktu, kami terus berkembang dan berinovasi. Hari ini, kami telah menjadi 
                  salah satu supplier terkemuka webbing sling dan peralatan rigging di Indonesia, melayani ribuan 
                  pelanggan dari berbagai industri.
                </p>
                <p>
                  Komitmen kami terhadap kualitas dan keselamatan tidak pernah berubah. Setiap produk yang kami 
                  jual melalui proses inspeksi ketat dan disertifikasi sesuai standar internasional.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Produk Tersertifikasi</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Dukungan Teknis</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">30 Hari</div>
                <div className="text-sm text-muted-foreground">Garansi Uang Kembali</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">Gratis</div>
                <div className="text-sm text-muted-foreground">Ongkir Minimum Pembelian</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Prinsip-prinsip yang memandu setiap keputusan dan tindakan kami
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perjalanan Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Milestone penting dalam sejarah perusahaan kami
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary mb-1">{milestone.year}</div>
                    <h3 className="font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tim Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Profesional berpengalaman yang siap melayani kebutuhan Anda
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-3">{member.position}</Badge>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Bekerja Sama dengan Kami?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Bergabunglah dengan ribuan pelanggan puas yang telah mempercayai kami untuk kebutuhan lifting dan rigging mereka
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Jelajahi Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Konsultasi Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}