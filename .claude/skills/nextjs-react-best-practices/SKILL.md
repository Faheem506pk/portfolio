---
name: nextjs-react-best-practices
description: Best practices for React and Next.js (App Router) with Supabase - server/client component boundaries, data fetching, server actions, forms and validation, caching, performance, accessibility, error handling and testing. Use when writing or changing frontend or Next.js server code.
---

# Next.js + React Best Practices

## Architecture
- Default to Server Components. Add `'use client'` only for interactivity (state, effects, event handlers, browser APIs), and keep client components small and at the leaves.
- Fetch data on the server (Server Components, route handlers). Do not call Supabase with elevated privileges from the client.
- Put server-only code in modules that `import 'server-only'`. Never pass secrets or full DB rows with sensitive fields to client components; map to minimal DTOs.
- Organize by feature (`features/<name>/{components,actions,queries,schemas}`) rather than by file type; keep shared UI in `components/ui`.

## Server actions and route handlers
- Every action/handler: authenticate (`getUser()`), authorize, validate input with zod, then act. Return typed results (`{ ok: true, data } | { ok: false, error }`), not thrown raw errors.
- Revalidate affected data (`revalidatePath` / `revalidateTag`) after mutations.
- Guard against double submit (disable button, `useFormStatus`/`useTransition`) and make mutations idempotent where possible.

## Forms and validation
- Share one zod schema between client validation and server validation; the server is the source of truth.
- Show field-level errors, preserve user input on failure, and use accessible labels and `aria-describedby` for errors.

## Data fetching and caching
- Be explicit about caching per request (`revalidate`, `cache: 'no-store'` for user-specific data). Never cache per-user data in shared caches.
- Avoid request waterfalls: run independent queries with `Promise.all`; stream slow parts with `<Suspense>` and `loading.tsx`.
- Paginate lists and never fetch unbounded data.

## TypeScript
- `strict: true`; no `any`; prefer `unknown` + narrowing; use generated Supabase types; type component props explicitly.
- Prefer discriminated unions for states (idle/loading/error/success).

## Performance
- Use `next/image` and `next/font`; lazy-load heavy client components with `dynamic`.
- Minimize client JS: keep large libraries out of client bundles; check bundle impact of new deps.
- Memoize only when measured (`useMemo`/`useCallback`/`memo`); fix state placement first. Stable `key`s in lists; no derived state stored in `useState`.
- Effects: only for syncing with external systems; always clean up subscriptions/timers.

## Error and edge handling
- Provide `error.tsx`, `not-found.tsx`, and `loading.tsx` for routes; handle empty, loading, error, and offline states in UI.
- Handle Supabase `error` results explicitly and log server-side without leaking details to the user.

## Accessibility and UX
- Semantic HTML first; keyboard operable; visible focus; labels for inputs; sufficient contrast; alt text; do not rely on color alone; respect `prefers-reduced-motion`.
- Responsive layouts; test with keyboard and a screen reader for key flows.

## Testing and quality
- Unit-test pure logic and zod schemas; component-test interactive pieces (Testing Library); e2e (Playwright) for critical flows such as login and core CRUD.
- Test unhappy paths (validation failure, unauthorized, network error), not only the happy path.
- Before finishing: `npx tsc --noEmit`, `npm run lint`, `npm test`, and `next build` for changes touching routing or config.

## Hygiene
- Small, focused components and functions; no dead code; clear names; comments explain why, not what.
- Do not refactor unrelated code in the same change.
