"use client";

import { shippingFormInputs } from "@/types";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import ShippingForm from "@/components/ShippingForm";
import PaymentForm from "@/components/PaymentForm";
import Image from "next/image";
import useCartStore from "@/stores/cartStore";

const steps = [
  { id: 1, title: "Shopping Cart" },
  { id: 2, title: "Shipping Address" },
  { id: 3, title: "Payment Method" },
];

const CartPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<shippingFormInputs | null>(null);

  const activeStep = parseInt(searchParams.get("step") || "1");
  const { cart, removeFromCart } = useCartStore();

  // Menghitung ringkasan biaya secara efisien
  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = subtotal * 0.1; // Diskon 10%
    const shipping = cart.length > 0 ? 10000 : 0;
    return {
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
    };
  }, [cart]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-34">
      <div className="flex flex-col gap-8 items-center">
        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Your Shopping Cart</h1>

        {/* Steps Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-12 w-full max-w-3xl">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 border-b-2 pb-3 transition-colors ${
                step.id === activeStep ? "border-zinc-800 dark:border-white" : "border-transparent text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step.id === activeStep ? "bg-zinc-800 dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-zinc-800"
                }`}
              >
                {step.id}
              </div>
              <p className={`text-sm font-semibold ${step.id === activeStep ? "text-zinc-800 dark:text-white" : ""}`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col lg:flex-row gap-10 mt-4">
          
          {/* Left Column: Cart Items / Forms */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm min-h-[400px]">
              {activeStep === 1 ? (
                cart.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {cart.map((item) => {
                      const itemImages = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                      const displayImage = (Array.isArray(itemImages) && itemImages.length > 0) 
                        ? itemImages[0].replace(/['"]+/g, '') 
                        : "/placeholder.jpg";

                      return (
                        <div className="flex items-center justify-between group" key={`${item.id}-${item.sku}`}>
                          <div className="flex gap-6 items-center">
                            {/* Product Image */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700 flex-shrink-0">
                              <Image
                                src={displayImage}
                                alt={item.name}
                                fill
                                className="object-contain p-2 group-hover:scale-105 transition-transform"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.name}</p>
                              <div className="flex flex-wrap gap-2 items-center text-[11px] text-gray-500">
                                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-medium">Qty: {item.quantity}</span>
                                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-medium">SKU: {item.sku}</span>
                                <span className="px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded font-bold">{item.capacityTon} Ton</span>
                              </div>
                              <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                                Rp {item.price.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>

                          {/* Action Delete */}
                          <button 
                            onClick={() => removeFromCart(item)} 
                            className="p-2.5 rounded-full bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                    <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold">Keranjang kosong</p>
                      <p className="text-sm text-gray-500">Belum ada alat angkat berat yang ditambahkan.</p>
                    </div>
                    <button onClick={() => router.push("/")} className="text-sm font-bold text-orange-600 hover:underline">Mulai belanja</button>
                  </div>
                )
              ) : activeStep === 2 ? (
                <ShippingForm setShippingForm={setShippingForm} />
              ) : activeStep === 3 && shippingForm ? (
                <PaymentForm />
              ) : (
                <div className="py-20 text-center">
                  <p className="text-sm text-gray-500 italic">Lengkapi data pengiriman untuk melanjutkan pembayaran.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm sticky top-8">
              <h2 className="font-bold text-lg mb-6 border-b border-gray-50 dark:border-zinc-800 pb-4">Ringkasan Pesanan</h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Subtotal Produk</p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Rp {totals.subtotal.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Diskon Member (10%)</p>
                  <p className="font-semibold text-green-600">- Rp {totals.discount.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Estimasi Ongkir</p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Rp {totals.shipping.toLocaleString("id-ID")}</p>
                </div>
                
                <hr className="border-gray-100 dark:border-zinc-800 my-2" />

                <div className="flex justify-between items-center">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Total Tagihan</p>
                  <p className="font-black text-xl text-orange-600">
                    Rp {totals.total.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {activeStep === 1 && cart.length > 0 && (
                <button
                  onClick={() => router.push("/cart?step=2", { scroll: true })}
                  className="w-full mt-8 bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  Lanjut ke Pengiriman
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;