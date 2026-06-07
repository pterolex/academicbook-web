import { noindexMetadata } from "@/lib/seo";
import { CartClient } from "./CartClient";

export const dynamic = "force-dynamic";
export const metadata = noindexMetadata("Кошик");

export default function CartPage() {
  return <CartClient />;
}
