# Next.js Frontend Starter Kit

A reusable, **frontend-only** starter: no database, no backend, no auth, no monorepo.
Everything lives in one app, with `src/lib/` used as a folder convention to keep
concerns separated.

Built on Next.js 16 (App Router, Turbopack) and React 19.2.

## Stack

| Area | Choice | Version |
| --- | --- | --- |
| Framework | [Next.js](https://nextjs.org) App Router, Turbopack | 16.3.4 |
| UI library | React | 19.2.8 |
| Language | TypeScript (native compiler) | 7.0.2 |
| Styling | Tailwind CSS v4 — CSS-first, no `tailwind.config.ts` | 4.3.3 |
| Components | [shadcn/ui](https://ui.shadcn.com) on Radix (`radix-ui`) | CLI 4.x |
| Icons | `lucide-react` | 1.41.0 |
| Dark mode | `next-themes`, class-based | 0.4.6 |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | 7.87 / 4.5 / 5.9 |
| Data fetching | `@tanstack/react-query` | 5.102.8 |
| i18n | `next-intl`, `[locale]` routing | 4.14.2 |
| Env validation | `@t3-oss/env-nextjs` (zod-backed) | 0.13.11 |
| Lint + format | [Ultracite](https://ultracite.ai) over `oxlint` + `oxfmt` | 7.11 / 1.81 / 0.66 |
| Git hooks | `lefthook` + `commitlint` (Conventional Commits) | 2.1 / 21.2 |
| Dead code | `knip` | 6.34 |
| Unit / component tests | `vitest` in **browser mode** + `vitest-browser-react` | 4.1.11 |
| Component docs | `storybook` with `@storybook/nextjs-vite` | 10.6.0 |
| E2E | `@playwright/test` | 1.63.0 |
| CI | GitHub Actions | — |
| Container (optional) | Multi-stage `Dockerfile`, standalone output | — |

Node 24 (see `.nvmrc`), pnpm 10.

## Getting started

```bash
pnpm install
pnpm exec playwright install chromium   # component + e2e tests run in a real browser
cp .env.example .env.local              # optional; every variable is optional
pnpm dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` / `build` / `start` | Next.js dev server, production build, production server |
| `pnpm lint` / `lint:fix` | Ultracite (oxlint + oxfmt), with type-aware rules |
| `pnpm check:types` | `next typegen` then `tsc --noEmit` |
| `pnpm check:deps` | Knip — unused files, exports and dependencies |
| `pnpm test` / `test:watch` | Vitest: unit tests in Node, component tests in Chromium |
| `pnpm test:e2e` | Playwright |
| `pnpm storybook` / `storybook:test` | Storybook dev server / run every story as a test |
| `pnpm analyze` | `next experimental-analyze` bundle report |
| `pnpm commit` | Guided Conventional Commit prompt |

## Project layout

```
src/
  app/
    global-error.tsx        last-resort boundary; renders its own <html>
    robots.ts sitemap.ts manifest.ts
    llms.txt/route.ts
    [locale]/               the root layout lives here, not at app/
      layout.tsx page.tsx error.tsx not-found.tsx loading.tsx
      opengraph-image.tsx
      demo/form/page.tsx
  components/
    forms/                  the form field layer (see below)
    ui/                     vendored by the shadcn CLI — do not hand-edit
    layout/ demo/
  config/app.ts             name, locales, description — start here
  lib/
    analytics/              provider-agnostic analytics
    observability/          provider-agnostic error reporting
    i18n/ query/ seo/
    env.ts
  locales/                  en.json, zh-TW.json
  proxy.ts                  locale routing (was middleware.ts before Next 16)
  instrumentation.ts        server-side; register() + onRequestError
  instrumentation-client.ts browser-side; runs before hydration
  styles/globals.css        Tailwind v4 config lives here
```

## The two swappable layers

Both ship with a console implementation so the layer is always wired and call
sites never need a null check. **No vendor SDK is installed.**

### Analytics — `src/lib/analytics`

```ts
import { track, identify, page, reset } from '@/lib/analytics';

track('checkout_started', { plan: 'pro' });
```

To plug in a real provider (PostHog, Vercel Analytics, Segment, GA…):

1. Copy `src/lib/analytics/providers/custom-provider.template.ts` and fill in the TODOs.
2. Add any keys to the `client` block in `src/lib/env.ts` and to `.env.example`.
3. Register it **synchronously** in `src/instrumentation-client.ts`:
   ```ts
   setAnalyticsProvider(myProvider);
   ```

Call sites never change. Page views are already wired: `onRouterTransitionStart`
in `instrumentation-client.ts` calls `page()` on every client navigation, and
`<WebVitals />` reports Core Web Vitals through `track()`.

> If your vendor captures page views automatically, make `page()` a no-op or you
> will double-count.

### Observability — `src/lib/observability`

```ts
import { captureException, captureMessage, setUser } from '@/lib/observability';
```

Already wired to `error.tsx`, `global-error.tsx`, `onRequestError` (server), and
`window.onerror` / `unhandledrejection` (browser, for the errors React error
boundaries never see). `<ErrorBoundary>` gives you a component-level boundary
built on Next's `catchError`, so `redirect()` and `notFound()` pass through
instead of being swallowed.

Sentry is the intended production backend. When you wire it up, prefer
`instrumentationClientInject` in `next.config.ts` over editing
`instrumentation-client.ts` by hand.

> Anything async started in `instrumentation-client.ts` is fire-and-forget and
> may land after hydration. Static-import a provider that must be live before
> the first render.

## Forms

Fields are self-contained: each takes `control` + `name` and calls
`useController` itself. There is no render-prop `<FormField>`.

```tsx
const { control, handleSubmit } = useForm<Values>({
  resolver: zodResolver(schema),
  defaultValues,
  mode: 'onBlur',
});

<InputField containerProps={{ label: 'Email' }} control={control} name="email" type="email" />
```

`FieldContainer` owns the label/description/error chrome and wires `htmlFor`,
`aria-describedby` and `aria-invalid`. An error message **replaces** the
description rather than stacking below it, so the field never shifts layout when
validation fails.

Colocate the schema with the fields (`*-form-fields.tsx`) and let the page own
`useForm` and the submit action — see `src/components/demo/`.

> `z.coerce.number()` has an input type of `unknown`, which breaks
> react-hook-form's `FieldValues` constraint. Use `z.number()` and
> `<InputField numeric />`, which keeps partial input like `12.` visible instead
> of snapping it to `NaN`.

### Where does submitted data go?

The demo form only validates — that decision is yours. Two options keep the app
frontend-only:

- **Client-side export.** Build a `Blob` from the validated values and trigger a
  download. Genuinely zero-network; fits internal tools and config generators.
- **A third-party form endpoint** (Formspree, Basin, Resend) or a single Route
  Handler. Needed whenever someone *other than* the person filling the form has
  to receive the data. Still no database and no auth.

## Styling

Tailwind v4 is configured in `src/styles/globals.css` — there is no
`tailwind.config.ts`. Colours sit on `:root` / `.dark` using shadcn's token
names, and `@theme inline` maps them onto Tailwind's `--color-*` namespace so one
utility resolves per colour scheme.

There is also a named type scale (`text-body-1`, `text-heading-2`, …) so
typography stays a design decision rather than a per-component guess.

Add components with `pnpm dlx shadcn@latest add <name>`. They land in
`src/components/ui/`, which is excluded from lint and Knip because the CLI
overwrites it.

## i18n

`next-intl` with `[locale]` routing and `localePrefix: 'as-needed'`, so the
default locale is served unprefixed. Add a locale in `src/config/app.ts` and drop
a matching file in `src/locales/`.

The locale is read via **`next/root-params`**; `setRequestLocale` and
`requestLocale` are deprecated and not used here.

> The proxy matcher in `src/proxy.ts` deliberately excludes metadata routes at
> any depth. Under `[locale]` the OG image resolves to `/en/opengraph-image`, and
> without that exclusion the proxy redirects it into a 404. Extend the matcher if
> you add more metadata conventions.

## SEO and AEO

`robots.ts` (AI crawlers allowed explicitly), a locale-aware `sitemap.ts` with
`hreflang` alternates, `manifest.ts`, a per-locale `opengraph-image.tsx`, a
`buildMetadata()` helper, and JSON-LD via `<JsonLd>` typed with `schema-dts`.

`llms.txt` is an emerging convention rather than a standard — keep it accurate if
answer-engine visibility matters, or delete the route.

## Security headers

Set in `next.config.ts` via `headers()`: CSP, HSTS, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`.

The CSP is deliberately **not** nonce-based. A nonce has to be generated per
request in `proxy.ts`, which forces every page to render dynamically and is
incompatible with Partial Prerendering. If you need a strict CSP more than static
rendering, move the CSP into `proxy.ts` and read the nonce with
`(await headers()).get('x-nonce')`.

## Docker (optional)

The default target is Vercel, where the `Dockerfile` is unused. It is included
as an escape hatch so a project built on this template can self-host without
re-deriving the build.

```bash
docker build -t starter-kit --build-arg NEXT_PUBLIC_APP_URL=https://example.com .
docker run --rm -p 3000:3000 starter-kit
```

Two things worth knowing:

- Docker needs `output: 'standalone'`, which changes the build layout. It is
  gated behind `DOCKER_BUILD` in `next.config.ts` so the default Vercel build is
  untouched. To reproduce the container build locally: `DOCKER_BUILD=1 pnpm build`.
- `NEXT_PUBLIC_*` variables are inlined at **build** time, so they must be passed
  as `--build-arg`. Setting them at `docker run` is too late — the values are
  already baked into the client bundle.

The standalone bundle deliberately omits `public/` and `.next/static`; the
`Dockerfile` copies both explicitly, and the final image runs as a non-root user.

## Deliberately left out

- **`cacheComponents`** — opt-in in Next 16. It forces PPR, `<Suspense>`
  discipline and `<Activity>` state persistence, none of which a frontend-only
  kit benefits from.
- **`forbidden.tsx` / `unauthorized.tsx`** — experimental, and auth-shaped.
- **`global-not-found.tsx`** — experimental, needs `experimental.globalNotFound`.
- **React Compiler** — stable but opt-in; it needs Babel and slows builds.
- **A cookie-consent banner** — only needed once a real analytics provider is
  wired in and the site has EU visitors.

## Notes for Next.js 16

This is not the Next.js most references describe. The differences that bite:

- `middleware.ts` is now **`proxy.ts`**, and `runtime` cannot be set in it.
- `error.tsx` receives **`retry`**, not `reset`.
- `params`, `searchParams`, `cookies()` and `headers()` are always Promises.
- `PageProps<'/x'>`, `LayoutProps<'/x'>` and `RouteContext<'/x'>` are generated
  globals — run `next typegen` before `tsc`.
- `next lint` is gone; Turbopack is the default bundler, so never pass
  `--turbopack`.
- `next experimental-analyze` replaces `@next/bundle-analyzer`, which is
  webpack-only.
- `<Image preload>` replaces the deprecated `priority`.

The authoritative reference is the copy of the docs shipped inside the installed
package, at `node_modules/next/dist/docs/`.
