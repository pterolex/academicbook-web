import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Книжковий магазин "Академкнига" Київ',
  description:
    "Книжковий магазин «Академкнига № 7», Київ. Близько 8000 видань, спеціалізація — фізико-математична література.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
