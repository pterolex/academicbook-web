# Architecture Review Results

> Analyzed on: 2026-06-07
> Project: academicbook-web (Next.js 16 App Router, React 19, Zustand, Formik)
> Total components analyzed: 33
> Issues found: 8

## Summary

The presentation layer is in good shape: the app correctly centralizes its shell via Next.js route-group layouts (`(storefront)` and `(admin)`), leaf components like `BookCard` are clean and single-purpose, and Zustand stores (`cart`, `auth`) have a tidy, well-typed API. The biggest structural problem is the **data layer**: `lib/api.ts` only wraps two read endpoints, so every mutation, auth call, and admin query is a hand-rolled `fetch()` scattered across client components — re-implementing auth headers, credentials, and error parsing ~10 times. Closely related, there is **no hooks layer**: admin pages each inline their own `useEffect` + `useState` + `fetch` + loading/error bookkeeping. Fixing these two would remove most of the duplication and make a future backend change a one-file edit. `AdminHome` (416 lines) is the one severe Single-Level-of-Abstraction offender.

## Issues

### ISSUE-1: No API service layer — raw `fetch` scattered across components

**Severity**: High
**Principle**: Missing API Abstraction
**Location**: `src/lib/api.ts`, `src/app/(storefront)/login/page.tsx`, `register/page.tsx`, `checkout/CheckoutClient.tsx`, `account/AccountClient.tsx`, `src/app/(admin)/admin/{page,orders,books,import}/page.tsx`

`lib/api.ts` exposes only `categories`/`books` reads. Every write, auth, and admin call bypasses it and talks to the backend directly with `fetch(`${API_URL}/...`)`, each site re-declaring `Authorization`, `credentials`, `Content-Type`, and the `res.json().catch(() => ({}))` error dance. A backend move (REST → GraphQL), an auth-header change, or adding retry/refresh logic means editing every one of these ~10 call sites. Note the existing `apiFetch` helper already handles token + error parsing — but the mutation sites don't use it.

#### Current (Bad)

```tsx
// login/page.tsx — and near-identical blocks in register, checkout, account, all admin pages
const res = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(values),
});
if (!res.ok) {
  const b = await res.json().catch(() => ({}));
  throw new Error(b.message ?? "Невірні дані");
}
const data = await res.json();
```

#### Recommended (Good)

```tsx
// lib/ApiClient.ts — one class, dependencies injected via constructor
export class ApiClient {
  constructor(private config: { baseUrl: string; token?: string }) {}

  auth = {
    login: (body: Credentials) => this.post<AuthResult>("/auth/login", body),
    register: (body: RegisterInput) => this.post<AuthResult>("/auth/register", body),
  };
  orders = {
    create: (body: OrderInput) => this.post<Order>("/orders", body),
    mine: () => this.get<OrderRow[]>("/me/orders"),
  };
  admin = {
    stats: (range: DateRange) => this.get<Stats>(`/admin/stats?${qs(range)}`),
    orders: () => this.get<AdminOrder[]>("/admin/orders"),
    setStatus: (id: string, status: Status) =>
      this.patch(`/admin/orders/${id}/status`, { status }),
  };
  // private get/post/patch share headers, credentials, and error handling once
}

// login/page.tsx
const { accessToken, user } = await api.auth.login(values); // throws typed error
```

**Why this is better**: Auth headers, credentials, and error handling live in one place; swapping backends or tests means `new ApiClient({ baseUrl: 'http://mock' })`, not editing ten components.

---

### ISSUE-2: Data-fetching logic duplicated in components — no hooks layer

**Severity**: High
**Principle**: Unclear Data Flow
**Location**: `src/app/(admin)/admin/{page,orders,books,import}/page.tsx`, `src/app/(storefront)/account/AccountClient.tsx`

Every client page that loads data re-implements the same `useState` + `useEffect(token)` + `fetch` + `loading`/`error` choreography inline in the component body. `AdminOrders` and `AdminBooks` even carry `// eslint-disable-next-line react-hooks/exhaustive-deps` because the `load()` function isn't memoized. State ownership and fetch lifecycle are tangled into rendering, and the pattern is copy-pasted five times.

