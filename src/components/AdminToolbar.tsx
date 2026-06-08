"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useAdminOverlay } from "@/store/admin-overlay";
import { useAuth } from "@/store/auth";

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
  const overlayPath = useAdminOverlay((s) => s.path);

  if (user?.role !== "ADMIN") {
    return null;
  }

  // Open in the Drupal-style overlay on a plain left click; let modified clicks
  // (new tab / window) and middle clicks fall through to the real href.
  const openOverlay = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    // Pushes a history entry so the browser Back button closes the overlay.
    window.location.hash = `overlay=${href}`;
  };

  const isActive = (href: string) =>
    href === "/admin"
      ? overlayPath === "/admin"
      : Boolean(overlayPath?.startsWith(href));

  return (
    <div className="ab-toolbar" id="admin-toolbar">
      <div className="ab-toolbar-bar">
        <ul className="ab-toolbar-menu">
          {MENU.map((it) => (
            <li key={it.href}>
              <Link
                className={isActive(it.href) ? "ab-toolbar-active" : undefined}
                href={it.href}
                onClick={openOverlay(it.href)}
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ab-toolbar-user">
          <span className="ab-toolbar-hello">
            Вітаємо, {user.name ?? user.email}
          </span>
          <button
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            type="button"
          >
            Вийти
          </button>
        </div>
      </div>
      <div className="ab-toolbar-shortcuts">
        {SHORTCUTS.map((it) => (
          <Link href={it.href} key={it.label} onClick={openOverlay(it.href)}>
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
