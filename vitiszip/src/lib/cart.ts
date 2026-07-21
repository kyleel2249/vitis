'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variant?: string;
  vendorId?: string;
  vendorName?: string;
};

type CartStore = {
  items: CartItem[];
  /** Runtime-only: set by Header after /api/auth/me — not persisted */
  _userId: string | null;

  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;

  /** Replace entire cart (used after server sync) */
  setItems: (items: CartItem[]) => void;
  /** Called on login — marks user so mutations fire API calls */
  setUserId: (id: string | null) => void;

  totalItems: () => number;
  totalPrice: () => number;
  isInCart: (productId: string, variant?: string) => boolean;
};

function apiUpsert(item: Omit<CartItem, 'quantity'> & { quantity?: number }, quantity: number) {
  fetch('/api/cart/item', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...item, quantity }),
  }).catch(() => {});
}

function apiRemove(productId: string, variant: string) {
  fetch(`/api/cart/item?productId=${encodeURIComponent(productId)}&variant=${encodeURIComponent(variant)}`, {
    method: 'DELETE',
  }).catch(() => {});
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _userId: null,

      addItem: (item) => {
        let newQuantity = item.quantity || 1;
        set((state) => {
          const key = item.productId + (item.variant || '');
          const existing = state.items.find(
            (i) => i.productId + (i.variant || '') === key
          );
          if (existing) {
            newQuantity = existing.quantity + (item.quantity || 1);
            return {
              items: state.items.map((i) =>
                i.productId + (i.variant || '') === key
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          };
        });
        if (get()._userId) apiUpsert(item, newQuantity);
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && (i.variant || '') === (variant || ''))
          ),
        }));
        if (get()._userId) apiRemove(productId, variant || '');
      },

      updateQuantity: (productId, quantity, variant) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.productId === productId && (i.variant || '') === (variant || ''))
                )
              : state.items.map((i) =>
                  i.productId === productId && (i.variant || '') === (variant || '')
                    ? { ...i, quantity }
                    : i
                ),
        }));
        const { _userId, items } = get();
        if (_userId) {
          if (quantity <= 0) {
            apiRemove(productId, variant || '');
          } else {
            const item = items.find(
              (i) => i.productId === productId && (i.variant || '') === (variant || '')
            );
            if (item) apiUpsert(item, quantity);
          }
        }
      },

      clearCart: () => set({ items: [] }),

      setItems: (items) => set({ items }),

      setUserId: (id) => set({ _userId: id }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      isInCart: (productId, variant) =>
        get().items.some(
          (i) => i.productId === productId && (i.variant || '') === (variant || '')
        ),
    }),
    {
      name: 'commerce-os-cart',
      // Don't persist _userId — it's always resolved fresh from /api/auth/me on mount
      partialize: (state) => ({ items: state.items }),
    }
  )
);
