# AGENTS.md

> Canonical rules for **all** AI coding agents working on this repo (Claude Code / Antigravity, Cursor, Aider, Continue, Copilot, etc.).

**Also read**: [`CLAUDE.md`](./CLAUDE.md) for the full stack, conventions, and hybrid (Lovable + Antigravity) workflow.

---

## ⛔ CRITICAL — Database Rules

> [!CAUTION]
> **NEVER run `supabase db reset` or any command that destroys/wipes the local database.**
> The local Supabase database contains hand-seeded tenant data, users, themes, menu items, orders, and configuration that **cannot be recreated from migrations alone**. A reset will wipe all of it.

### If you need the database schema changed

1. **Write a new migration file** — `supabase/migrations/$(date -u +%Y%m%d%H%M%S)_description.sql`
2. **Apply it incrementally** — `supabase migration up`
3. **Never edit or delete existing migration files** — they are append-only

### If you absolutely must touch the data

1. **ALWAYS back up first**:
   ```bash
   # Full backup (all schemas + data) — THIS IS THE SAFE WAY
   docker exec -i supabase_db_nzqaddrrqqpvtyprpvjr \
     pg_dump -U postgres -d postgres -F c -b -v \
     > backups/Tabtake_backup_$(date +%Y%m%d_%H%M%S).dump
   ```

2. **Also copy to the canonical backup file**:
   ```bash
   cp backups/Tabtake_backup_*.dump backups/Tabtake.dump
   ```

3. **To restore** (data-only, into existing schema):
   ```bash
   # First disable FK checks
   docker exec -i supabase_db_nzqaddrrqqpvtyprpvjr \
     psql -U postgres -d postgres \
     -c "SET session_replication_role = 'replica';"

   # Restore only public + auth schemas
   docker exec -i supabase_db_nzqaddrrqqpvtyprpvjr \
     pg_restore -U supabase_admin -d postgres \
     --data-only --schema=public --schema=auth \
     --disable-triggers \
     < backups/Tabtake.dump

   # Re-enable FK checks
   docker exec -i supabase_db_nzqaddrrqqpvtyprpvjr \
     psql -U postgres -d postgres \
     -c "SET session_replication_role = 'origin';"
   ```

4. **After any restore, re-grant permissions**:
   ```bash
   docker exec -i supabase_db_nzqaddrrqqpvtyprpvjr \
     psql -U postgres -d postgres -c "
       GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon, service_role;
       GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;
       GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon, service_role;
       NOTIFY pgrst, 'reload schema';
     "
   ```

### Forbidden database commands

| ❌ NEVER run | Why |
|---|---|
| `supabase db reset` | Destroys all data — no undo |
| `DROP TABLE ...` | Use migrations to alter, not drop |
| `TRUNCATE ... CASCADE` | Cascades destroy related data |
| `DELETE FROM tenants` | Tenants have deep FK chains |
| Editing existing migration files | Breaks migration ordering |

---

## Pre-flight checklist

Before you write any code:

