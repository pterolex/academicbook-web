import type { Stats } from "@/lib/ApiClient";
import { fmtUah } from "./format";

function Kpi({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="p-3 rounded-md border bg-white"
      style={{ borderColor: "#e2e8f0", borderLeft: `4px solid ${accent}` }}
    >
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-semibold mt-1" style={{ color: "#0f172a" }}>
        {value}
      </div>
    </div>
  );
}

export function KpiGrid({
  kpis,
  rangeLabel,
}: {
  kpis: Stats["kpis"];
  rangeLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Kpi title="Виторг сьогодні" value={fmtUah(kpis.revenueToday)} accent="#22c55e" />
      <Kpi title="Виторг 7 днів" value={fmtUah(kpis.revenue7d)} accent="#22c55e" />
      <Kpi
        title={`Виторг (${rangeLabel})`}
        value={fmtUah(kpis.revenueRange)}
        accent="#22c55e"
      />
      <Kpi
        title={`Сер. чек (${rangeLabel})`}
        value={fmtUah(kpis.avgOrderValue)}
        accent="#0ea5e9"
      />
      <Kpi title="Замовлень сьогодні" value={String(kpis.ordersToday)} accent="#0ea5e9" />
      <Kpi title="Замовлень 7 днів" value={String(kpis.orders7d)} accent="#0ea5e9" />
      <Kpi
        title="Нові (потребують уваги)"
        value={String(kpis.ordersNew)}
        accent={kpis.ordersNew > 0 ? "#f59e0b" : "#94a3b8"}
      />
      <Kpi
        title="Низький залишок"
        value={String(kpis.lowStockCount)}
        accent={kpis.lowStockCount > 0 ? "#ef4444" : "#94a3b8"}
      />
    </div>
  );
}
