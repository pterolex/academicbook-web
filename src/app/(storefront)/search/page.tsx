import { api } from "@/lib/api";
import { BookCard } from "@/components/BookCard";

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
      <form method="get" className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Пошук: автор, назва, ISBN, видавництво"
          className="flex-1 border px-3 py-2 rounded-sm"
          style={{
            borderColor: "var(--ab-border)",
            background: "var(--ab-paper)",
          }}
        />
        <button
          className="px-4 py-2 rounded-sm text-white"
          style={{ background: "var(--ab-accent)" }}
        >
          Пошук
        </button>
      </form>
      {q && (
        <p className="text-sm text-[color:var(--ab-muted)]">
          {data.total} результат(ів) для «{q}»
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.items.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </div>
  );
}
