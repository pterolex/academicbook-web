"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

const STATUSES = ["NEW", "CONFIRMED", "SHIPPED", "DONE", "CANCELLED"] as const;
type Status = (typeof STATUSES)[number];

interface Row {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  subtotal: string;
  status: Status;
  createdAt: string;
  items: Array<{ titleUa: string; qty: number }>;
}

export default function AdminOrders() {
  const token = useAuth((s) => s.accessToken);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  function load() {
    fetch(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setRows);
  }

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function update(id: string, status: Status) {
    setBusy(id);
    await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    load();
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl">Замовлення</h1>
      <table className="w-full text-sm border" style={{ borderColor: "var(--ab-border)" }}>
        <thead style={{ background: "var(--ab-bg-alt)" }}>
          <tr className="text-left">
            <th className="p-2">№</th>
            <th className="p-2">Клієнт</th>
            <th className="p-2">Сума</th>
            <th className="p-2">Дата</th>
            <th className="p-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-t align-top" style={{ borderColor: "var(--ab-border)" }}>
              <td className="p-2 font-mono">{o.code.slice(-6)}</td>
              <td className="p-2">
                <div>{o.name}</div>
                <div className="text-xs text-[color:var(--ab-muted)]">{o.email} · {o.phone}</div>
                <ul className="text-xs mt-1">
                  {o.items.map((i, idx) => (
                    <li key={idx}>• {i.titleUa} × {i.qty}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2">{Number(o.subtotal).toFixed(2)} ₴</td>
              <td className="p-2 text-xs">{new Date(o.createdAt).toLocaleString("uk")}</td>
              <td className="p-2">
                <select
                  value={o.status}
                  disabled={busy === o.id}
                  onChange={(e) => update(o.id, e.target.value as Status)}
                  className="border px-2 py-1"
                  style={{ borderColor: "var(--ab-border)" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-sm">Замовлень немає.</p>}
    </div>
  );
}
