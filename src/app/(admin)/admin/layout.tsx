"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useLogout } from "@/hooks/useLogout";

const NAV: Array<{ href: string; label: string }> = [
  { href: "/admin", label: "Огляд" },
  { href: "/admin/orders", label: "Замовлення" },
  { href: "/admin/books", label: "Книги" },
  { href: "/admin/categories", label: "Категорії" },
  { href: "/admin/import", label: "Імпорт CSV" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useRequireAuth({ role: "ADMIN" });
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <div
      className="admin-shell min-h-screen flex"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        background: "#f1f5f9",
        color: "#0f172a",
      }}
    >
      <aside
        className="w-60 flex-shrink-0 flex flex-col"
        style={{ background: "#0f172a", color: "#e2e8f0" }}
      >
        <div className="px-4 py-4 border-b border-slate-700">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Адмін
          </div>
          <div className="text-base font-semibold text-white">Академкнига</div>
          <div className="text-xs text-slate-400 mt-1">
            {user.name ?? user.email}
          </div>
        </div>
        <nav className="flex-1 py-3 text-sm">
          {NAV.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className="block px-4 py-2 hover:bg-slate-800"
                style={{
                  background: active ? "#1e293b" : "transparent",
                  color: active ? "#fff" : "#cbd5e1",
                  borderLeft: active
                    ? "3px solid #38bdf8"
                    : "3px solid transparent",
                }}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700 space-y-2 text-sm">
          <Link
            href="/"
            className="block text-slate-300 hover:text-white"
          >
            ← На сайт
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="text-slate-300 hover:text-white underline"
          >
            Вийти
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-x-auto">{children}</main>
    </div>
  );
}
