"use client";
import { useCart } from "@/store/cart";
import type { Book } from "@/lib/api";

export function AddToCartButton({ book }: { book: Book }) {
  const add = useCart((s) => s.add);
  return (
    <button
      className="text-sm px-3 py-1 rounded-sm text-white"
      style={{ background: "var(--ab-accent)" }}
      onClick={() =>
        add({
          code: book.code,
          titleUa: book.titleUa,
          titleRu: book.titleRu,
          price: Number(book.price),
          stock: book.stock,
        })
      }
    >
      У кошик
    </button>
  );
}
