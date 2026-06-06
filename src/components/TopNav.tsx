import Link from "next/link";

const ITEMS: Array<{ label: string; href: string }> = [
  { label: "Про магазин Академкнига", href: "/about" },
  { label: "Контакти", href: "/contacts" },
  { label: "Замовлення або питання", href: "/checkout" },
  { label: "Фізико-математична література", href: "/physics-math" },
  { label: "Історія, міфологія, релігія", href: "/history-religion" },
];

export function TopNav() {
  return (
    <div id="navigation">
      <ul id="main-menu" className="ab-main-menu">
        {ITEMS.map((it) => (
          <li key={it.href}>
            <Link href={it.href}>{it.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
