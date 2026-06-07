"use client";
import { useState } from "react";
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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const user = useRequireAuth({ role: "ADMIN" });
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
      {/* Backdrop — only when drawer open on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`w-60 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-40 transform transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
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
                onClick={() => setOpen(false)}
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with hamburger — hidden on desktop */}
        <div
          className="md:hidden flex items-center gap-3 px-4 border-b border-slate-700"
          style={{ background: "#0f172a", color: "#e2e8f0" }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Меню"
            className="min-h-[44px] px-2 text-2xl leading-none text-white"
          >
            ☰
          </button>
          <span className="text-base font-semibold text-white">Академкнига</span>
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
