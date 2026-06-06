"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

interface Report {
  parsed: number;
  toCreate: number;
  toUpdate: number;
  toDelete: number;
  categoriesCreated: number;
  errors: Array<{ line: number; message: string }>;
  committed: boolean;
}

type Mode = "url" | "file";

export default function AdminImport() {
  const token = useAuth((s) => s.accessToken);
  const [mode, setMode] = useState<Mode>("url");
  const [file, setFile] = useState<File | null>(null);
  const [defaultUrl, setDefaultUrl] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/import/source`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { url: "" }))
      .then((d: { url: string }) => {
        setDefaultUrl(d.url);
        setUrl(d.url);
      })
      .catch(() => {});
  }, [token]);

  async function sendFile(dryRun: boolean) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${API_URL}/admin/import?dryRun=${dryRun ? "true" : "false"}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        },
      );
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message ?? "Помилка імпорту");
      }
      setReport(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function sendUrl(dryRun: boolean) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/admin/import/url?dryRun=${dryRun ? "true" : "false"}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(url && url !== defaultUrl ? { url } : {}),
        },
      );
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message ?? "Помилка імпорту");
      }
      setReport(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const send = (dryRun: boolean) =>
    mode === "url" ? sendUrl(dryRun) : sendFile(dryRun);

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl">Імпорт каталогу (CSV)</h1>
      <p className="text-sm text-[color:var(--ab-muted)]">
        Колонки: Код, Автор, Название, Заголовок, Год, Город, Издательство,
        Обложка, Количество страниц, Цена, Примечания, Тема. Розділювач: tab,
        кома або крапка з комою — визначається автоматично.
      </p>

      <div className="flex gap-3 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "url"}
            onChange={() => {
              setMode("url");
              setReport(null);
            }}
          />
          URL (Google Sheets / link)
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "file"}
            onChange={() => {
              setMode("file");
              setReport(null);
            }}
          />
          Файл
        </label>
      </div>

      {mode === "url" ? (
        <div className="space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setReport(null);
            }}
            placeholder="https://docs.google.com/.../pub?output=csv"
            className="w-full px-2 py-1 border text-sm"
            style={{ borderColor: "var(--ab-border)" }}
          />
          {defaultUrl && (
            <div className="text-xs text-[color:var(--ab-muted)]">
              За замовчуванням (CSV_IMPORT_URL): {defaultUrl}
            </div>
          )}
        </div>
      ) : (
        <input
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setReport(null);
          }}
        />
      )}

      <div className="flex gap-2">
        <button
          disabled={busy || (mode === "file" && !file) || (mode === "url" && !url)}
          onClick={() => send(true)}
          className="px-4 py-2 border disabled:opacity-50"
          style={{ borderColor: "var(--ab-border)" }}
        >
          Пробний запуск
        </button>
        <button
          disabled={busy || !report || (mode === "file" && !file)}
          onClick={() => send(false)}
          className="px-4 py-2 rounded-sm text-white disabled:opacity-50"
          style={{ background: "var(--ab-accent)" }}
        >
          Підтвердити імпорт
        </button>
      </div>
      {busy && <div className="text-sm">Виконується…</div>}
      {error && <div style={{ color: "#c0392b" }}>{error}</div>}
      {report && (
        <div
          className="border p-3 text-sm space-y-1"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
        >
          <div>Розпарсено рядків: <b>{report.parsed}</b></div>
          <div>Буде створено: <b>{report.toCreate}</b></div>
          <div>Буде оновлено: <b>{report.toUpdate}</b></div>
          <div>
            Буде видалено (немає в CSV):{" "}
            <b style={{ color: report.toDelete > 0 ? "#c0392b" : undefined }}>
              {report.toDelete}
            </b>
          </div>
          <div>Нових категорій: <b>{report.categoriesCreated}</b></div>
          <div>Стан: {report.committed ? "ЗАСТОСОВАНО" : "ПРОБНИЙ (не записано)"}</div>
          {report.errors.length > 0 && (
            <details>
              <summary>Помилки ({report.errors.length})</summary>
              <ul className="ml-4 list-disc">
                {report.errors.slice(0, 50).map((e, i) => (
                  <li key={i}>
                    Рядок {e.line}: {e.message}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
