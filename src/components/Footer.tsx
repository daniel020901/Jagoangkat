'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ChevronUp,
  Package,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  Users,
  Award,
  Globe
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ]

  const companyLinks = [
    { href: '/about', label: 'Tentang Kami' },
    { href: '/products', label: 'Produk' },
    { href: '/services', label: 'Layanan' },
    { href: '/career', label: 'Karir' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Kontak' }
  ]

  const supportLinks = [
    { href: '/help', label: 'Pusat Bantuan' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Info Pengiriman' },
    { href: '/returns', label: 'Kebijakan Retur' },
    { href: '/warranty', label: 'Garansi' },
    { href: '/track-order', label: 'Track Pesanan' }
  ]

  const legalLinks = [
    { href: '/privacy', label: 'Kebijakan Privasi' },
    { href: '/terms', label: 'Syarat & Ketentuan' },
    { href: '/cookies', label: 'Kebijakan Cookie' },
    { href: '/compliance', label: 'Kepatuhan' }
  ]

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: ' QRIS ', icon: '📱'},
    { name: 'Transfer Bank', icon: '🏦' }
  ]

  const certifications = [
    { name: 'ISO 9001', icon: Award },
    { name: 'SNI', icon: Shield },
    { name: 'HSE', icon: Shield }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <section className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Dapatkan Penawaran Terbaik</h3>
              <p className="text-gray-400 mb-6">
                Subscribe newsletter kami untuk mendapatkan informasi produk terbaru, 
                promo eksklusif, dan tips industri lifting.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Gratis Ongkir</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">Garansi 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm">Produk Bersertifikat</span>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  Subscribe
                </Button>
              </form>
              {subscribed && (
                <p className="text-green-400 mt-2 text-sm">
                  ✓ Terima kasih telah berlangganan!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h4 className="text-2xl font-bold mb-4 text-primary">Jagoangkat.id</h4>
              <p className="text-gray-400 mb-6">
                Leader dalam industri webbing sling dan peralatan lifting di Indonesia. 
                Menyediakan produk berkualitas tinggi dengan standar keselamatan internasional 
                sejak tahun 2009.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Jl. Industri Raya No. 123, Jakarta Utara, 14440
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">+62 21 5555 1234</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@webbingslingpro.co.id</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 12:00
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="font-semibold mb-4">Ikuti Kami</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-6">Perusahaan</h5>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-semibold mb-6">Layanan</h5>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold mb-6">Legal</h5>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-800">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h6 className="font-semibold mb-1">Pengiriman Cepat</h6>
            <p className="text-gray-400 text-xs">Gratis ongkir minimum pembelian</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h6 className="font-semibold mb-1">Garansi 100%</h6>
            <p className="text-gray-400 text-xs">Uang kembali 30 hari</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h6 className="font-semibold mb-1">Support 24/7</h6>
            <p className="text-gray-400 text-xs">Tim siap membantu kapan saja</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h6 className="font-semibold mb-1">Tersertifikasi</h6>
            <p className="text-gray-400 text-xs">ISO 9001 & SNI</p>
          </div>
        </div>

        {/* Payment Methods & Certifications */}
        <div className="mt-12 pt-12 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-semibold mb-4">Metode Pembayaran</h5>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800 px-3 py-2 rounded-lg flex items-center gap-2"
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm text-gray-400">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Sertifikasi</h5>
              <div className="flex gap-4">
                {certifications.map((cert, index) => {
                  const Icon = cert.icon
                  return (
                    <div 
                      key={index}
                      className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-gray-400">{cert.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Webbing Sling Pro. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-600 text-white">
                <Globe className="h-3 w-3 mr-1" />
                Made in Indonesia
              </Badge>
              <span className="text-gray-400 text-sm">
                Powered by Jagoangkat
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-40"
        aria-label="Back to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </footer>
  )
}