import { categorySlugMatching } from "@/lib/api";
import { CategoryHighlight } from "@/components/CategoryHighlight";

export const metadata = {
  title: "Історія, міфологія, релігія",
};

export default async function HistoryReligionPage() {
  const slug = await categorySlugMatching((name) => /істор/i.test(name));

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

      <CategoryHighlight slug={slug} />
    </article>
  );
}
