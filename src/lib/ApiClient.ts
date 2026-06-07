import type { SessionUser } from "@/store/auth";

// Client-side API layer for mutations, auth, and admin queries.
// SSR catalog reads (books/categories) stay in `lib/api.ts` because they use
// Next.js fetch tags / ISR; this class owns everything that runs in the browser
// with a bearer token. Dependencies (base URL, token) are injected via the
// constructor so the same class works in tests with a mock config.

export interface ApiError extends Error {
  status?: number;
  body?: unknown;
}

export interface AuthResult {
  accessToken: string;
  user: SessionUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface OrderInput {
  name: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  zip?: string;
  notes?: string;
  createAccountPassword?: string;
  items: Array<{ code: string; qty: number }>;
}

export interface MyOrder {
  id: string;
  code: string;
  createdAt: string;
  subtotal: string | number;
  status: string;
  items: Array<{ titleUa: string; qty: number; price: string }>;
}

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "SHIPPED"
  | "DONE"
  | "CANCELLED";

export interface AdminOrder {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  subtotal: string;
  status: OrderStatus;
  createdAt: string;
  items: Array<{ titleUa: string; qty: number }>;
}

export interface AdminBook {
  id: string;
  code: string;
  titleUa: string;
  author: string | null;
  publisher: string | null;
  price: string;
  stock: number;
  category?: { nameUa: string };
}

export interface DateRange {
  from: string;
  to: string;
}

export interface Stats {
  range: DateRange;
  kpis: {
    revenueToday: string | number;
    revenue7d: string | number;
    revenueRange: string | number;
    ordersToday: number;
    orders7d: number;
    ordersNew: number;
    avgOrderValue: string | number;
    lowStockCount: number;
    newCustomers7d: number;
  };
  revenueByDay: Array<{ day: string; revenue: number; orders: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  topBooks: Array<{ titleUa: string; code: string; units: number; revenue: number }>;
  topCategories: Array<{ nameUa: string; units: number; revenue: number }>;
  newOrders: Array<{
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    subtotal: string;
    status: string;
    createdAt: string;
  }>;
}

export interface ImportReport {
  parsed: number;
  toCreate: number;
  toUpdate: number;
  toDelete: number;
  categoriesCreated: number;
  errors: Array<{ line: number; message: string }>;
  committed: boolean;
}

export interface ImportHistoryRow {
  id: string;
  source: "url" | "file" | string;
  url: string | null;
  fileName: string | null;
  parsed: number;
  toCreate: number;
  toUpdate: number;
  toDelete: number;
  categoriesCreated: number;
  errorsCount: number;
  errors: Array<{ line: number; message: string }> | null;
  committed: boolean;
  durationMs: number | null;
  createdAt: string;
}

interface RequestOpts extends Omit<RequestInit, "body"> {
  json?: unknown;
  body?: BodyInit;
}

function qs(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) sp.set(k, String(v));
  }
  return sp.toString();
}

export class ApiClient {
  constructor(private config: { baseUrl: string; token?: string | null }) {}

  private async request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
    const { json, body, headers, ...rest } = opts;
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(this.config.token
          ? { Authorization: `Bearer ${this.config.token}` }
          : {}),
        ...(headers as Record<string, string> | undefined),
      },
      body: json !== undefined ? JSON.stringify(json) : body,
    });

    if (!res.ok) {
      const respBody = await res.json().catch(() => null);
      const message =
        typeof respBody === "object" && respBody && "message" in respBody
          ? String((respBody as { message: unknown }).message)
          : res.statusText;
      const err = new Error(message) as ApiError;
      err.status = res.status;
      err.body = respBody;
      throw err;
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  auth = {
    login: (input: LoginInput) =>
      this.request<AuthResult>("/auth/login", { method: "POST", json: input }),
    register: (input: RegisterInput) =>
      this.request<AuthResult>("/auth/register", {
        method: "POST",
        json: input,
      }),
  };

  orders = {
    create: (input: OrderInput) =>
      this.request<{ code: string }>("/orders", {
        method: "POST",
        json: input,
      }),
    mine: () => this.request<MyOrder[]>("/me/orders"),
  };

  admin = {
    stats: (range: DateRange) =>
      this.request<Stats>(`/admin/stats?${qs({ from: range.from, to: range.to })}`),
    orders: () => this.request<AdminOrder[]>("/admin/orders"),
    setOrderStatus: (id: string, status: OrderStatus) =>
      this.request<void>(`/admin/orders/${id}/status`, {
        method: "PATCH",
        json: { status },
      }),
    books: (q?: string) =>
      this.request<AdminBook[]>(`/admin/books${q ? `?${qs({ q })}` : ""}`),
    importSource: () =>
      this.request<{ url: string }>("/admin/import/source"),
    importHistory: (limit = 20) =>
      this.request<ImportHistoryRow[]>(`/admin/import/history?${qs({ limit })}`),
    importFile: (file: File, dryRun: boolean) => {
      const fd = new FormData();
      fd.append("file", file);
      return this.request<ImportReport>(`/admin/import?${qs({ dryRun })}`, {
        method: "POST",
        body: fd,
      });
    },
    importUrl: (url: string | undefined, dryRun: boolean) =>
      this.request<ImportReport>(`/admin/import/url?${qs({ dryRun })}`, {
        method: "POST",
        json: url ? { url } : {},
      }),
  };
}
