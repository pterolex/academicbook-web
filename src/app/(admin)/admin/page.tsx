"use client";
import { useMemo } from "react";
import { useAdminStats } from "@/hooks/useAdminStats";
import { DateFilter } from "@/components/admin/DateFilter";
import { KpiGrid } from "@/components/admin/KpiGrid";
import { NewOrdersTable } from "@/components/admin/NewOrdersTable";
import {
  RevenueAreaChart,
  OrdersByStatusPie,
  OrdersPerDayChart,
  TopCategoriesBar,
  TopBooksBar,
} from "@/components/admin/DashboardCharts";

export default function AdminHome() {
  const { stats, range, setRange, loading, error, reload } = useAdminStats();

  const rangeLabel = useMemo(() => {
    if (!stats) return "";
    const days =
      Math.round(
        (new Date(stats.range.to).getTime() -
          new Date(stats.range.from).getTime()) /
          86400_000,
      ) + 1;
    return `${days} дн.`;
  }, [stats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-xl font-semibold">Огляд</h1>
        <DateFilter range={range} onChange={setRange} loading={loading} onReload={reload} />
      </div>

      {error && (
        <div className="border p-2 text-sm" style={{ borderColor: "#c0392b", color: "#c0392b" }}>
          Помилка: {error}
        </div>
      )}

      {!stats ? (
        <p>Завантаження…</p>
      ) : (
        <>
          <NewOrdersTable orders={stats.newOrders} />
          <KpiGrid kpis={stats.kpis} rangeLabel={rangeLabel} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RevenueAreaChart data={stats.revenueByDay} rangeLabel={rangeLabel} />
            <OrdersByStatusPie data={stats.ordersByStatus} rangeLabel={rangeLabel} />
            <OrdersPerDayChart data={stats.revenueByDay} rangeLabel={rangeLabel} />
            <TopCategoriesBar data={stats.topCategories} rangeLabel={rangeLabel} />
            <TopBooksBar data={stats.topBooks} rangeLabel={rangeLabel} />
          </div>

          <div className="text-xs text-slate-500">
            Нових клієнтів за 7 днів: <b>{stats.kpis.newCustomers7d}</b>
          </div>
        </>
      )}
    </div>
  );
}
