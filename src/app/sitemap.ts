import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/env";

// Generate at request time so API failures do not publish a partial sitemap
// or break production builds; failed API calls surface as sitemap route errors.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contacts",
    "/physics-math",
    "/history-religion",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.6,
  }));

  const cats = await api.categories();
  const categories: MetadataRoute.Sitemap = cats.map((c) => ({
    url: `${SITE_URL}/c/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const list = await api.bookSitemap();
  const books: MetadataRoute.Sitemap = list.map((b) => ({
    url: `${SITE_URL}/book/${encodeURIComponent(b.code)}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categories, ...books];
}
