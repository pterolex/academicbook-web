import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, type Book } from "@/lib/api";
import { SITE_URL } from "@/lib/env";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BreadcrumbTitleSetter } from "@/components/BreadcrumbTitleSetter";

async function getBook(code: string): Promise<Book | null> {
  try {
    return await api.bookByCode(code);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const book = await getBook(code);
  if (!book) return { title: "Книгу не знайдено" };

  const titleParts = [book.titleUa, book.author].filter(Boolean);
  const descParts = [
    book.author,
    book.titleUa,
    book.publisher,
    book.city,
    book.year ? String(book.year) : null,
  ].filter(Boolean);
  const description = `${descParts.join(", ")}. Купити в магазині «Академкнига», Київ.`;
  const canonical = `/book/${encodeURIComponent(book.code)}`;

  return {
    title: titleParts.join(" — "),
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: book.titleUa,
      description,
      url: `${SITE_URL}${canonical}`,
      images: book.coverUrl ? [book.coverUrl] : undefined,
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const book = await getBook(code);
  if (!book) notFound();

  const canonical = `${SITE_URL}/book/${encodeURIComponent(book.code)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.titleUa,
    ...(book.author ? { author: { "@type": "Person", name: book.author } } : {}),
    ...(book.publisher ? { publisher: book.publisher } : {}),
    ...(book.year ? { datePublished: String(book.year) } : {}),
    ...(book.pages ? { numberOfPages: book.pages } : {}),
    inLanguage: "uk",
    url: canonical,
    ...(book.coverUrl ? { image: book.coverUrl } : {}),
    offers: {
      "@type": "Offer",
      price: String(book.price),
      priceCurrency: "UAH",
      availability:
        book.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: canonical,
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
      ...(book.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: book.category.nameUa,
              item: `${SITE_URL}/c/${book.category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: book.category ? 3 : 2,
        name: book.titleUa,
        item: canonical,
      },
    ],
  };

  return (
    <article className="space-y-3">
      <BreadcrumbTitleSetter title={book.titleUa} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="text-2xl">{book.titleUa}</h1>
      {book.titleRu && book.titleRu !== book.titleUa && (
        <div className="text-[color:var(--ab-muted)]">{book.titleRu}</div>
      )}
      {book.author && <p className="text-lg">{book.author}</p>}
      <dl
        className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm border p-3 rounded-sm"
        style={{
          borderColor: "var(--ab-border)",
          background: "var(--ab-paper)",
        }}
      >
        {book.publisher && (
          <>
            <dt>Видавництво</dt>
            <dd>{book.publisher}</dd>
          </>
        )}
        {book.city && (
          <>
            <dt>Місто</dt>
            <dd>{book.city}</dd>
          </>
        )}
        {book.year && (
          <>
            <dt>Рік</dt>
            <dd>{book.year}</dd>
          </>
        )}
        {book.pages && (
          <>
            <dt>Сторінок</dt>
            <dd>{book.pages}</dd>
          </>
        )}
        {book.binding && (
          <>
            <dt>Обкладинка</dt>
            <dd>{book.binding}</dd>
          </>
        )}
        <dt>Код</dt>
        <dd>{book.code}</dd>
        {book.notes && (
          <>
            <dt>Примітки</dt>
            <dd>{book.notes}</dd>
          </>
        )}
      </dl>
      <div className="flex items-center gap-4">
        <div className="text-2xl font-semibold">{book.price} ₴</div>
        <AddToCartButton book={book} />
      </div>
    </article>
  );
}
