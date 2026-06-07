import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { publicPageMetadata } from "@/lib/seo";
import { BookGrid } from "@/components/BookGrid";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; q?: string }>;
}

async function categoryName(slug: string): Promise<string | null> {
  try {
    const cats = await api.categories();
    return cats.find((c) => c.slug === slug)?.nameUa ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = await categoryName(slug);
  const title = name ? `${name} — книги` : "Категорія";
  return publicPageMetadata({
    title,
    description: `${name ?? "Книги"} — каталог видань у магазині «Академкнига», Київ.`,
    // Canonical points at the bare category so ?page/?sort variants don't fragment ranking.
    path: `/c/${slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const [data, name] = await Promise.all([
    api.books({
      category: slug,
      page: sp.page,
      sort: sp.sort,
      q: sp.q,
    }),
    categoryName(slug),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl">{name ?? slug}</h1>
      <p className="text-sm text-[color:var(--ab-muted)]">
        Знайдено {data.total} книг
      </p>

      <BookGrid books={data.items} />

      {data.pages > 1 && (
        <nav className="flex gap-2 mt-4 text-sm">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/c/${slug}?page=${p}${sp.sort ? `&sort=${sp.sort}` : ""}`}
              className={
                p === data.page
                  ? "px-2 py-1 border font-bold"
                  : "px-2 py-1 border"
              }
              style={{ borderColor: "var(--ab-border)" }}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
