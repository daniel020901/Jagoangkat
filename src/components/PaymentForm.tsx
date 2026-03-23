"use client";

import { shippingFormInputs } from "@/types";
import { ShoppingCart, CreditCard, Building2, Wallet, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useCartStore from "@/stores/cartStore";
import { useState } from "react";

type PaymentMethod = "CREDIT_CARD" | "BANK_TRANSFER" | "E_WALLET" | "COD";

type PaymentFormProps = {
  shippingForm: shippingFormInputs;
};
type BankOption = {
  name: string;
  no_rek: string;
  owner: string;
};
const BANK_OPTIONS : BankOption[] = [{ name: "BCA", no_rek: "8213123123", owner: "PT Jagoangkat Indonesia" },
  { name: "BNI", no_rek: "9912381234", owner: "PT Jagoangkat Indonesia" },
  { name: "Mandiri", no_rek: "123000991223", owner: "PT Jagoangkat Indonesia" },
  { name: "BRI", no_rek: "001201001234", owner: "PT Jagoangkat Indonesia" },
];
const EWALLET_OPTIONS = ["GoPay", "OVO", "Dana", "ShopeePay"];

const PaymentForm = ({ shippingForm }: PaymentFormProps) => {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tentukan paymentMethod string yang dikirim ke API
  const getPaymentMethodValue = (): string | null => {
    if (selectedMethod === "CREDIT_CARD") return "CREDIT_CARD";
    if (selectedMethod === "BANK_TRANSFER" && selectedBank) return `BANK_TRANSFER_${selectedBank.name}`;
    if (selectedMethod === "E_WALLET" && selectedWallet) return `EWALLET_${selectedWallet.toUpperCase()}`;
    if (selectedMethod === "COD") return "COD";
    return null;
  };

  const isReadyToCheckout = (): boolean => {
    if (!selectedMethod) return false;
    if (selectedMethod === "BANK_TRANSFER" && !selectedBank) return false;
    if (selectedMethod === "E_WALLET" && !selectedWallet) return false;
    return true;
  };

  const handleCheckout = async () => {
    const paymentMethod = getPaymentMethodValue();
    if (!paymentMethod) return;

    const confirmed = window.confirm(
      `Konfirmasi pesanan dengan pembayaran ${paymentMethod}`
    )

    if(!confirmed) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingAddress: `${shippingForm.address}, ${shippingForm.city}`,
          paymentMethod,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.message || "Gagal membuat pesanan");
        return;
      }

      clearCart();
      router.push(`/orders/${result.id}`);

    } catch (error) {
      setErrorMessage("Terjadi kesalahan, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Pilih Metode */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: "CREDIT_CARD", label: "Kartu Kredit/Debit", icon: CreditCard },
          { id: "BANK_TRANSFER", label: "Transfer Bank", icon: Building2 },
          { id: "E_WALLET", label: "E-Wallet", icon: Wallet },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setSelectedMethod(id as PaymentMethod);
              setSelectedBank(null);
              setSelectedWallet(null);
            }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
              selectedMethod === id
                ? "border-zinc-800 dark:border-white bg-zinc-50 dark:bg-zinc-800"
                : "border-gray-200 dark:border-zinc-700 hover:border-gray-400"
            }`}
          >
            <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-300 flex-shrink-0" />
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{label}</span>
          </button>
        ))}
      </div>

      {/* Detail per metode */}

      {/* Credit Card */}
      {selectedMethod === "CREDIT_CARD" && (
        <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Detail Kartu</p>
          <div className="flex items-center gap-2">
            <Image src="/atm.jpg" alt="atm" width={40} height={24} className="rounded"/>
            <Image src="/prima.jpg" alt="prima" width={40} height={24} className="rounded"/>
            <Image src="/cards.png" alt="cards" width={40} height={24} className="rounded"/>
          </div>
          <p className="text-xs text-gray-400 italic">
            Pembayaran kartu diproses secara simulasi untuk keperluan demo.
          </p>
        </div>
      )}

      {/* Bank Transfer */}
      {selectedMethod === "BANK_TRANSFER" && (
        <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pilih Bank</p>
          <div className="grid grid-cols-2 gap-2">
            {BANK_OPTIONS.map((bank) => (
              <button
                key={bank.name}
                type="button"
                onClick={() => setSelectedBank(bank)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedBank?.name === bank.name
                    ? "border-zinc-800 dark:border-white bg-white dark:bg-zinc-700"
                    : "border-gray-200 dark:border-zinc-600 hover:border-gray-400"
                }`}
              >
                {bank.name}
              </button>
            ))}
          </div>
          {selectedBank && (
            <div className="mt-1 p-3 bg-white dark:bg-zinc-700 rounded-lg text-sm">
              <p className="text-gray-500 text-xs mb-1">No. Rekening {selectedBank.name}</p>
              <p className="font-bold tracking-widest text-zinc-800 dark:text-white">{selectedBank.no_rek}</p>
              <p className="text-xs text-gray-400 mt-1">a.n. {selectedBank.owner}</p>
            </div>
          )}
        </div>
      )}

      {/* E-Wallet */}
      {selectedMethod === "E_WALLET" && (
        <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pilih E-Wallet</p>
          <div className="grid grid-cols-2 gap-2">
            {EWALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet}
                type="button"
                onClick={() => setSelectedWallet(wallet)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedWallet === wallet
                    ? "border-zinc-800 dark:border-white bg-white dark:bg-zinc-700"
                    : "border-gray-200 dark:border-zinc-600 hover:border-gray-400"
                }`}
              >
                {wallet}
              </button>
            ))}
          </div>
          {selectedWallet && (
            <p className="text-xs text-gray-400 italic mt-1">
              Kamu akan diarahkan ke aplikasi {selectedWallet} setelah checkout (simulasi).
            </p>
          )}
        </div>
      )}

     

      {/* Checkout Button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={!isReadyToCheckout() || isLoading}
        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isLoading ? "Memproses..." : "Checkout"}
        {!isLoading && <ShoppingCart className="w-4 h-4" />}
      </button>

    </div>
  );
};

export default PaymentForm;