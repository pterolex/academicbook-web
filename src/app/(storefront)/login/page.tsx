import { noindexMetadata } from "@/lib/seo";
import { LoginClient } from "./LoginClient";

export const metadata = noindexMetadata("Вхід");

export default function LoginPage() {
  return <LoginClient />;
}
