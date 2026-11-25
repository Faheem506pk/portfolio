---
name: nextjs-rsc-storefront
description: Guides on how to develop and refactor Next.js App Router storefront code following a React Server Components (RSC) first architecture. Use when editing or creating storefront pages, block renderers, theme components, and layouts.
---

# Next.js React Server Components (RSC) Storefront Architecture

Ensure that storefront pages in `storefront-next/` remain performant, crawlable, and SEO-friendly by defaulting to Server Components and isolating interactive client states.

## When to use this skill

* Creating or editing page entry points (`page.tsx`) in the storefront router.
* Modifying the `BlockRenderer` or layout compilation logic.
* Adding new visual block theme components or sections.
* Resolving compilation checks where client hooks are nested inside layout page renderers.

## How to use it

### 1. RSC by Default
Always default to writing Server Components for top-level pages and structural block layouts. Only add the `"use client"` directive when the file strictly handles interactive states, DOM event listeners, or client-only hooks.

### 2. The Children Component Pattern
Avoid wrapping entire pages or block lists inside a monolithic `"use client"` shell component (like `StorefrontShell`). Instead, build and compile page layouts on the server, then pass them as pre-rendered `children` to the client-side context/shell wrapper:

```tsx
// app/store/[slug]/page.tsx (Server Component)
export default async function Page({ params }) {
  const data = await getStorefrontPage(params.slug);
  const { ctx, layout } = buildStorefrontContext(data, `/store/${params.slug}`);

  return (
    <StorefrontShell data={data} pagePath={`/store/${params.slug}`}>
      <ServerBlockRenderer data={data} pagePath={`/store/${params.slug}`} />
    </StorefrontShell>
  );
}
```

### 3. Share Callbacks via Client Context
Because Server Components cannot serialize and pass function parameters (like `onStartOrder` or `onOpenCart`) as props down to Client Components across the RSC boundary, wrap page children in a Client Context Provider inside the Client Shell:

```tsx
// Inside StorefrontShell.tsx (Client Component)
export const StorefrontClientContext = createContext<any>(null);

return (
  <StorefrontClientContext.Provider value={clientCallbacks}>
    {children}
  </StorefrontClientContext.Provider>
);
```

Hydrated client blocks can then merge these callbacks locally:

```tsx
// Inside an interactive client block (e.g., MenuGridBlock.tsx)
"use client";
import { useStorefrontClient } from "@/components/StorefrontShell";

export function MenuGridBlock({ config, ctx: serverCtx }) {
  const clientCtx = useStorefrontClient();
  const ctx = useMemo(() => ({ ...serverCtx, ...clientCtx }), [serverCtx, clientCtx]);
  // ...
}
```
