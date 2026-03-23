import { CartStoreActionsType, CartStoreStateType, CartItemType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Combine types for the store
type ExtendedActions = CartStoreActionsType & {
  getSummary: () => { subtotal: number; shipping: number; total: number};
};
type CartStoreType = CartStoreStateType & ExtendedActions;

const useCartStore = create<CartStoreType>()(
  persist(
    (set, get) => ({
      cart: [],
      hashHydrated: false,
      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.cart.find((p) => p.id === product.id);

          if (existingProduct) {
            // Gunakan .map() untuk membuat array baru dengan objek baru
            const updatedCart = state.cart.map((p) =>
              p.id === product.id
                ? { ...p, quantity: p.quantity + (product.quantity || 1) }
                : p
            );
            return { cart: updatedCart };
          }

          // Jika produk baru, tambahkan ke array
          return {
            cart: [...state.cart, { ...product, quantity: product.quantity || 1 }],
          };
        }),
      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== product.id),
        })),
      clearCart: () => set({ cart: [] }),
      getSummary: () => {
        const { cart } = get();
        
        // 1. Hitung Subtotal (Harga x Quantity)
        const subtotal = cart.reduce((acc, item) => {
          return acc + (item.price * item.quantity);
        }, 0);

        // 2. Hitung Ongkir (Contoh: 10.000 flat jika ada barang)
        const shipping = cart.length > 0 ? 10000 : 0;

        // 3. Total Tagihan
        const total = subtotal + shipping;

        return { subtotal, shipping, total };
      },
    }),

    
    {
      name: "cart-storage", // Nama di localStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hashHydrated = true;
      },
    }
  )
);

export default useCartStore;