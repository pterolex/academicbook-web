import { api } from "@/lib/api";
import { BookGrid } from "@/components/BookGrid";

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
      {q && (
        <p className="text-sm text-[color:var(--ab-muted)]">
          {data.total} результат(ів) для «{q}»
        </p>
      )}
      <BookGrid books={data.items} />
    </div>
  );
}
