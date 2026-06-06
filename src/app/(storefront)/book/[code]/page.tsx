import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function BookPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  let book;
  try {
    book = await api.bookByCode(code);
  } catch {
    notFound();
  }
  if (!book) notFound();

  return (
    <article className="space-y-3">
      <div className="text-sm">
        <Link href="/">Головна</Link>
        {book.category && (
          <>
            {" / "}
            <Link href={`/c/${book.category.slug}`}>{book.category.nameUa}</Link>
          </>
        )}
      </div>
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
