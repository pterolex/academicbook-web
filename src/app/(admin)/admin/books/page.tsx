"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

interface Row {
  id: string;
  code: string;
  titleUa: string;
  author: string | null;
  publisher: string | null;
  price: string;
  stock: number;
  category?: { nameUa: string };
}

export default function AdminBooks() {
  const token = useAuth((s) => s.accessToken);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  function load() {
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    fetch(`${API_URL}/admin/books${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setRows);
  }

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="space-y-3">
      <h1 className="text-xl">Книги</h1>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук за назвою або кодом"
          className="border px-3 py-1 flex-1"
          style={{ borderColor: "var(--ab-border)" }}
        />
        <button onClick={load} className="border px-3" style={{ borderColor: "var(--ab-border)" }}>
          Знайти
        </button>
      </div>
      <table className="w-full text-sm border" style={{ borderColor: "var(--ab-border)" }}>
        <thead style={{ background: "var(--ab-bg-alt)" }}>
          <tr className="text-left">
            <th className="p-2">Код</th>
            <th className="p-2">Назва</th>
            <th className="p-2">Автор</th>
            <th className="p-2">Категорія</th>
            <th className="p-2">Ціна</th>
            <th className="p-2">Залишок</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="border-t" style={{ borderColor: "var(--ab-border)" }}>
              <td className="p-2 font-mono text-xs">{b.code}</td>
              <td className="p-2">{b.titleUa}</td>
              <td className="p-2">{b.author}</td>
              <td className="p-2">{b.category?.nameUa}</td>
              <td className="p-2">{b.price} ₴</td>
              <td className="p-2">{b.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
