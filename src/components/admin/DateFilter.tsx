import type { DateRange } from "@/lib/ApiClient";
import { presetRange } from "./format";

const PRESETS: Array<{ label: string; days: number }> = [
  { label: "7 дн.", days: 7 },
  { label: "30 дн.", days: 30 },
  { label: "90 дн.", days: 90 },
  { label: "365 дн.", days: 365 },
];

export function DateFilter({
  range,
  onChange,
  loading,
  onReload,
}: {
  range: DateRange;
  onChange: (r: DateRange) => void;
  loading: boolean;
  onReload: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {PRESETS.map((p) => (
        <button
          key={p.days}
          type="button"
          onClick={() => onChange(presetRange(p.days))}
          className="px-2 py-1 border rounded-sm bg-white"
          style={{ borderColor: "#e2e8f0" }}
        >
          {p.label}
        </button>
      ))}
      <input
        type="date"
        value={range.from}
        max={range.to}
        onChange={(e) => onChange({ ...range, from: e.target.value })}
        className="border px-2 py-1 rounded-sm bg-white"
        style={{ borderColor: "#e2e8f0" }}
      />
      <span className="text-slate-500">→</span>
      <input
        type="date"
        value={range.to}
        min={range.from}
        onChange={(e) => onChange({ ...range, to: e.target.value })}
        className="border px-2 py-1 rounded-sm bg-white"
        style={{ borderColor: "#e2e8f0" }}
      />
      <button
        type="button"
        onClick={onReload}
        disabled={loading}
        className="px-3 py-1 rounded-sm text-white disabled:opacity-50"
        style={{ background: "#0f172a" }}
      >
        {loading ? "…" : "Оновити"}
      </button>
    </div>
  );
}