1. `git pull` — Lovable commits silently and often
2. Read [`CLAUDE.md`](./CLAUDE.md) — rules + conventions
3. Read the relevant `docs/*.md` spec for the feature you're touching
4. Read `docs/theme-development-guide.md` if touching theme code
5. **If touching Customer Loyalty & Rewards**: read
   [`docs/loyalty-rewards-plan.md`](./docs/loyalty-rewards-plan.md) (the architecture and
   ground-truth research), [`docs/loyalty-rewards-phase.md`](./docs/loyalty-rewards-phase.md)
   (what's actually built vs. still pending), and
   [`docs/loyalty-rewards-memory.md`](./docs/loyalty-rewards-memory.md) (gotchas and decisions
   made mid-build) before writing any code — this feature has real payment-integrity/race-
   condition surface (checkout is split across `place-order`/`confirm-order`) that isn't
   obvious from the schema alone.
6. **If touching i18n / locales / RTL / user-facing copy catalogs**: read
   [`docs/i18n/phase.md`](./docs/i18n/phase.md), [`docs/i18n/memory.md`](./docs/i18n/memory.md),
   and [`docs/i18n/leftovers-inventory.md`](./docs/i18n/leftovers-inventory.md). Ignore the
   obsolete stub [`docs/i18n-plan.md`](./docs/i18n-plan.md).
7. Check if there is any relatable/relevant skill in `.agents/skills/` and read its `SKILL.md` before proceeding

---

## Project quick reference

### Tech stack

- **Frontend**: React 18 + Vite 5 + TypeScript 5 + Tailwind CSS v3 + shadcn/ui
- **Backend**: Supabase (Postgres 17 + Auth + Storage + Edge Functions / Deno)
- **State**: @tanstack/react-query
- **Routing**: react-router-dom v6
- **Tests**: Vitest
- **Icons**: lucide-react only

### Key directories

```
src/pages/admin/        → Super Admin screens
src/pages/owner/        → Restaurant Owner screens
src/pages/store/        → Public storefront
src/components/ui/      → shadcn primitives (DO NOT modify)
src/hooks/              → Custom hooks
supabase/migrations/    → SQL migrations (APPEND-ONLY)
supabase/functions/     → Deno edge functions
docs/                   → Product specs + guides
backups/                → Database backups (Tabtake.dump)
```

### Common commands

```bash
yarn dev                 # Vite dev server
yarn build               # Production build
yarn test                # Vitest
supabase migration up    # Apply pending migrations (SAFE)
supabase functions serve # Run edge functions locally
```

### Local Supabase container

The DB container name is `supabase_db_nzqaddrrqqpvtyprpvjr` (port 54322).

```bash
# Run SQL against local DB
docker exec -i supabase_db_nzqaddrrqqpvtyprpvjr \
  psql -U postgres -d postgres -c "YOUR SQL HERE"
```

---

## Hard rules

1. **Never edit** `src/integrations/supabase/client.ts` or `types.ts` — auto-generated
2. **Never edit existing migration files** — append new ones only
3. **Never modify** `auth`, `storage`, `realtime`, `vault` schemas
4. **Never use raw colors** in components — use semantic tokens from `index.css`
5. **Never run `supabase db reset`** — back up and restore instead
6. **Never add** `package-lock.json` or `pnpm-lock.yaml`
7. **Always use** `import { supabase } from "@/integrations/supabase/client"`
8. **Always use** `has_role()`, `works_at_tenant()` for RLS — don't duplicate helpers
9. **Always add** `ENABLE ROW LEVEL SECURITY` + policies on new tables
10. **Always** `SET search_path = public` on `SECURITY DEFINER` functions
11. **Always use `lucide-react` icons only** across all components, pages, and themes (no third-party icon packages)
12. **Never use emojis as icons** in components/UI — always use SVG icons from `lucide-react`.
13. **Never use generic or AI-looking bright colors** — always use semantic design tokens or curated harmonious color palettes from `index.css`.
14. **Dev-Only Feature Gating**: Any incomplete or work-in-progress (WIP) feature, route, or tab (e.g. `Earnings & Payouts`) MUST be marked with `devOnly: true` or wrapped in dev-environment checks (`import.meta.env.DEV`). In development mode, it MUST render an inline colored status dot badge (`amber` for pending/WIP). In production mode (`import.meta.env.PROD`), WIP features MUST be hidden from live users.
15. **Codebase Navigation & Token Optimization Protocol**: AI agents MUST strictly follow the canonical **Codebase Memory Protocol** section in `AGENTS.md` below. Always prefer `codebase-memory-mcp` tools (`get_architecture`, `search_graph`, `trace_path`, `get_code_snippet`) over listing directories, recursive folder browsing, or raw file grepping.
16. **Full-Width Responsive Layout Invariants & Desktop Breakpoints**: Every dashboard screen, table, metric grid, settings form, modal, and storefront layout MUST be fully responsive and adapt seamlessly across all standard display tiers. Components and styles MUST explicitly account for:
    - **Mobile**: `< 640px` (single column, full-width touch targets, collapsible sheets/drawers)
    - **Tablet**: `sm:` (`640px`) & `md:` (`768px`) (2-column grids, optimized paddings)
    - **Laptop / Small Desktop**: `lg:` (`1024px`) (3-column grids, sidebar layouts)
    - **Desktop (`@media (min-width: 1280px)` / `xl:`)**: Clean desktop hierarchy and balanced column widths
    - **Large Desktop (`@media (min-width: 1536px)` / `2xl:`)**: Expanded grid columns, higher density tables, and proportional card structures
    - **QHD / Large Screens (`@media (min-width: 1920px)` / `3xl:`)**: All dashboard pages, tables, metric cards, and forms MUST use 100% full width (`w-full`) without leaving blank empty space on the right. Single forms must be structured into a 2-Column Split Layout (`grid grid-cols-1 lg:grid-cols-3 gap-8 w-full`) with an informational context card on the left (`lg:col-span-1`) and form inputs on the right (`lg:col-span-2`), eliminating empty whitespace voids while keeping inputs appropriately sized. Storefront modals and cards must maintain proportional maximum constraints without bloated dead space.
17. **Scroll Isolation**: Outer layout containers MUST maintain `overflow-hidden` with `h-full w-full` so that scrolling occurs exclusively within the dedicated inner content panel, preventing double scrollbars or root `html` window scrolling.
18. **Persistent UI & Session State Management with Zustand**: Whenever managing persistent UI state, cross-tab sessions, active wizard step tracking, or multi-page status anywhere in the application (such as Store Setup Wizard sessions, active step tracking, or multi-tab setup flows), AI agents MUST prioritize using **Zustand** stores (with `persist` middleware where state needs to survive page refreshes or route navigation). This guarantees that status indicators, banners, and wizard progress remain active and consistent across tab switches, sub-route navigations, and page reloads.
19. **Never Use Native Browser Popups**: AI agents MUST NEVER use native browser alert or confirmation dialogs (`window.confirm()`, `window.alert()`, `window.prompt()`). Always use **shadcn/ui** components (`AlertDialog`, `Dialog`, `toast` from `sonner`) for styled, accessible confirmation modals and alerts across all UI surfaces.
20. **Errors Must Be Meaningful**: Never surface a generic/framework error string to the user when the real cause is known. In particular, `supabase.functions.invoke()`'s `error.message` is USELESS on a non-2xx response — `FunctionsHttpError` hardcodes it to the literal string `"Edge Function returned a non-2xx status code"` regardless of what JSON body the function actually returned. The real message lives in `error.context` (the raw `Response`) and must be read explicitly — use `getEdgeFunctionErrorMessage()` from `src/lib/edgeFunctionError.ts` at every call site that handles an edge function's error, rather than `res.error?.message` directly. This applies generally: every user-facing error (toast, inline form error, banner) must state the actual, specific reason, not a generic fallback — write edge functions to return a clear `{ error: "..." }` body, and read it all the way through to the UI.
21. **Multi-Agent & Specialized Team Collaboration Workflow**: When a complex, multi-faceted, or heavy feature request (or optimization task) is received or suggested, AI agents MUST organize work as a **Specialized Multi-Agent Team** (e.g. Team Lead / Architect, Senior Developer, UI/UX Specialist, QA Tester) — but **MUST** run specialized roles **one at a time**. **NEVER** parallel sibling agents unless the user explicitly asks (see hard rule 22).
22. **Optimize CPU (STRICT — non-negotiable)**: **MUST** keep CPU load low. **NEVER** parallel background agents unless the user explicitly asks. **NEVER** run both codebase-memory and project-mind (or duplicate MCP indexers) on the same repo. **NEVER** concurrent `tsc`/build/yarn across apps. **NEVER** full-repo recursive scans/greps when graph/snippet tools exist. **MUST** pick one discovery path; **MUST** skip verify typechecks unless the user asks or the change is high-risk. **MUST** stop heavy work if CPU is pegged. Canonical: [`.cursor/rules/cpu-optimize.mdc`](../.cursor/rules/cpu-optimize.mdc) / [`.claude/rules/cpu-optimize.md`](../.claude/rules/cpu-optimize.md).

---

## Theme development

> [!IMPORTANT]
> **Before writing ANY theme code, you MUST first read [`docs/theme-development-guide.md`](./docs/theme-development-guide.md).**
> The theme system has a specific architecture (manifest registry, section definitions, brand tokens, data adapters) and all themes must follow the standardized pattern documented there. Writing theme code without reading this guide will result in code that doesn't integrate with the Builder UI or storefront.

The guide covers:

- How the theme registry works (manifest system)
- How to create block themes vs bespoke themes (with step-by-step checklist)
- Section definitions and editable field types (`text`, `image`, `color`, `toggle`, `list`, `footer-builder`, etc.)
- Multi-page support (page-aware section filtering)
- Brand token system (`brand.ts` → CSS custom properties)
- Data adapter pattern (Tabtake data → theme-specific shapes)
- Connected component pattern (live data bridge with shared basket)
- CSS scoping strategy

---

## Additional Session Rules & Architecture Learnings

22. **Rich Text & Storefront HTML Rendering**:
    - `RichTextEditor` components MUST trigger input handlers on all user interaction events (`onInput`, `onKeyUp`, `onMouseUp`, `onBlur`, `onPaste`, `onCut`) to guarantee instant live preview synchronization.
    - Any storefront component rendering HTML via `dangerouslySetInnerHTML` MUST be wrapped in `.rich-text-content` or `.prose` containers (with rules defined in `src/index.css` and `storefront-next/src/app/globals.css`) so that `b`, `strong`, `i`, `em`, `u`, `ul`, `ol`, and `<p>` maintain proper font weights (`700`), italic styles, list bullets, and margins.

23. **Admin & Owner Navigation Route Scoping**:
    - Every route item in `AdminLayout.tsx` MUST belong to a path prefix matching its section key (e.g. `/owner/billing/*` for Billing items, `/owner/setup/theme` for Storefront).
    - Sub-routes (like `/owner/theme/builder`) MUST be registered in `isTabActive()` under their corresponding parent item (`/owner/setup/theme`) to prevent sidebar item and top header tab mismatches.

24. **Multi-Location & Branch Architecture Invariants**:
    - Every branch is represented as a `public.locations` row under a unified `tenant_id`. Operational data (`orders`, `staff_members`, `print_printers`, `delivery_zones`, `opening_hours`, `tenant_service_configs_location_overrides`, `tenant_payment_methods_location_overrides`) is scoped per `location_id`.
    - Menu categories and menu items use `location_id IS NULL` for shared tenant-wide defaults, and `location_id = 'loc-uuid'` for branch overrides. Branch menus fall back seamlessly to shared defaults when no local override exists.
    - Cross-branch syncing is strictly **MANUAL ON-DEMAND** (explicit owner action, never automatic). Edits made at Branch A or Tenant Default NEVER automatically mutate or overwrite Branch B unless the owner explicitly executes a sync RPC (`sync_location_menu`, `sync_location_opening_hours`, `sync_location_service_config`, `sync_location_payment_methods`) for the desired items/categories/settings.

---

## When in doubt

- Read the relevant `docs/*.md` spec before changing a feature
- If about to violate any rule above — **stop and ask the user**
- Prefer small, incremental changes over large refactors
- **Back up the database before any risky operation**

---

_Last updated: 2026-08-17_

