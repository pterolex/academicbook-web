import Link from "next/link";
import type { Book } from "@/lib/api";
import { AddToCartButton } from "./AddToCartButton";

export function BookCard({ book }: { book: Book }) {
  return (
    <article
      className="border rounded-sm p-3 flex flex-col gap-1"
      style={{
        background: "var(--ab-paper)",
        borderColor: "var(--ab-border)",
      }}
    >
      <Link
        href={`/book/${encodeURIComponent(book.code)}`}
        className="font-medium leading-snug"
      >
        {book.titleUa}
      </Link>
      {book.author && (
        <div className="text-sm text-[color:var(--ab-muted)]">{book.author}</div>
      )}
      <div className="text-xs text-[color:var(--ab-muted)]">
        {book.publisher}
        {book.city ? `, ${book.city}` : ""}
        {book.year ? `, ${book.year}` : ""}
        {book.pages ? `, ${book.pages} с.` : ""}
        {book.binding ? `, ${book.binding}` : ""}
      </div>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-semibold">{book.price} ₴</span>
        <AddToCartButton book={book} />
      </div>
    </article>
  );
}
