import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Дякуємо!</h1>
      <p>
        Ваше замовлення прийнято. Номер: <b>{code}</b>. Ми надіслали підтвердження
        на ваш e-mail і зв’яжемося для уточнення доставки.
      </p>
      <Link href="/">← До каталогу</Link>
    </div>
  );
}
