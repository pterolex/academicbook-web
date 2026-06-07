"use client";
import { useState } from "react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import ConfirmModal from "@/components/ConfirmModal";
import type { AdminOrder, OrderStatus } from "@/lib/ApiClient";

const STATUSES: OrderStatus[] = ["NEW", "CONFIRMED", "SHIPPED", "DONE", "CANCELLED"];

export default function AdminOrders() {
  const { rows, busy, setStatus, deleteOrder } = useAdminOrders();
  const [pendingDelete, setPendingDelete] = useState<AdminOrder | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteOrder(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl">Замовлення</h1>
      <table className="w-full text-sm border" style={{ borderColor: "var(--ab-border)" }}>
        <thead style={{ background: "var(--ab-bg-alt)" }}>
          <tr className="text-left">
            <th className="p-2">№</th>
            <th className="p-2">Клієнт</th>
            <th className="p-2 hidden md:table-cell">Доставка</th>
            <th className="p-2">Сума</th>
            <th className="p-2 hidden md:table-cell">Дата</th>
            <th className="p-2">Статус</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-t align-top" style={{ borderColor: "var(--ab-border)" }}>
              <td className="p-2 font-mono">{o.code}</td>
              <td className="p-2">
                <div>{o.name}</div>
                <div className="text-xs text-[color:var(--ab-muted)]">{o.email} · {o.phone}</div>
                <ul className="text-xs mt-1">
                  {o.items.map((i, idx) => (
                    <li key={idx}>• {i.titleUa} × {i.qty}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2 text-xs hidden md:table-cell">
                {o.deliveryType === "novaposhta" ? (
                  <div>
                    <div>Нова пошта</div>
                    <div className="text-[color:var(--ab-muted)]">
                      {o.city}, відділення {o.warehouse}
                    </div>
                  </div>
                ) : (
                  <div>Самовивоз</div>
                )}
              </td>
              <td className="p-2">{Number(o.subtotal).toFixed(2)} ₴</td>
              <td className="p-2 text-xs hidden md:table-cell">{new Date(o.createdAt).toLocaleString("uk")}</td>
              <td className="p-2">
                <select
                  value={o.status}
                  disabled={busy === o.id}
                  onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
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
              <td className="p-2">
                <button
                  type="button"
                  onClick={() => setPendingDelete(o)}
                  disabled={busy === o.id}
                  className="border px-2 py-1 text-xs"
                  style={{
                    borderColor: "var(--ab-border)",
                    color: "#c0392b",
                    cursor: busy === o.id ? "not-allowed" : "pointer",
                  }}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-sm">Замовлень немає.</p>}

      <ConfirmModal
        open={pendingDelete !== null}
        title="Видалити замовлення?"
        message={
          pendingDelete
            ? `Замовлення №${pendingDelete.code} буде видалено назавжди. Цю дію не можна скасувати.`
            : undefined
        }
        busy={pendingDelete ? busy === pendingDelete.id : false}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
