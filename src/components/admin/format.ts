import type { DateRange } from "@/lib/ApiClient";

export const STATUS_COLOR: Record<string, string> = {
  NEW: "#38bdf8",
  CONFIRMED: "#a78bfa",
  SHIPPED: "#f59e0b",
  DONE: "#22c55e",
  CANCELLED: "#ef4444",
};

export const STATUS_LABEL: Record<string, string> = {
  NEW: "Нові",
  CONFIRMED: "Підтверджені",
  SHIPPED: "Відправлені",
  DONE: "Виконані",
  CANCELLED: "Скасовані",
};

export function fmtUah(v: string | number): string {
  const n = typeof v === "number" ? v : Number(v);
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function presetRange(days: number): DateRange {
  const to = new Date();
  const from = new Date(to.getTime() - (days - 1) * 86400_000);
  return { from: ymd(from), to: ymd(to) };
}
