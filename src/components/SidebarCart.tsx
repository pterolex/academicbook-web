"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";

export function SidebarCart() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const remove = useCart((s) => s.remove);

  return (
    <div id="block-block-cart" className="block block-block clearfix">
      <h2>Кошик</h2>
      <div className="content">
        {items.length === 0 ? (
          <p className="ab-muted">Кошик порожній</p>
        ) : (
          <>
            <ul className="menu">
              {items.map((it) => (
                <li key={it.code} className="leaf">
                  <Link href={`/book/${it.code}`} title={it.titleUa}>
                    {it.titleUa.length > 40
                      ? it.titleUa.slice(0, 40) + "…"
                      : it.titleUa}
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85em",
                    }}
                  >
                    <span>
                      {it.qty} × {Number(it.price).toFixed(2)} грн
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(it.code)}
                      className="underline"
                      style={{
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        color: "#985901",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 6, fontWeight: 700 }}>
              Разом: {subtotal.toFixed(2)} грн
            </p>
            <p style={{ marginTop: 6 }}>
              <Link href="/cart">Переглянути</Link>
              {" · "}
              <Link href="/checkout">Оформити</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
