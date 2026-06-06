import Link from "next/link";
import { api } from "@/lib/api";
import { BookCard } from "@/components/BookCard";

export const metadata = {
  title: "Фізико-математична література",
};

export default async function PhysicsMathPage() {
  let slug: string | undefined;
  try {
    const cats = await api.categories();
    slug = cats.find((c) =>
      /фіз/i.test(c.nameUa) && /мат/i.test(c.nameUa),
    )?.slug;
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
      <h1 className="text-xl">Фізико-математична література</h1>

      <p className="text-justify">
        Наша гордість — це відділ <strong>фізико-математичної літератури</strong>.
        Ми працюємо з видавництвами, які до сих пір не представлені на українському
        ринку зовсім або представлені дуже слабко.
      </p>
      <p className="text-justify">
        Це монографії, збірники наукових праць, підручники і задачники для студентів,
        розвиваюча література для просунутих школярів. Останні роки велику популярність
        придбав новий міждисциплінарний напрямок наукової думки — синергетика. У нас
        книги із синергетики широко представлені і користуються помітним попитом.
      </p>
      <p className="text-justify">
        Є у нас і великий вибір букіністичної наукової (і не тільки наукової)
        літератури. Багато з представлених у нас книг, наприклад, 50-х — 60-х років
        видання, більше ніколи не перевидавалися і вважаються бібліографічною
        рідкістю. А у нас можна знайти таку книгу.
      </p>
      <p>
        Ми здобули популярність в професійному співтоваристві — до нас нерідко
        приїжджають фізики і математики здалеку, щоб познайомитися з новинками, а
        хімік, біолог, астроном і інші природознавці знайдуть у нас щось цікаве для
        себе. Зараз на передові позиції в технічній і науковій думці висунулося новий
        напрямок — нанотехнології, і воно у нас також широко представлено і
        користується попитом. За фізико-математичною літературою до нас звертаються
        і з інших міст України.
      </p>
      <p>
        В магазині є можливість попереднього замовлення і можливість пересилки в інші
        міста України.
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
