import type { ImportMode } from "@/hooks/useImport";

export function ImportSourcePicker({
  mode,
  onMode,
  url,
  onUrl,
  defaultUrl,
  onFile,
}: {
  mode: ImportMode;
  onMode: (m: ImportMode) => void;
  url: string;
  onUrl: (u: string) => void;
  defaultUrl: string;
  onFile: (f: File | null) => void;
}) {
  return (
    <>
      <div className="flex gap-3 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "url"}
            onChange={() => onMode("url")}
          />
          URL (Google Sheets / link)
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "file"}
            onChange={() => onMode("file")}
          />
          Файл
        </label>
      </div>

      {mode === "url" ? (
        <div className="space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => onUrl(e.target.value)}
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
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      )}
    </>
  );
}
