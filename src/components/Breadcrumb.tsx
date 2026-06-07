"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Static labels for known route segments. Dynamic segments (book code,
// category slug) fall back to the decoded segment text.
const LABELS: Record<string, string> = {
  about: "Про магазин Академкнига",
  contacts: "Контакти",
  checkout: "Замовлення",
  success: "Підтвердження",
  "physics-math": "Фізико-математична література",
  "history-religion": "Історія, міфологія, релігія",
  book: "Книга",
  c: "Категорія",
  cart: "Кошик",
  account: "Кабінет",
  login: "Вхід",
  register: "Реєстрація",
  search: "Пошук",
};

function label(segment: string): string {
  return LABELS[segment] ?? decodeURIComponent(segment);
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Home page: no trail.
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: label(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    last: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Хлібні крихти" className="ab-breadcrumb">
      <Link href="/">Головна</Link>
      {crumbs.map((c) => (
        <span key={c.href}>
          <span className="ab-breadcrumb-sep"> » </span>
          {c.last ? (
            <span aria-current="page">{c.label}</span>
          ) : (
            <Link href={c.href}>{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
