"use client";
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
import type { Stats } from "@/lib/ApiClient";
import { Card } from "./Card";
import { fmtUah, STATUS_COLOR, STATUS_LABEL } from "./format";

export function RevenueAreaChart({
  data,
  rangeLabel,
}: {
  data: Stats["revenueByDay"];
  rangeLabel: string;
}) {
  return (
    <Card title={`Виторг (${rangeLabel})`} className="lg:col-span-2">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
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
  );
}

export function OrdersByStatusPie({
  data,
  rangeLabel,
}: {
  data: Stats["ordersByStatus"];
  rangeLabel: string;
}) {
  return (
    <Card title={`Замовлення за статусом (${rangeLabel})`}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data.filter((s) => s.count > 0)}
            dataKey="count"
            nameKey="status"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((s) => (
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
  );
}

export function OrdersPerDayChart({
  data,
  rangeLabel,
}: {
  data: Stats["revenueByDay"];
  rangeLabel: string;
}) {
  return (
    <Card title={`Замовлень на день (${rangeLabel})`} className="lg:col-span-2">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="day" tickFormatter={(d) => d.slice(5)} fontSize={11} />
          <YAxis fontSize={11} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#0ea5e9" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function TopCategoriesBar({
  data,
  rangeLabel,
}: {
  data: Stats["topCategories"];
  rangeLabel: string;
}) {
  return (
    <Card title={`Топ категорії (${rangeLabel})`}>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="nameUa" fontSize={10} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
          <Tooltip formatter={(v) => fmtUah(Number(v))} />
          <Bar dataKey="revenue" fill="#a78bfa" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function TopBooksBar({
  data,
  rangeLabel,
}: {
  data: Stats["topBooks"];
  rangeLabel: string;
}) {
  return (
    <Card title={`Топ-10 книг за продажами (${rangeLabel})`} className="lg:col-span-3">
      <ResponsiveContainer width="100%" height={Math.max(240, data.length * 32)}>
        <BarChart
          data={data}
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
  );
}