#### Current (Bad)

```tsx
// admin/orders/page.tsx
const token = useAuth((s) => s.accessToken);
const [rows, setRows] = useState<Row[]>([]);
function load() {
  fetch(`${API_URL}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.json()).then(setRows);
}
useEffect(() => { if (token) load(); }, [token]); // eslint-disable exhaustive-deps
```

#### Recommended (Good)

```tsx
// hooks/useAdminOrders.ts — thin React-state wrapper over the API client (ISSUE-1)
export function useAdminOrders() {
  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const reload = useCallback(() => api.admin.orders().then(setRows), []);
  useEffect(() => { reload(); }, [reload]);
  const setStatus = async (id: string, s: Status) => {
    setBusy(id); await api.admin.setStatus(id, s); await reload(); setBusy(null);
  };
  return { rows, busy, setStatus };
}

// admin/orders/page.tsx
const { rows, busy, setStatus } = useAdminOrders(); // component just renders
```

**Why this is better**: The page becomes pure rendering; fetch lifecycle and loading state are owned by a named, reusable hook, and the `exhaustive-deps` suppression disappears.

---

### ISSUE-3: `AdminHome` is a 416-line god component mixing every abstraction level

**Severity**: High
**Principle**: SLA Violation
**Location**: `src/app/(admin)/admin/page.tsx`

The dashboard page mixes data fetching, currency/date helpers (`fmtUah`, `ymd`, `presetRange`), a full inline orders `<table>`, an eight-cell KPI grid, and five raw `recharts` chart definitions (gradients, axes, tooltips) all in one render. You cannot describe what it renders in one sentence of component names — it's "a table, and a KPI grid, and an area chart with a gradient def, and a pie with cell colors, and...". Each chart sits at the raw recharts-primitive level, far below the page's domain level.

#### Current (Bad)

```tsx
// admin/page.tsx — render body, abbreviated
<Card title={`Виторг (${rangeLabel})`} className="lg:col-span-2">
  <ResponsiveContainer width="100%" height={280}>
    <AreaChart data={stats.revenueByDay} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
      <defs><linearGradient id="rev" ...><stop offset="0%" .../></linearGradient></defs>
      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
      <XAxis dataKey="day" tickFormatter={(d) => d.slice(5)} /> {/* ...30 more lines... */}
    </AreaChart>
  </ResponsiveContainer>
</Card>
{/* + inline newOrders table + KPI grid + 4 more inline charts */}
```

#### Recommended (Good)

```tsx
// admin/page.tsx — reads like a sentence of named domain components
export default function AdminHome() {
  const { stats, range, setRange, loading, reload, error } = useAdminStats();
  if (!stats) return <p>Завантаження…</p>;
  return (
    <DashboardLayout header={<DateFilter range={range} onChange={setRange} loading={loading} onReload={reload} />}>
      <NewOrdersTable orders={stats.newOrders} />
      <KpiGrid kpis={stats.kpis} rangeLabel={rangeLabel} />
      <RevenueAreaChart data={stats.revenueByDay} />
      <OrdersByStatusPie data={stats.ordersByStatus} />
      <TopCategoriesBar data={stats.topCategories} />
      <TopBooksBar data={stats.topBooks} />
    </DashboardLayout>
  );
}
```

**Why this is better**: Each chart's recharts wiring lives in its own file at its own level; the page composes named domain pieces and is readable at a glance.

---

### ISSUE-4: `AdminImport` mixes URL mode, file mode, report, and history in one component

**Severity**: Medium
**Principle**: SLA Violation
**Location**: `src/app/(admin)/admin/import/page.tsx`

At 334 lines this component holds two upload flows (`sendUrl`/`sendFile`), the mode toggle, the dry-run report block, and a nine-column history table — all inline. The render mixes domain-level concepts (import report, sync history) with raw `<table>`/`<details>` markup.

#### Current (Bad)

```tsx
// import/page.tsx — render body holds all of this inline
{report && (<div className="border p-3 ...">{/* 30 lines of report fields */}</div>)}
<div className="pt-4 border-t ...">
  <h2>Історія синхронізацій</h2>
  <table>{/* 60 lines: thead + history.map with nested <details> for errors */}</table>
