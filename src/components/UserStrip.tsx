"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useLogout } from "@/hooks/useLogout";

export function UserStrip() {
  const count = useCart((s) => s.count());
  const user = useAuth((s) => s.user);
  const logout = useLogout();

  return (
    <div className="ab-userstrip">
      <div className="flex justify-end items-center gap-3">
        <Link href="/cart">Кошик ({count})</Link>
        {user ? (
          <>
            <Link href="/account">{user.name ?? user.email}</Link>
            {user.role === "ADMIN" && <Link href="/admin">Адмін</Link>}
            <button type="button" onClick={logout} className="underline">
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Вхід</Link>
            <Link href="/register">Реєстрація</Link>
          </>
        )}
      </div>
    </div>
  );
}
