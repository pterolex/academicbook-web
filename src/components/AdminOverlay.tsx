"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";
import { useAdminOverlay } from "@/store/admin-overlay";

const loading = () => <div className="ab-overlay-loading">Завантаження…</div>;

// Admin pages are plain client components (data via client hooks + the shared
// auth store), so they render directly inside the overlay — no iframe. Lazy so
// admin code stays out of the storefront bundle until the overlay opens.
const AdminHome = dynamic(() => import("@/app/(admin)/admin/page"), {
  ssr: false,
  loading,
});
const AdminOrders = dynamic(() => import("@/app/(admin)/admin/orders/page"), {
  ssr: false,
  loading,
});
const AdminBooks = dynamic(() => import("@/app/(admin)/admin/books/page"), {
  ssr: false,
  loading,
});
const AdminCategories = dynamic(
  () => import("@/app/(admin)/admin/categories/page"),
  { ssr: false, loading }
);
const AdminImport = dynamic(() => import("@/app/(admin)/admin/import/page"), {
  ssr: false,
  loading,
});

interface Section {
  Component: React.ComponentType;
  href: string;
  label: string;
}

const HOME: Section = {
  href: "/admin",
  label: "Панель адміністрування",
  Component: AdminHome,
};

const SECTIONS: Section[] = [
  HOME,
  { href: "/admin/orders", label: "Замовлення", Component: AdminOrders },
  { href: "/admin/books", label: "Книги", Component: AdminBooks },
  { href: "/admin/categories", label: "Категорії", Component: AdminCategories },
  { href: "/admin/import", label: "Імпорт CSV", Component: AdminImport },
];

const OVERLAY_HASH = /^#overlay=(\/admin[^&]*)/;

// HOME's bare /admin prefix matches everything, so prefer a deeper section.
function sectionFor(path: string): Section {
  return SECTIONS.find((s) => s !== HOME && path.startsWith(s.href)) ?? HOME;
}

function hashFor(href: string): string {
  return `overlay=${href}`;
}

// Drupal-7 overlay: clicking an admin link in the toolbar renders the admin
// section in a dimmed, centred panel on top of the storefront instead of
// navigating away. Esc / scrim / × close it; the URL fragment
// (#overlay=/admin/...) keeps it bookmarkable and back-button friendly.
export function AdminOverlay() {
  const path = useAdminOverlay((s) => s.path);
  const open = useAdminOverlay((s) => s.open);
  const close = useAdminOverlay((s) => s.close);

  // Restore from the URL fragment on mount + react to back/forward.
  useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(OVERLAY_HASH);
      if (match) {
        open(decodeURIComponent(match[1]));
      } else {
        close();
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [open, close]);

  const dismiss = useCallback(() => {
    if (window.location.hash.startsWith("#overlay=")) {
      // Drop the fragment without adding a history entry.
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    close();
  }, [close]);

  // Lock body scroll + Esc-to-close while open.
  useEffect(() => {
    if (!path) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [path, dismiss]);

  if (!path) {
    return null;
  }

  const active = sectionFor(path);
  const Body = active.Component;

  return (
    <div className="ab-overlay-backdrop">
      <button
        aria-label="Закрити"
        className="ab-overlay-scrim"
        onClick={dismiss}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-label={active.label}
        aria-modal="true"
        className="ab-overlay-panel"
        role="dialog"
      >
        <div className="ab-overlay-titlebar">
          <span className="ab-overlay-title">{active.label}</span>
          <button
            aria-label="Закрити"
            className="ab-overlay-close"
            onClick={dismiss}
            title="Закрити (Esc)"
            type="button"
          >
            ×
          </button>
        </div>
        <nav className="ab-overlay-tabs">
          {SECTIONS.map((s) => (
            <a
              className={s === active ? "ab-overlay-tab-active" : undefined}
              href={`#${hashFor(s.href)}`}
              key={s.href}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <div className="ab-overlay-body admin-shell">
          <Body />
        </div>
      </div>
    </div>
  );
}
