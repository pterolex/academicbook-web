import { API_URL, API_URL_SERVER } from "./env";

export interface Category {
  id: string;
  slug: string;
  nameUa: string;
  nameRu: string | null;
  _count?: { books: number };
}

export interface Book {
  id: string;
  code: string;
  author: string | null;
  titleRu: string;
  titleUa: string;
  year: number | null;
  city: string | null;
  publisher: string | null;
  binding: string | null;
  pages: number | null;
  price: string;
  notes: string | null;
  stock: number;
  coverUrl: string | null;
  category?: Category;
}

export interface BookList {
  items: Book[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

const isServer = typeof window === "undefined";
const baseFor = () => (isServer ? API_URL_SERVER : API_URL);

interface FetchOpts extends RequestInit {
  tags?: string[];
  token?: string;
}

export async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { tags, token, headers, ...rest } = opts;
  const res = await fetch(`${baseFor()}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string> | undefined),
    },
    next: tags ? { tags } : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    const err = new Error(
      `API ${res.status}: ${typeof body === "object" && body && "message" in body ? String((body as { message: unknown }).message) : res.statusText}`,
    );
    (err as Error & { status?: number; body?: unknown }).status = res.status;
    (err as Error & { status?: number; body?: unknown }).body = body;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  categories: () => apiFetch<Category[]>("/categories", { tags: ["categories"] }),
  books: (params: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    return apiFetch<BookList>(`/books?${qs.toString()}`, {
      tags: ["books"],
    });
  },
  bookByCode: (code: string) =>
    apiFetch<Book>(`/books/${encodeURIComponent(code)}`, {
      tags: [`book:${code}`],
    }),
};
