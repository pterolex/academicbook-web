import { noindexMetadata } from "@/lib/seo";
import { RegisterClient } from "./RegisterClient";

export const metadata = noindexMetadata("Реєстрація");

export default function RegisterPage() {
  return <RegisterClient />;
}