</div>
```

#### Recommended (Good)

```tsx
// import/page.tsx
<ImportSourcePicker mode={mode} onMode={setMode} url={url} onUrl={setUrl} file={file} onFile={setFile} />
<ImportActions busy={busy} canCommit={!!report} onRun={send} />
{report && <ImportReport report={report} />}
<ImportHistoryTable rows={history} loading={historyLoading} onReload={loadHistory} />
```

**Why this is better**: Each piece (report, history table) becomes independently readable and testable; the page describes the import flow in four named steps.

---

### ISSUE-5: Three different form-field implementations for the same pattern

**Severity**: Medium
**Principle**: Code Duplication
**Location**: `src/app/(storefront)/checkout/CheckoutClient.tsx`, `login/page.tsx`, `register/page.tsx`

The same Formik field shape — `<label>` + `<Field>`/`useField` + `<ErrorMessage>` with identical `className`/`style` — is implemented three different ways: `CheckoutClient` defines a local `TextField`, `RegisterPage` maps a `FIELDS` array with inline markup, and `LoginPage` hand-writes each `<label>` block. Same structure, three copies.

#### Current (Bad)

```tsx
// login/page.tsx — hand-written per field
<label className="block">
  <span className="text-sm">E-mail</span>
  <Field type="email" name="email" className="w-full border px-3 py-2 rounded-sm" style={{...}} />
  <ErrorMessage name="email" component="div" className="text-xs text-red-600" />
</label>
// register/page.tsx — same thing via FIELDS.map(...)
// checkout/CheckoutClient.tsx — same thing via a local TextField component
```

#### Recommended (Good)

```tsx
// components/FormField.tsx — one shared field (promote CheckoutClient's TextField)
export function FormField({ name, label, type = "text", required, textarea }: FormFieldProps) { /* ... */ }

// login/page.tsx
<FormField name="email" label="E-mail" type="email" required />
<FormField name="password" label="Пароль" type="password" required />
```

**Why this is better**: One field component means consistent markup and one place to change validation styling; login/register/checkout shrink to a list of `<FormField>`s.

---

### ISSUE-6: `physics-math` and `history-religion` pages are structurally duplicated

**Severity**: Medium
**Principle**: Code Duplication
**Location**: `src/app/(storefront)/physics-math/page.tsx`, `history-religion/page.tsx`

Both pages do the identical dance: resolve a category slug by regex over `api.categories()`, fetch the 6 newest books, then render intro prose followed by a copy-pasted "Книги розділу" section (header + "Усі книги →" link + book grid). Only the prose and the regex differ.

#### Current (Bad)

```tsx
// physics-math/page.tsx AND history-religion/page.tsx — same block in both
let slug: string | undefined;
try { const cats = await api.categories(); slug = cats.find((c) => /істор/i.test(c.nameUa))?.slug; } catch {}
let items = []; try { items = (await api.books({ category: slug, sort: "newest", pageSize: "6" })).items; } catch {}
// ...later, identical "Книги розділу" section with grid + link
```

#### Recommended (Good)

```tsx
// lib/api.ts (or a server helper) + a shared section component
async function categorySlugMatching(test: RegExp) { /* find over categories() */ }

