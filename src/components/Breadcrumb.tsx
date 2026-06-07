"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "@/store/breadcrumb";

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

// Segments that have no real page — render as text, not link.
const NO_LINK = new Set(["book", "c"]);

function label(segment: string): string {
  return LABELS[segment] ?? decodeURIComponent(segment);
}

export function Breadcrumb() {
  const pathname = usePathname();
  const overrideTitle = useBreadcrumb((s) => s.title);
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: label(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    last: i === segments.length - 1,
    noLink: NO_LINK.has(seg),
  }));

  if (overrideTitle) {
    crumbs[crumbs.length - 1].label = overrideTitle;
  }

  return (
    <nav aria-label="Хлібні крихти" className="ab-breadcrumb">
      <Link href="/">Головна</Link>
      {crumbs.map((c) => (
        <span key={c.href}>
          <span className="ab-breadcrumb-sep"> » </span>
          {c.last || c.noLink ? (
            <span aria-current={c.last ? "page" : undefined}>{c.label}</span>
          ) : (
            <Link href={c.href}>{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
