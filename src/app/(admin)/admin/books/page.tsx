"use client";
import { useAdminBooks } from "@/hooks/useAdminBooks";

export default function AdminBooks() {
  const { q, setQ, rows, search, page, pageCount, total, goToPage } =
    useAdminBooks();

  return (
    <div className="space-y-3">
      <h1 className="text-xl">Книги</h1>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Пошук за назвою, автором або кодом"
          className="border px-3 py-1 flex-1"
          style={{ borderColor: "var(--ab-border)" }}
        />
        <button onClick={search} className="border px-3" style={{ borderColor: "var(--ab-border)" }}>
          Знайти
        </button>
      </div>
      <table className="w-full text-sm border" style={{ borderColor: "var(--ab-border)" }}>
        <thead style={{ background: "var(--ab-bg-alt)" }}>
          <tr className="text-left">
            <th className="p-2">Код</th>
            <th className="p-2">Назва</th>
            <th className="p-2 hidden md:table-cell">Автор</th>
            <th className="p-2 hidden md:table-cell">Категорія</th>
            <th className="p-2">Ціна</th>
            <th className="p-2">Залишок</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="border-t" style={{ borderColor: "var(--ab-border)" }}>
              <td className="p-2 font-mono text-xs">{b.code}</td>
              <td className="p-2">{b.titleUa}</td>
              <td className="p-2 hidden md:table-cell">{b.author}</td>
              <td className="p-2 hidden md:table-cell">{b.category?.nameUa}</td>
              <td className="p-2">{b.price} ₴</td>
              <td className="p-2">{b.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="border px-3 py-1 disabled:opacity-40"
          style={{ borderColor: "var(--ab-border)" }}
        >
          ← Назад
        </button>
        <span>
          Сторінка {page} з {pageCount} ({total})
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= pageCount}
          className="border px-3 py-1 disabled:opacity-40"
          style={{ borderColor: "var(--ab-border)" }}
        >
          Вперед →
        </button>
      </div>
    </div>
  );
}
