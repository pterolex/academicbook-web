"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl">Кошик</h1>
        <p>Кошик порожній.</p>
        <Link href="/">← До каталогу</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Кошик</h1>
      <table className="w-full text-sm border" style={{ borderColor: "var(--ab-border)" }}>
        <thead style={{ background: "var(--ab-bg-alt)" }}>
          <tr className="text-left">
            <th className="p-2">Книга</th>
            <th className="p-2 w-24">Кіл-ть</th>
            <th className="p-2 w-24 text-right">Ціна</th>
            <th className="p-2 w-24 text-right">Сума</th>
            <th className="p-2 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.code} className="border-t" style={{ borderColor: "var(--ab-border)" }}>
              <td className="p-2">
                <Link href={`/book/${encodeURIComponent(i.code)}`}>{i.titleUa}</Link>
              </td>
              <td className="p-2">
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => setQty(i.code, parseInt(e.target.value, 10) || 1)}
                  className="w-16 border px-2 py-1"
                  style={{ borderColor: "var(--ab-border)" }}
                />
              </td>
              <td className="p-2 text-right">{i.price.toFixed(2)} ₴</td>
              <td className="p-2 text-right">{(i.price * i.qty).toFixed(2)} ₴</td>
              <td className="p-2 text-right">
                <button onClick={() => remove(i.code)} aria-label="Видалити">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t font-semibold" style={{ borderColor: "var(--ab-border)" }}>
            <td className="p-2" colSpan={3}>
              Разом
            </td>
            <td className="p-2 text-right">{subtotal.toFixed(2)} ₴</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div className="flex gap-3">
        <Link href="/" className="px-3 py-2 border" style={{ borderColor: "var(--ab-border)" }}>
          Продовжити покупки
        </Link>
        <Link
          href="/checkout"
          className="px-4 py-2 rounded-sm text-white"
          style={{ background: "var(--ab-accent)" }}
        >
          Оформити замовлення
        </Link>
      </div>
    </div>
  );
}