// physics-math/page.tsx
const slug = await categorySlugMatching(/фіз.*мат/i);
return (
  <article className="space-y-4">
    <PhysicsMathIntro />
    <CategoryHighlight slug={slug} title="Книги розділу" />
  </article>
);
```

**Why this is better**: The shared fetch + "Книги розділу" grid lives once in `<CategoryHighlight>`; each landing page keeps only its unique prose.

---

### ISSUE-7: Book grid markup repeated across five pages

**Severity**: Low
**Principle**: Code Duplication
**Location**: `(storefront)/page.tsx`, `c/[slug]/page.tsx`, `search/page.tsx`, `physics-math/page.tsx`, `history-religion/page.tsx`

The exact grid wrapper `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{items.map((b) => <BookCard key={b.id} book={b} />)}</div>` appears verbatim in five files. A grid column change today is a five-file edit.

#### Current (Bad)

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  {data.items.map((b) => <BookCard key={b.id} book={b} />)}
</div>
```

#### Recommended (Good)

```tsx
// components/BookGrid.tsx
export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {books.map((b) => <BookCard key={b.id} book={b} />)}
    </div>
  );
}
// usage: <BookGrid books={data.items} />
```

**Why this is better**: One named component owns the catalog layout; every listing page renders `<BookGrid books={...} />`.

---

### ISSUE-8: Auth-guard redirect logic duplicated

**Severity**: Low
**Principle**: Code Duplication
**Location**: `src/app/(admin)/admin/layout.tsx`, `src/app/(storefront)/account/AccountClient.tsx`

Both components implement the same client-side guard: read `user` from the store, `useEffect` that `router.replace("/login")` when absent, then `if (!user) return null`. `AdminLayout` additionally checks the `ADMIN` role.

#### Current (Bad)

```tsx
// account/AccountClient.tsx and admin/layout.tsx
useEffect(() => { if (!user) router.replace("/login"); }, [user, router]);
if (!user) return null;
```

#### Recommended (Good)

```tsx
// hooks/useRequireAuth.ts
export function useRequireAuth(opts?: { role?: SessionUser["role"] }) {
  const user = useAuth((s) => s.user);
  const router = useRouter();
  useEffect(() => {
    if (!user) router.replace("/login");
    else if (opts?.role && user.role !== opts.role) router.replace("/");
  }, [user, router, opts?.role]);
  return user;
}
// usage: const user = useRequireAuth({ role: "ADMIN" }); if (!user) return null;
```

**Why this is better**: The redirect contract lives in one hook; guarded pages declare their requirement in one line.

## Recommendations Summary

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | ISSUE-1: API service layer (class) for mutations/auth/admin | High | High |
| 2 | ISSUE-2: Extract data-fetching hooks over the service | Med | High |
| 3 | ISSUE-3: Break up `AdminHome` god component | Med | High |
| 4 | ISSUE-4: Split `AdminImport` into report/history/form | Med | Med |
| 5 | ISSUE-5: Single shared `FormField` | Low | Med |
| 6 | ISSUE-6: Share category-landing fetch + section | Low | Med |
| 7 | ISSUE-7: `BookGrid` component | Low | Low |
| 8 | ISSUE-8: `useRequireAuth` hook | Low | Low |

## Architecture Health Score

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Single Level of Abstraction | 3 | Leaf components clean; `AdminHome` (416 lines) and `AdminImport` (334) mix domain with raw tables/charts. |
| Component API Design | 4 | Props are minimal and well-named (`BookCard`, `Kpi`, `Card`, `DateFilter`); no god props or boolean explosion. |
| Data Flow Clarity | 2 | No hooks layer — fetch/state/loading inlined in each client page, with `exhaustive-deps` suppressions. |
| API Abstraction Layer | 2 | Reads wrapped in `lib/api.ts`; all mutations/auth/admin use raw `fetch` in components, bypassing even `apiFetch`. Not a class. |
| App Layout / Shell | 5 | Correctly centralized via Next.js route-group layouts; pages stay self-contained route segments. No duplicated shell. |
| Code Duplication | 3 | Book grid (5×), form fields (3 patterns), category landing pages (2×), auth guard (2×) all repeated. |
| Composition Patterns | 4 | Good use of server components for data (`SidebarFirst`), `children` for layout, clean store selectors. |
| **Overall** | **3.1** | Solid presentation/layout foundation; the data layer (service class + hooks) is where the leverage is. |
