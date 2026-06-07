import { noindexMetadata } from "@/lib/seo";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";
export const metadata = noindexMetadata("Оформлення замовлення");

export default function CheckoutPage() {
  return <CheckoutClient />;
}
