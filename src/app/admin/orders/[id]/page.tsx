import { getOrderByIdService, updateOrderStatusService } from "@/lib/services/order-service";
import { Package, MapPin, CreditCard, User, ArrowLeft, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/client";
import { StatusForm } from "./_components/status-form";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderByIdService(id);

  if (!order) return <div className="p-20 text-center">Pesanan tidak ditemukan.</div>;

  

  const formatCurrency = (amount: number | string | Decimal) => 
    `Rp ${Number(amount).toLocaleString("id-ID")}`;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/orders" className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 mb-8 font-bold text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar Pesanan
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8">
              <h2 className="text-lg font-black mb-6 flex items-center gap-3">
                <Package className="w-5 h-5 text-orange-500" /> Manajemen Status
              </h2>
              <StatusForm
            orderId={id}
            currentStatus={order.status}
            paymentStatus={order.payment?.status}
                />

              {order.payment?.status !== "COMPLETED" && (
                <div className="mt-6 p-4 bg-orange-100/50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-900/50 rounded-2xl flex items-center gap-3 text-orange-700 dark:text-orange-400 text-[11px] font-bold">
                  <AlertCircle className="w-4 h-4" />
                  Pembayaran Belum Lunas. Tombol Processing/Shipped terkunci oleh sistem.
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-xs font-black uppercase text-zinc-400 mb-8 tracking-widest">Daftar Produk</h3>
              <div className="space-y-6">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="relative w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0">
                      <Image src={(item.product.images as string[])[0] || "/placeholder.jpg"} alt="unit" fill className="object-contain p-2" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base leading-tight">{item.product.name}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-1">Qty: {item.quantity} | SKU: {item.product.sku}</p>
                    </div>
                    <p className="font-black text-orange-600">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black uppercase text-zinc-400 mb-6 flex items-center gap-2 tracking-widest">
                <User className="w-4 h-4 text-blue-500" /> Customer
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Nama</p>
                  <p className="font-bold text-sm">{order.user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Email</p>
                  <p className="font-bold text-sm text-blue-500 break-all">{order.user.email}</p>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Alamat
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-1 italic">{order.shippingAddress}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-xs font-black uppercase text-zinc-500 mb-6 flex items-center gap-2 tracking-widest">
                <CreditCard className="w-4 h-4 text-emerald-500" /> Pembayaran
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Status</span>
                  <span className={`font-black ${order.payment?.status === "COMPLETED" ? "text-emerald-400" : "text-orange-400"}`}>
                    {order.payment?.status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-zinc-500 font-black">TOTAL</span>
                  <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}