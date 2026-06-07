import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/env";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s — Академкнига",
  },
  description: SITE_DESCRIPTION,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "BookStore",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
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
