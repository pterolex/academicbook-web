import type { Metadata } from "next";
import { api } from "@/lib/api";
import { BookGrid } from "@/components/BookGrid";

// Search result pages are thin/duplicate content — keep them out of the index
// but let crawlers follow links through to the books they list.
export const metadata: Metadata = {
  title: "Пошук книг",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const data = q
    ? await api.books({ q, page: sp.page })
    : { items: [], total: 0, page: 1, pageSize: 24, pages: 1 };

  return (
    <div className="space-y-4">
      <h1 className="text-xl">{q ? `Пошук: «${q}»` : "Пошук книг"}</h1>
      {q && (
        <p className="text-sm text-[color:var(--ab-muted)]">
          {data.total} результат(ів) для «{q}»
        </p>
      )}
      <BookGrid books={data.items} />
    </div>
  );
}
