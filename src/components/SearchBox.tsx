"use client";

import { useSearchParams } from "next/navigation";

export function SearchBox() {
  const q = useSearchParams().get("q") ?? "";
  return (
    <form method="get" action="/search" role="search" className="ab-search flex gap-2">
      <input
        key={q}
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Пошук: автор, назва, ISBN, видавництво"
        aria-label="Пошук"
        className="flex-1 border px-3 py-2 rounded-sm"
        style={{
          borderColor: "var(--ab-border)",
          background: "var(--ab-paper)",
        }}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-sm text-white"
        style={{ background: "var(--ab-accent)" }}
      >
        Пошук
      </button>
    </form>
  );
}
