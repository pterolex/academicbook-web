import type { Stats } from "@/lib/ApiClient";
import { Card } from "./Card";
import { fmtUah } from "./format";

export function NewOrdersTable({ orders }: { orders: Stats["newOrders"] }) {
  return (
    <Card title={`Нові замовлення (${orders.length})`}>
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
          {orders.map((o) => (
            <tr key={o.id} className="border-t" style={{ borderColor: "#e2e8f0" }}>
              <td className="py-2 font-mono text-xs">{o.code}</td>
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
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="py-3 text-slate-500">
                Немає замовлень зі статусом «Нове».
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
