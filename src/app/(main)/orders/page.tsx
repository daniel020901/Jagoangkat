import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronRight, Clock, CreditCard, ShoppingBag } from "lucide-react";
import { Decimal } from "@prisma/client/runtime/client";
import { getUserOrdersService } from "@/lib/services/order-service";

export default async function OrdersPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const orders = await getUserOrdersService(session.user.id); 

  const formatRupiah = (amount: number | string | Decimal ) =>
    
      `Rp ${Number(amount).toLocaleString("id-ID")}`;

    
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Pesanan Saya
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            Pantau status pengiriman dan riwayat belanja Anda.
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold">{orders.length} Total Pesanan</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem]">
          <div className="bg-zinc-200 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Belum ada pesanan</h3>
          <p className="text-zinc-500 text-sm mt-1 mb-6">Sepertinya Anda belum melakukan pembelian apapun.</p>
          <Link href="/" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
            >
              <div className="p-6 sm:p-8">
                {/* Top Row: Info & Status */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl">
                      <Clock className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tanggal Transaksi</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${
                      order.payment?.status === "COMPLETED"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20"
                        : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 border-orange-100 dark:border-orange-500/20"
                    }`}>
                      {order.payment?.status || "PENDING"}
                    </span>
                    <p className="text-[10px] font-mono mt-1 text-zinc-400">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Middle Row: Product Preview */}
                <div className="flex items-center gap-6 py-6 border-y border-zinc-100 dark:border-zinc-800">
                  <div className="relative w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-700 flex-shrink-0">
                    <Image 
                      src={(order.orderItems[0]?.product?.images as string[])[0] || "/placeholder.jpg"} 
                      alt="product" fill className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-900 dark:text-white line-clamp-1 lowercase first-letter:uppercase">
                      {order.orderItems[0]?.product?.name}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      {order.orderItems.length > 1 
                        ? `+ ${order.orderItems.length - 1} produk lainnya` 
                        : "1 item dipesan"}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Belanja</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white">
                      {formatRupiah(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                    <CreditCard className="w-4 h-4" />
                    <span>{order.payment?.paymentMethod?.replace(/_/g, " ")}</span>
                  </div>

                  <div className="flex w-full sm:w-auto gap-3">
                    <Link 
                      href={`/orders/${order.id}`}
                      className="flex-1 sm:flex-none text-center px-6 py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Lihat Detail
                    </Link>
                    
                    {order.payment?.status !== "COMPLETED" && (
                      <Link 
                        href={`/orders/${order.id}`}
                        className="flex-1 sm:flex-none text-center px-6 py-3 text-xs font-black bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                      >
                        Bayar Sekarang
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}