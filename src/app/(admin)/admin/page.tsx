"use client";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

interface Stats {
  kpis: {
    revenueToday: string | number;
    revenue7d: string | number;
    revenue30d: string | number;
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
  lowStock: Array<{ id: string; code: string; titleUa: string; stock: number; price: string }>;
  latestOrders: Array<{
    id: string;
    code: string;
    name: string;
    email: string;
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

export default function AdminHome() {
  const token = useAuth((s) => s.accessToken);
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setStats)
      .catch((e) => setErr((e as Error).message));
  }, [token]);

  if (err) return <p style={{ color: "#c0392b" }}>Помилка: {err}</p>;
  if (!stats) return <p>Завантаження…</p>;

  const k = stats.kpis;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Огляд</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi title="Виторг сьогодні" value={fmtUah(k.revenueToday)} accent="#22c55e" />
        <Kpi title="Виторг 7 днів" value={fmtUah(k.revenue7d)} accent="#22c55e" />
        <Kpi title="Виторг 30 днів" value={fmtUah(k.revenue30d)} accent="#22c55e" />
        <Kpi title="Сер. чек (30д)" value={fmtUah(k.avgOrderValue)} accent="#0ea5e9" />
        <Kpi title="Замовлень сьогодні" value={String(k.ordersToday)} accent="#0ea5e9" />
        <Kpi title="Замовлень 7 днів" value={String(k.orders7d)} accent="#0ea5e9" />
        <Kpi
          title="Нові (потребують уваги)"
          value={String(k.ordersNew)}
          accent={k.ordersNew > 0 ? "#f59e0b" : "#94a3b8"}
        />
        <Kpi
          title="Низький залишок"
          value={String(k.lowStockCount)}
          accent={k.lowStockCount > 0 ? "#ef4444" : "#94a3b8"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Виторг за 30 днів" className="lg:col-span-2">
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

        <Card title="Замовлення за статусом">
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
                  STATUS_LABEL[(p as { name: string }).name] ?? (p as { name: string }).name,
                ]}
              />
              <Legend formatter={(val: string) => STATUS_LABEL[val] ?? val} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Замовлень на день (30д)" className="lg:col-span-2">
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

        <Card title="Топ категорії (виторг, 30д)">
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

        <Card title="Топ-10 книг за продажами (30д)" className="lg:col-span-3">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Останні замовлення">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">№</th>
                <th>Клієнт</th>
                <th>Сума</th>
                <th>Статус</th>
                <th>Час</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestOrders.map((o) => (
                <tr key={o.id} className="border-t" style={{ borderColor: "#e2e8f0" }}>
                  <td className="py-2 font-mono text-xs">{o.code.slice(-6)}</td>
                  <td>
                    <div>{o.name}</div>
                    <div className="text-xs text-slate-500">{o.email}</div>
                  </td>
                  <td>{fmtUah(o.subtotal)}</td>
                  <td>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs text-white"
                      style={{ background: STATUS_COLOR[o.status] }}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500">
                    {new Date(o.createdAt).toLocaleString("uk")}
                  </td>
                </tr>
              ))}
              {stats.latestOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-slate-500">
                    Поки немає замовлень.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card title="Низький залишок (≤ 2)">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">Код</th>
                <th>Назва</th>
                <th>Ціна</th>
                <th>Залишок</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStock.map((b) => (
                <tr key={b.id} className="border-t" style={{ borderColor: "#e2e8f0" }}>
                  <td className="py-2 font-mono text-xs">{b.code}</td>
                  <td>{b.titleUa}</td>
                  <td>{fmtUah(b.price)}</td>
                  <td>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs text-white"
                      style={{ background: b.stock === 0 ? "#ef4444" : "#f59e0b" }}
                    >
                      {b.stock}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.lowStock.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-slate-500">
                    Усі товари в наявності.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="text-xs text-slate-500">
        Нових клієнтів за 7 днів: <b>{k.newCustomers7d}</b>
      </div>
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
