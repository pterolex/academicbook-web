"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useMyOrders } from "@/hooks/useMyOrders";

export function AccountClient() {
  const user = useRequireAuth();
  const clear = useAuth((s) => s.clear);
  const router = useRouter();
  const orders = useMyOrders();

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Кабінет: {user.name ?? user.email}</h1>
        <button
          onClick={() => {
            clear();
            router.push("/");
          }}
          className="text-sm border px-3 py-1"
          style={{ borderColor: "var(--ab-border)" }}
        >
          Вийти
        </button>
      </div>
      <h2 className="text-lg">Мої замовлення</h2>
      {orders.length === 0 ? (
        <p>Замовлень поки немає.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => (
            <li
              key={o.id}
              className="border p-3 rounded-sm"
              style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
            >
              <div className="flex justify-between text-sm">
                <span>#{o.code}</span>
                <span>{new Date(o.createdAt).toLocaleDateString("uk")}</span>
              </div>
              <div className="text-sm">
                Статус: {o.status} · {Number(o.subtotal).toFixed(2)} ₴
              </div>
              <ul className="text-xs text-[color:var(--ab-muted)] mt-1">
                {o.items.map((i, idx) => (
                  <li key={idx}>
                    {i.titleUa} × {i.qty}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
