"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useLogout } from "@/hooks/useLogout";

const MENU: Array<{ href: string; label: string }> = [
  { href: "/admin", label: "Панель" },
  { href: "/admin/orders", label: "Замовлення" },
  { href: "/admin/books", label: "Книги" },
  { href: "/admin/categories", label: "Категорії" },
  { href: "/admin/import", label: "Імпорт CSV" },
];

const SHORTCUTS: Array<{ href: string; label: string }> = [
  { href: "/admin/books", label: "+ Додати книгу" },
  { href: "/admin/orders", label: "Знайти замовлення" },
];

export function AdminToolbar() {
  const user = useAuth((s) => s.user);
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div id="admin-toolbar" className="ab-toolbar">
      <div className="ab-toolbar-bar">
        <ul className="ab-toolbar-menu">
          {MENU.map((it) => {
            const active =
              it.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={active ? "ab-toolbar-active" : undefined}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="ab-toolbar-user">
          <span className="ab-toolbar-hello">
            Вітаємо, {user.name ?? user.email}
          </span>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            Вийти
          </button>
        </div>
      </div>
      <div className="ab-toolbar-shortcuts">
        {SHORTCUTS.map((it) => (
          <Link key={it.label} href={it.href}>
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
