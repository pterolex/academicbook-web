"use client";
import { useAdminCategories } from "@/hooks/useAdminCategories";

export default function AdminCategories() {
  const { rows } = useAdminCategories();

  return (
    <div className="space-y-3">
      <h1 className="text-xl">Категорії</h1>
      <table className="w-full text-sm border" style={{ borderColor: "var(--ab-border)" }}>
        <thead style={{ background: "var(--ab-bg-alt)" }}>
          <tr className="text-left">
            <th className="p-2">Категорія</th>
            <th className="p-2">Книг</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-t" style={{ borderColor: "var(--ab-border)" }}>
              <td className="p-2">{c.nameUa}</td>
              <td className="p-2">{c.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
