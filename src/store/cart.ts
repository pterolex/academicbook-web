"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  code: string;
  titleUa: string;
  titleRu: string;
  price: number;
  qty: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (code: string) => void;
  setQty: (code: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.code === item.code);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.code === item.code
                  ? { ...i, qty: Math.min(i.stock, i.qty + qty) }
                  : i,
              ),
            };
          }
          return {
            items: [...s.items, { ...item, qty: Math.min(item.stock, qty) }],
          };
        }),
      remove: (code) =>
        set((s) => ({ items: s.items.filter((i) => i.code !== code) })),
      setQty: (code, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.code === code
                ? { ...i, qty: Math.max(1, Math.min(i.stock, qty)) }
                : i,
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    { name: "ab-cart" },
  ),
);
