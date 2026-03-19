import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'PayPal',

      addToCart: async (product, qty) => {
        // Optimistic update logic
        const { cartItems } = get();
        const existItem = cartItems.find((x) => x._id === product._id);

        const itemToAdd = { ...product, qty };

        if (existItem) {
          set({
            cartItems: cartItems.map((x) => (x._id === existItem._id ? itemToAdd : x)),
          });
        } else {
          set({ cartItems: [...cartItems, itemToAdd] });
        }

        // Sync with backend if user is logged in could be handled separately or here.
        // For simplicity, we are managing cart locally and syncing on login/checkout or a separate effect.
        // Actually, the backend API for cart was create/update.
        // Let's stick to local state for speed and UI responsiveness, and sync when needed.
      },

      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter((x) => x._id !== id),
        });
      },

      saveShippingAddress: (data) => {
        set({ shippingAddress: data });
      },

      savePaymentMethod: (data) => {
        set({ paymentMethod: data });
      },

      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
