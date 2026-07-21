'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WishlistStore = {
  items: string[];
  /** Runtime-only: set by Header after /api/auth/me — not persisted */
  _userId: string | null;

  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  /** Replace entire wishlist (used after server sync) */
  setItems: (productIds: string[]) => void;
  /** Called on login — marks user so mutations fire API calls */
  setUserId: (id: string | null) => void;
  clear: () => void;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      _userId: null,

      toggle: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
        if (get()._userId) {
          fetch('/api/wishlist/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          }).catch(() => {});
        }
      },

      isWishlisted: (productId) => get().items.includes(productId),

      setItems: (productIds) => set({ items: productIds }),

      setUserId: (id) => set({ _userId: id }),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'commerce-os-wishlist',
      // Don't persist _userId
      partialize: (state) => ({ items: state.items }),
    }
  )
);
