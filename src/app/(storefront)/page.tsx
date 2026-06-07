import Link from "next/link";
import { api } from "@/lib/api";
import { publicPageMetadata } from "@/lib/seo";
import { BookGrid } from "@/components/BookGrid";

export const metadata = publicPageMetadata({ path: "/" });

export default async function HomePage() {
  let latest: Awaited<ReturnType<typeof api.books>> = {
    items: [],
    page: 1,
    pageSize: 0,
    total: 0,
    pages: 1,
  };
  try {
    latest = await api.books({ sort: "newest", pageSize: "12" });
  } catch {}

  return (
    <div className="space-y-6">
      <section
        className="rounded-sm border p-4"
        style={{
          background: "var(--ab-paper)",
          borderColor: "var(--ab-border)",
        }}
      >
        <h1 className="text-2xl mb-2">
          Книжковий магазин «Академкнига» № 7 в Києві — одна з найстаріших книгарень
        </h1>
        <p>
          У магазині <strong>Академкнига</strong> одночасно представлено до 8000 різних
          видань. Великий вибір книг з філософії, історії, психології, підручники для ВНЗ,
          словники, найбільший в місті асортимент фізико-математичної літератури, а також
          книги з мистецтва, дитячу та художню літературу, книги про Київ.
        </p>
        <p className="mt-2">
          Є великий букіністичний відділ: в основному точні науки, математика (книги на
          комісію не приймаються). Працює система попереднього замовлення. Пересилання книг
          по Україні та в країни СНД — Укрпошта, Нова пошта.
        </p>
        <p className="mt-2 text-sm text-[color:var(--ab-muted)]">
          Зв’язок: <a href="tel:+380993862655">+38 (099) 386-26-55</a>,{' '}
          <a href="mailto:akadem7@iptelecom.net.ua">akadem7@iptelecom.net.ua</a>.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg">Нові надходження</h2>
          <Link href="/search" className="text-sm">
            Усі книги →
          </Link>
        </div>
        {latest.items.length === 0 ? (
          <p className="text-sm text-[color:var(--ab-muted)]">
            Каталог порожній. Адміністратор: завантажте CSV у{" "}
            <Link href="/admin/import">/admin/import</Link>.
          </p>
        ) : (
          <BookGrid books={latest.items} />
        )}
      </section>
    </div>
  );
}
