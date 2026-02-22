import { CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Combine types for the store
type CartStoreType = CartStoreStateType & CartStoreActionsType;

const useCartStore = create<CartStoreType>()(
  persist(
    (set) => ({
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