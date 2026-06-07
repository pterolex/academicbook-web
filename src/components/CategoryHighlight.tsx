import Link from "next/link";
import { api } from "@/lib/api";
import { BookGrid } from "./BookGrid";

// Server component: fetches the newest books for a category and renders the
// shared "Книги розділу" section. Renders nothing when there is no slug or no
// books, so themed landing pages can drop it in unconditionally.
export async function CategoryHighlight({
  slug,
  title = "Книги розділу",
  pageSize = 6,
}: {
  slug: string | undefined;
  title?: string;
  pageSize?: number;
}) {
  if (!slug) return null;

  let items: Awaited<ReturnType<typeof api.books>>["items"] = [];
  try {
    const data = await api.books({
      category: slug,
      sort: "newest",
      pageSize: String(pageSize),
    });
    items = data.items;
  } catch {
    items = [];
  }
  if (items.length === 0) return null;

  return (
    <section className="pt-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg">{title}</h2>
        <Link href={`/c/${slug}`} className="text-sm">
          Усі книги →
        </Link>
      </div>
      <BookGrid books={items} />
    </section>
  );
}
