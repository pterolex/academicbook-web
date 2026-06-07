import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const SITE_NAME = 'Книжковий магазин "Академкнига" Київ';
const DESCRIPTION =
  "Книжковий магазин «Академкнига № 7», Київ. Близько 8000 видань, спеціалізація — фізико-математична література.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s — Академкнига",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "uk_UA",
    url: SITE_URL,
    title: SITE_NAME,
    description: DESCRIPTION,
  },
  twitter: { card: "summary" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "BookStore",
  name: SITE_NAME,
  description: DESCRIPTION,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Київ",
    addressCountry: "UA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
