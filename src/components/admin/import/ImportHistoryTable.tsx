import type { ImportHistoryRow } from "@/lib/ApiClient";

export function ImportHistoryTable({
  rows,
  loading,
  onReload,
}: {
  rows: ImportHistoryRow[];
  loading: boolean;
  onReload: () => void;
}) {
  return (
    <div className="pt-4 border-t" style={{ borderColor: "var(--ab-border)" }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg">Історія синхронізацій</h2>
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="text-xs px-2 py-1 border rounded-sm disabled:opacity-50"
          style={{ borderColor: "var(--ab-border)" }}
        >
          {loading ? "…" : "Оновити"}
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-[color:var(--ab-muted)]">
          Немає завершених імпортів.
        </p>
      ) : (
        <table className="w-full text-xs border" style={{ borderColor: "var(--ab-border)" }}>
          <thead style={{ background: "var(--ab-bg-alt)" }}>
            <tr className="text-left">
              <th className="p-2">Час</th>
              <th className="p-2">Джерело</th>
              <th className="p-2">Розпарс.</th>
              <th className="p-2">Створ.</th>
              <th className="p-2">Онов.</th>
              <th className="p-2">Видал.</th>
              <th className="p-2">Категор.</th>
              <th className="p-2">Помилки</th>
              <th className="p-2">Тривал.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id} className="border-t align-top" style={{ borderColor: "var(--ab-border)" }}>
                <td className="p-2">{new Date(h.createdAt).toLocaleString("uk")}</td>
                <td className="p-2">
                  {h.source === "file" ? (
                    <span title={h.fileName ?? ""}>📄 {h.fileName ?? "файл"}</span>
                  ) : (
                    <span title={h.url ?? ""}>🔗 URL</span>
                  )}
                </td>
                <td className="p-2">{h.parsed}</td>
                <td className="p-2 text-green-700">+{h.toCreate}</td>
                <td className="p-2 text-sky-700">~{h.toUpdate}</td>
                <td className="p-2" style={{ color: h.toDelete > 0 ? "#c0392b" : undefined }}>
                  −{h.toDelete}
                </td>
                <td className="p-2">+{h.categoriesCreated}</td>
                <td className="p-2">
                  {h.errorsCount > 0 ? (
                    <details>
                      <summary style={{ color: "#c0392b" }}>{h.errorsCount}</summary>
                      <ul className="ml-3 list-disc">
                        {(h.errors ?? []).slice(0, 20).map((e, i) => (
                          <li key={i}>
                            {e.line}: {e.message}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <span className="text-slate-500">0</span>
                  )}
                </td>
                <td className="p-2">
                  {h.durationMs != null
                    ? `${(h.durationMs / 1000).toFixed(1)} с`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
