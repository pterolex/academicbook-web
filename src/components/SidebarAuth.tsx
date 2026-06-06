"use client";
import Link from "next/link";
import { useAuth } from "@/store/auth";

export function SidebarAuth() {
  const user = useAuth((s) => s.user);
  const clear = useAuth((s) => s.clear);

  return (
    <div id="block-block-auth" className="block block-block clearfix">
      <h2>{user ? "Кабінет" : "Вхід"}</h2>
      <div className="content">
        {user ? (
          <>
            <p>
              <strong>{user.name ?? user.email}</strong>
            </p>
            <ul className="menu">
              <li className="leaf">
                <Link href="/account">Мій кабінет</Link>
              </li>
              <li className="leaf">
                <Link href="/account">Мої замовлення</Link>
              </li>
              {user.role === "ADMIN" && (
                <li className="leaf">
                  <Link href="/admin">Адмін-панель</Link>
                </li>
              )}
            </ul>
            <p style={{ marginTop: 6 }}>
              <button
                type="button"
                onClick={clear}
                className="underline"
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  color: "#985901",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Вийти
              </button>
            </p>
          </>
        ) : (
          <ul className="menu">
            <li className="leaf">
              <Link href="/login">Вхід</Link>
            </li>
            <li className="leaf">
              <Link href="/register">Реєстрація</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
