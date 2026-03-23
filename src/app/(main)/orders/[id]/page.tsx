import { CheckCircle, Package, MapPin, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getOrderByIdService } from "@/lib/services/order-service";
import { Decimal } from "@prisma/client/runtime/client";

type Props = {
  params: Promise<{ id: string }>;
};

const OrderDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const order = await getOrderByIdService(id);

  const formatRupiah = (amount: number | string | Decimal) =>
    `Rp ${Number(amount).toLocaleString("id-ID")}`;

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "Menunggu Konfirmasi",
    PROCESSING: "Sedang Diproses",
    SHIPPED: "Dalam Pengiriman",
    DELIVERED: "Terkirim",
    CANCELLED: "Dibatalkan",
  };

  const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    PROCESSING: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    SHIPPED: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    DELIVERED: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
    CANCELLED: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const subtotal = order.orderItems.reduce(
  (sum, item) => sum + Number(item.price) * item.quantity,
  0
);
const shippingFee = Number(order.totalAmount) - subtotal;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24 font-sans">
      <div className="flex flex-col gap-6">

        {/* Success Banner */}
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-6 flex items-center gap-4 transition-colors">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-bold text-green-800 dark:text-green-300">Order berhasil dibuat!</p>
            <p className="text-sm text-green-600 dark:text-green-500 mt-0.5">
              No. Order: <span className="font-mono font-bold tracking-tight">{order.orderNumber}</span>
            </p>
          </div>
        </div>

        {/* Order Status Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 dark:bg-zinc-800 p-2.5 rounded-xl">
                <Package className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Status Order</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                  {STATUS_LABEL[order.status] ?? order.status}
                </p>
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLOR[order.status]}`}>
              {order.status}
            </span>
          </div>

          <hr className="my-4 border-gray-100 dark:border-zinc-800" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Tanggal Order</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Total Tagihan</p>
              <p className="font-black text-orange-600">{formatRupiah(order.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">Item Pesanan</p>
          <div className="flex flex-col gap-5">
            {order.orderItems.map((item) => {
              const images = Array.isArray(item.product.images)
                ? item.product.images
                : JSON.parse(item.product.images as unknown as string);
              const displayImage = images?.[0]?.replace(/['"]+/g, "") ?? "/placeholder.jpg";

              return (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="relative w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700 flex-shrink-0">
                    <Image
                      src={displayImage}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {item.product.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[11px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-medium text-gray-500">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-medium text-gray-500">
                        SKU: {item.product.sku}
                      </span>
                      {item.product.capacityTon && (
                        <span className="text-[11px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded font-bold">
                          {item.product.capacityTon} Ton
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm flex-shrink-0">
                    {formatRupiah(item.price)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Subtotal Produk</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {formatRupiah(subtotal)}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Ongkir</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{formatRupiah(shippingFee)}</p>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Total</p>
              <p className="font-black text-xl text-orange-600">{formatRupiah(order.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Alamat Pengiriman</p>
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{order.user.name}</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {order.shippingAddress ?? "-"}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                <CreditCard className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pembayaran</p>
            </div>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {order.payment?.paymentMethod?.replace(/_/g, " ") ?? "—"}
            </p>
            <div className={`mt-2 inline-flex text-xs font-bold px-2.5 py-1 rounded-full border ${
              order.payment?.status === "COMPLETED"
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-800"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800"
            }`}>
              {order.payment?.status ?? "PENDING"}
            </div>
          </div>
        </div>

        {/* Responsive Payment Action Alert */}
        {order.status === "PENDING" && order.payment?.status !== "COMPLETED" && (
          <div className="group relative overflow-hidden bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50 transition-opacity" />
            
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  <p className="text-sm font-bold text-orange-900 dark:text-orange-300">
                    Menunggu Pembayaran
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-400/80 leading-relaxed max-w-md">
                  Silakan selesaikan pembayaran agar pesanan <span className="font-mono font-bold">#{order.orderNumber}</span> dapat segera kami proses.
                </p>
              </div>

              <button className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 dark:bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-700 dark:hover:bg-orange-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-orange-600/20 dark:shadow-orange-900/40 flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Bayar Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] text-sm"
          >
            Lanjut Belanja
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/orders"
            className="flex-1 border border-gray-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-4 rounded-xl font-bold hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            Riwayat Order
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;