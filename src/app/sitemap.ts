import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/env";

// Revalidate the sitemap hourly so new books get indexed without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contacts",
    "/search",
    "/physics-math",
    "/history-religion",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.6,
  }));

  let categories: MetadataRoute.Sitemap = [];
  try {
    const cats = await api.categories();
    categories = cats.map((c) => ({
      url: `${SITE_URL}/c/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    /* skip on API failure */
  }

  let books: MetadataRoute.Sitemap = [];
  try {
    const list = await api.bookSitemap();
    books = list.map((b) => ({
      url: `${SITE_URL}/book/${encodeURIComponent(b.code)}`,
      lastModified: b.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    }));
  } catch {
    /* skip on API failure */
  }

  return [...staticRoutes, ...categories, ...books];
}
