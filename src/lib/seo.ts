import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";

export const SITE_NAME = 'Книжковий магазин "Академкнига" Київ';
export const SITE_DESCRIPTION =
  "Книжковий магазин «Академкнига № 7», Київ. Близько 8000 видань, спеціалізація — фізико-математична література.";
export const SITE_LOCALE = "uk_UA";

export function canonicalPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${canonicalPath(pathOrUrl)}`;
}

export function openGraphMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  images,
}: {
  title: string;
  description?: string;
  path: string;
  images?: string[];
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: absoluteUrl(path),
    title,
    description,
    images: images?.map(absoluteUrl),
  };
}

export function publicPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  images,
}: {
  title?: string;
  description?: string;
  path: string;
  images?: string[];
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: canonicalPath(path) },
    openGraph: openGraphMetadata({
      title: title ?? SITE_NAME,
      description,
      path,
      images,
    }),
  };
}

export function noindexMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}
