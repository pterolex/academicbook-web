# academicbook-web

Next.js 16 (App Router) storefront + admin dashboard for AcademicBook. React 19, Formik +
Yup forms, Zustand state, Tailwind CSS 4. See the [root README](../README.md) for the
monorepo overview and Docker quick start.

## Setup

Requires Node 20+, pnpm. The [API](../academicbook-api/README.md) must be running.

```bash
pnpm install
# create .env.local (see Environment below)
pnpm dev            # http://localhost:3000
```

## Run

```bash
pnpm dev            # dev server
pnpm build          # production build
pnpm start          # serve the build
pnpm lint           # eslint
```

## Environment

Create `.env.local`:

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | API base URL used in the browser (e.g. `http://localhost:3001`) |
| `API_URL_SERVER` | API base URL for server-side fetches (SSR/ISR) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking (empty = disabled) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key (empty = disabled in dev) |

`NEXT_PUBLIC_*` vars are exposed to the browser — keep secrets out of them.

## reCAPTCHA v3

Invisible bot protection on the register, login, and checkout forms.

- **Provider:** `src/components/RecaptchaProvider.tsx` wraps the storefront in
  `GoogleReCaptchaProvider` (loaded via the storefront layout). When
  `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is unset it renders children directly (no-op) so dev
  works without keys.
- **Token per submit:** each form calls `useGoogleReCaptcha()` and, in its submit handler,
  `executeRecaptcha(action)` with `action` = `register` / `login` / `checkout`. The token
  is sent to the API as `recaptchaToken`.
- **API types:** `LoginInput`, `RegisterInput`, `OrderInput` in `src/lib/ApiClient.ts`
  carry the required `recaptchaToken` field.

When `executeRecaptcha` is unavailable (no provider in dev, or script not yet loaded), the
form submits an empty token — the backend accepts it only when its
`RECAPTCHA_SECRET_KEY` is also unset.

### Protect a new form

```tsx
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const { executeRecaptcha } = useGoogleReCaptcha();
// in onSubmit:
const recaptchaToken = executeRecaptcha ? await executeRecaptcha("my-action") : "";
await api.something(...args, recaptchaToken);
```

The component must be inside `RecaptchaProvider` (the storefront layout already is). Match
the `action` string to the backend `@Recaptcha('my-action')`.

See full key setup in the [root README](../README.md#recaptcha-setup).
