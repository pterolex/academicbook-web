"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

interface Stats {
  range: { from: string; to: string };
  kpis: {
    revenueToday: string | number;
    revenue7d: string | number;
    revenueRange: string | number;
    ordersToday: number;
    orders7d: number;
    ordersNew: number;
    avgOrderValue: string | number;
    lowStockCount: number;
    newCustomers7d: number;
  };
  revenueByDay: Array<{ day: string; revenue: number; orders: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  topBooks: Array<{ titleUa: string; code: string; units: number; revenue: number }>;
  topCategories: Array<{ nameUa: string; units: number; revenue: number }>;
  newOrders: Array<{
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    subtotal: string;
    status: string;
    createdAt: string;
  }>;
}

const STATUS_COLOR: Record<string, string> = {
  NEW: "#38bdf8",
  CONFIRMED: "#a78bfa",
  SHIPPED: "#f59e0b",
  DONE: "#22c55e",
  CANCELLED: "#ef4444",
};

const STATUS_LABEL: Record<string, string> = {
  NEW: "Нові",
  CONFIRMED: "Підтверджені",
  SHIPPED: "Відправлені",
  DONE: "Виконані",
  CANCELLED: "Скасовані",
};

function fmtUah(v: string | number) {
  const n = typeof v === "number" ? v : Number(v);
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(n);
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function presetRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - (days - 1) * 86400_000);
  return { from: ymd(from), to: ymd(to) };
}

export default function AdminHome() {
  const token = useAuth((s) => s.accessToken);
  const [range, setRange] = useState<{ from: string; to: string }>(() =>
    presetRange(30),
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams({ from: range.from, to: range.to });
      const r = await fetch(`${API_URL}/admin/stats?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setStats(await r.json());
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, range]);

  useEffect(() => {
    load();
  }, [load]);

  const rangeLabel = useMemo(() => {
    if (!stats) return "";
    const days = Math.round(
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
        <DateFilter
          range={range}
          onChange={setRange}
          loading={loading}
          onReload={load}
        />
      </div>

      {err && (
        <div className="border p-2 text-sm" style={{ borderColor: "#c0392b", color: "#c0392b" }}>
          Помилка: {err}
        </div>
      )}

      {!stats ? (
        <p>Завантаження…</p>
      ) : (
        <>
          <Card title={`Нові замовлення (${stats.newOrders.length})`}>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">№</th>
                  <th>Клієнт</th>
                  <th>Контакти</th>
                  <th>Сума</th>
                  <th>Час</th>
                </tr>
              </thead>
              <tbody>
                {stats.newOrders.map((o) => (
                  <tr key={o.id} className="border-t" style={{ borderColor: "#e2e8f0" }}>
                    <td className="py-2 font-mono text-xs">{o.code.slice(-6)}</td>
                    <td>{o.name}</td>
                    <td className="text-xs text-slate-500">
                      <div>{o.email}</div>
                      <div>{o.phone}</div>
                    </td>
                    <td>{fmtUah(o.subtotal)}</td>
                    <td className="text-xs text-slate-500">
                      {new Date(o.createdAt).toLocaleString("uk")}
                    </td>
                  </tr>
                ))}
                {stats.newOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-slate-500">
                      Немає замовлень зі статусом «Нове».
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi title="Виторг сьогодні" value={fmtUah(stats.kpis.revenueToday)} accent="#22c55e" />
            <Kpi title="Виторг 7 днів" value={fmtUah(stats.kpis.revenue7d)} accent="#22c55e" />
            <Kpi
              title={`Виторг (${rangeLabel})`}
              value={fmtUah(stats.kpis.revenueRange)}
              accent="#22c55e"
            />
            <Kpi
              title={`Сер. чек (${rangeLabel})`}
              value={fmtUah(stats.kpis.avgOrderValue)}
              accent="#0ea5e9"
            />
            <Kpi title="Замовлень сьогодні" value={String(stats.kpis.ordersToday)} accent="#0ea5e9" />
            <Kpi title="Замовлень 7 днів" value={String(stats.kpis.orders7d)} accent="#0ea5e9" />
            <Kpi
              title="Нові (потребують уваги)"
              value={String(stats.kpis.ordersNew)}
              accent={stats.kpis.ordersNew > 0 ? "#f59e0b" : "#94a3b8"}
            />
            <Kpi
              title="Низький залишок"
              value={String(stats.kpis.lowStockCount)}
              accent={stats.kpis.lowStockCount > 0 ? "#ef4444" : "#94a3b8"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title={`Виторг (${rangeLabel})`} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={stats.revenueByDay} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickFormatter={(d) => d.slice(5)} fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip
                    formatter={(v) => fmtUah(Number(v))}
                    labelFormatter={(l) => `Дата: ${l}`}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title={`Замовлення за статусом (${rangeLabel})`}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus.filter((s) => s.count > 0)}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {stats.ordersByStatus.map((s) => (
                      <Cell key={s.status} fill={STATUS_COLOR[s.status]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, p) => [
                      String(v),
                      STATUS_LABEL[(p as { name: string }).name] ??
                        (p as { name: string }).name,
                    ]}
                  />
                  <Legend formatter={(val: string) => STATUS_LABEL[val] ?? val} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card title={`Замовлень на день (${rangeLabel})`} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={stats.revenueByDay} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickFormatter={(d) => d.slice(5)} fontSize={11} />
                  <YAxis fontSize={11} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title={`Топ категорії (${rangeLabel})`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.topCategories} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="nameUa" fontSize={10} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v) => fmtUah(Number(v))} />
                  <Bar dataKey="revenue" fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title={`Топ-10 книг за продажами (${rangeLabel})`} className="lg:col-span-3">
              <ResponsiveContainer width="100%" height={Math.max(240, stats.topBooks.length * 32)}>
                <BarChart
                  data={stats.topBooks}
                  layout="vertical"
                  margin={{ top: 8, right: 24, bottom: 0, left: 16 }}
                >
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={11} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="titleUa"
                    width={260}
                    fontSize={11}
                    tick={{ fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "Виторг" ? fmtUah(Number(v)) : String(v)
                    }
                  />
                  <Legend />
                  <Bar dataKey="units" name="Шт." fill="#0ea5e9" />
                  <Bar dataKey="revenue" name="Виторг" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="text-xs text-slate-500">
            Нових клієнтів за 7 днів: <b>{stats.kpis.newCustomers7d}</b>
          </div>
        </>
      )}
    </div>
  );
}

function DateFilter({
  range,
  onChange,
  loading,
  onReload,
}: {
  range: { from: string; to: string };
  onChange: (r: { from: string; to: string }) => void;
  loading: boolean;
  onReload: () => void;
}) {
  const PRESETS: Array<{ label: string; days: number }> = [
    { label: "7 дн.", days: 7 },
    { label: "30 дн.", days: 30 },
    { label: "90 дн.", days: 90 },
    { label: "365 дн.", days: 365 },
  ];
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

function Kpi({ title, value, accent }: { title: string; value: string; accent: string }) {
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

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 rounded-md border bg-white ${className}`} style={{ borderColor: "#e2e8f0" }}>
      <div className="text-sm font-semibold mb-3" style={{ color: "#0f172a" }}>
        {title}
      </div>
      {children}
    </div>
  );
}
