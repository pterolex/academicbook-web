import { noindexMetadata } from "@/lib/seo";
import { AccountClient } from "./AccountClient";

export const dynamic = "force-dynamic";
export const metadata = noindexMetadata("Обліковий запис");

export default function AccountPage() {
  return <AccountClient />;
}
