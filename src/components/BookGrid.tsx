import type { Book } from "@/lib/api";
import { BookCard } from "./BookCard";

export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}
