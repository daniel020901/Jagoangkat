"use client";

import { useActionState, useState } from "react";
import { updateStatusAction } from "../actions";
import { ORDER_STATUS } from "@/types";
import type { OrderStatus, PaymentStatus } from "@/types";
import { AlertCircle, CheckCircle, Pencil, X, Save } from "lucide-react";

const REQUIRES_PAYMENT = new Set<OrderStatus>(["PROCESSING", "SHIPPED", "DELIVERED"]);
const FINAL_STATES      = new Set<OrderStatus>(["DELIVERED", "CANCELLED"]);

interface Props {
  orderId:       string;
  currentStatus: OrderStatus;
  paymentStatus: PaymentStatus | undefined;
}

export function StatusForm({ orderId, currentStatus, paymentStatus }: Props) {
  const [error, formAction, isPending] = useActionState(updateStatusAction, null);
  const [isEditing, setIsEditing]      = useState(false);
  const [selected, setSelected]        = useState<OrderStatus>(currentStatus);

  const isFinal = FINAL_STATES.has(currentStatus);

  function isOptionDisabled(s: OrderStatus): boolean {
    if (s === currentStatus) return false; // tetap bisa dipilih untuk preview
    if (REQUIRES_PAYMENT.has(s) && paymentStatus !== "COMPLETED") return true;
    if (paymentStatus === "REFUNDED" && s !== "CANCELLED") return true;
    return false;
  }

  function handleCancel() {
    setSelected(currentStatus); // reset ke status awal
    setIsEditing(false);
  }

  return (
    <div className="space-y-4">

      {/* ── Status badge + tombol Edit ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
            Status saat ini
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-black
            ${currentStatus === "DELIVERED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
              currentStatus === "CANCELLED" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              currentStatus === "SHIPPED"   ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
              currentStatus === "PROCESSING"? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}
          >
            {currentStatus}
          </span>
        </div>

        {/* Tombol Edit — sembunyikan jika final state */}
        {!isFinal && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border border-zinc-200 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
          >
            <Pencil className="w-3 h-3" /> Edit Status
          </button>
        )}
      </div>

      {/* ── Mode Edit ── */}
      {isEditing && (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="status"  value={selected} />

          {/* Dropdown pilih status */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">
              Pilih status baru
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ORDER_STATUS).map((s) => {
                const disabled = isOptionDisabled(s);
                const isActive = selected === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setSelected(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border
                      ${isActive
                        ? "bg-orange-500 text-white border-transparent shadow-md"
                        : disabled
                          ? "opacity-40 cursor-not-allowed border-zinc-200 dark:border-zinc-700 text-zinc-400"
                          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-orange-400"
                      }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warning payment gate */}
          {paymentStatus !== "COMPLETED" && (
            <div className="p-3 bg-orange-100/50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-900/50 rounded-2xl flex items-center gap-3 text-orange-700 dark:text-orange-400 text-[11px] font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Pembayaran belum lunas. PROCESSING / SHIPPED / DELIVERED dikunci.
            </div>
          )}

          {/* Error dari server */}
          {error && (
            <div className="p-3 bg-red-100/50 dark:bg-red-500/10 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-400 text-[11px] font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Tombol Simpan & Batal */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending || selected === currentStatus}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-3 h-3" />
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black border border-zinc-200 dark:border-zinc-700 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 disabled:opacity-50 transition-all"
            >
              <X className="w-3 h-3" /> Batal
            </button>
          </div>
        </form>
      )}

      {/* ── Final state info ── */}
      {isFinal && (
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center gap-3 text-zinc-500 text-[11px] font-bold">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Order sudah {currentStatus} dan tidak dapat diubah lagi.
        </div>
      )}
    </div>
  );
}