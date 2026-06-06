import Link from "next/link";
import { api } from "@/lib/api";
import { BookCard } from "@/components/BookCard";

export const metadata = {
  title: "Історія, міфологія, релігія",
};

export default async function HistoryReligionPage() {
  let slug: string | undefined;
  try {
    const cats = await api.categories();
    slug = cats.find((c) => /істор/i.test(c.nameUa))?.slug;
  } catch {}

  let items: Awaited<ReturnType<typeof api.books>>["items"] = [];
  try {
    const data = await api.books({
      category: slug,
      sort: "newest",
      pageSize: "6",
    });
    items = data.items;
  } catch {}

  return (
    <article className="space-y-4">
      <h1 className="text-xl">Історія, міфологія, релігія</h1>

      <p>
        У нашому магазині продається література з історії, міфології та релігії —
        історія України, а також історія Античності, Стародавнього Сходу,
        Середньовіччя, Індії, Китаю, Японії, Тибету, Візантії, Туреччини.
      </p>
      <p>
        <strong>Представлені видавництва:</strong>{" "}
        <strong>«Юніверс» (Київ)</strong>,{" "}
        <strong>«Махаон» (Київ)</strong>,{" "}
        <strong>«Києво-Могилянська академія» (Київ)</strong>,{" "}
        <strong>«Дух і літера» (Київ)</strong> та інші.
      </p>

      {items.length > 0 && (
        <section className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg">Книги розділу</h2>
            {slug && (
              <Link href={`/c/${slug}`} className="text-sm">
                Усі книги →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
