import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL_SERVER ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Old Drupal taxonomy prefixes (decoded Cyrillic) that map to a category.
const TOPIC_PREFIXES = ["/тема/", "/topic/"];

interface Category {
  slug: string;
  nameUa: string;
  nameRu: string | null;
}

const norm = (s: string) => s.trim().toLowerCase().replace(/[_-]+/g, " ");

async function findSlug(term: string): Promise<string | null> {
  let cats: Category[];
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    cats = await res.json();
  } catch {
    return null;
  }
  const t = norm(term);
  const hit = cats.find(
    (c) => norm(c.nameUa) === t || (c.nameRu && norm(c.nameRu) === t),
  );
  return hit?.slug ?? null;
}

async function resolveBook(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${API}/books/resolve-legacy?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data: { code: string | null } = await res.json();
    return data.code ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  // pathname may be percent-encoded for non-ASCII; decode safely.
  let path = req.nextUrl.pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep raw */
  }

  const prefix = TOPIC_PREFIXES.find((p) => path.startsWith(p));
  if (prefix) {
    const term = path.slice(prefix.length).replace(/\/+$/, "");
    if (!term) return NextResponse.next();
    const slug = await findSlug(term);
    const dest = req.nextUrl.clone();
    dest.search = "";
    if (slug) {
      dest.pathname = `/c/${slug}`;
    } else {
      // No matching category — land on search so the deep link still goes somewhere useful.
      dest.pathname = "/search";
      dest.searchParams.set("q", term);
    }
    return NextResponse.redirect(dest, 301);
  }

  // Legacy Drupal book page: a single Cyrillic slug segment (new routes are all ASCII).
  const seg = path.replace(/^\/+|\/+$/g, "");
  if (seg && !seg.includes("/") && /[Ѐ-ӿ]/.test(seg)) {
    const code = await resolveBook(seg);
    const dest = req.nextUrl.clone();
    dest.search = "";
    if (code) {
      dest.pathname = `/book/${code}`;
    } else {
      dest.pathname = "/search";
      dest.searchParams.set("q", seg.replace(/-+/g, " "));
    }
    return NextResponse.redirect(dest, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals/static/api so encoded Cyrillic paths are caught.
  matcher: ["/((?!_next/|api/|favicon.ico).*)"],
};
