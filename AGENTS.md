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
   and [`docs/i18n/leftovers-inventory.md`](./docs/i18n/leftovers-inventory.md).
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
21. **Multi-Agent & Specialized Team Collaboration Workflow**: When a complex, multi-faceted, or heavy feature request (or optimization task) is received or suggested, AI agents MUST organize work as a **Specialized Multi-Agent Team** (e.g. Team Lead / Architect, Senior Developer, UI/UX Specialist, QA Tester) — but **MUST** run specialized roles **one at a time**. **NEVER** parallel sibling agents unless the user explicitly asks (see hard rule 23).
22. **Save/Update Buttons Must Be Dirty-Gated, and Destructive Ones Confirmed**: Any Save/Update button tied to an editable form (settings card, per-row config, dialog) MUST only render when the live form state actually differs from the last-loaded/saved value — never render it unconditionally and only toggle `disabled`. Compare current field state against the originally-fetched value (react-query result, prop, or a snapshot captured in a ref/state when data loads) to compute a `hasChanges` boolean, and wrap the button in `{hasChanges && (...)}`. On successful save, show a single confirmation via `toast.success(...)` from `sonner` (never a duplicate shadcn `useToast()` call alongside it — pick one). If the action being saved/triggered is destructive or hard to reverse (delete, force-disable, remove domain, revert override), pair it with a confirmation step using shadcn's `AlertDialog`/`Dialog` (per rule 19 — never `window.confirm()`), not just the dirty-gated Save button alone. See `src/components/admin/TenantModulesCard.tsx` and `src/pages/owner/setup/Delivery.tsx` for the reference implementation of the dirty-check pattern.
23. **Optimize CPU (STRICT — non-negotiable)**: **MUST** keep CPU load low. **NEVER** parallel background agents unless the user explicitly asks. **NEVER** run both codebase-memory and project-mind (or duplicate MCP indexers) on the same repo. **NEVER** concurrent `tsc`/build/yarn across apps. **NEVER** full-repo recursive scans/greps when graph/snippet tools exist. **MUST** pick one discovery path; **MUST** skip verify typechecks unless the user asks or the change is high-risk. **MUST** stop heavy work if CPU is pegged. Canonical: [`.cursor/rules/cpu-optimize.mdc`](./.cursor/rules/cpu-optimize.mdc) / [`.claude/rules/cpu-optimize.md`](./.claude/rules/cpu-optimize.md).
24. **Async Button Safety (ALWAYS READ before touching a button that does async work)**: Every button triggering an async action (network call, Supabase call, form submit) **MUST** show a loading indicator, be `disabled` while in flight, and guard against a second click firing before React re-renders (a plain `loading` state alone isn't enough, use a `useRef` re-entrancy guard). **MUST NOT** hand-roll this per call site. Each app has **its own** hook. **NEVER** import one app's hook into another: root app prefers `useMutation`'s `isPending` (fall back to `src/hooks/useAsyncAction.ts` for non-mutation one-offs), `storefront-next` uses `storefront-next/src/hooks/useAsyncAction.ts`, `landing-page` uses `landing-page/src/hooks/useAsyncAction.ts`. Canonical: [`.cursor/rules/async-button-safety.mdc`](./.cursor/rules/async-button-safety.mdc) / [`.claude/rules/async-button-safety.md`](./.claude/rules/async-button-safety.md).
25. **Commit messages start with a Jira key (STRICT)**: every commit message (yours, or one written by Cursor, Antigravity, Copilot or Claude Code) starts with `KAN-<number>: `, for example `KAN-396: fix logo size on Native receipts`. Take the key from the user, else the branch name, else the most recent commit on this branch that has one; if none, ask. Never invent a key or write `KAN-XXXX`. Commits without a key are refused by `.githooks/commit-msg` and pushes by `.githooks/pre-push` (turned on by `bun install`). If `git config core.hooksPath` is not `.githooks` on this machine, run `bash .githooks/ensure-hooks.sh` before committing and tell the developer. Canonical: [`.cursor/rules/commit-messages.mdc`](./.cursor/rules/commit-messages.mdc) / [`.claude/rules/commit-messages.md`](./.claude/rules/commit-messages.md).
26. **Friendly errors only (STRICT)**: no person (guest, owner, reseller, super admin, landing-page visitor) ever sees a raw error code, "CODE: detail" string, database error or "non-2xx" text. Every shown error goes through that app's helper: `storefront-next/src/lib/guestErrorMessage.ts`, `src/lib/friendlyError.ts`, `landing-page/src/lib/friendlyError.ts`. New server codes get a sentence in the same change. Canonical: [`.claude/skills/friendly-errors/SKILL.md`](./.claude/skills/friendly-errors/SKILL.md).
27. **Keep the platform update pages current (STRICT)**: every change people will notice, or that changes how something works, also updates `src/lib/platformUpdates.ts` in the same piece of work: What's new (`/platform/whats-new`, with a heads-up for anything that changes behaviour for people, old terminal apps or the mobile app), Releases (`/platform/release`, ticket, date and where it is: local, GitHub, staging, live) and Status (`/platform/status`, working, in progress, needs action or not started). New services or APIs worth watching go on Health (`/platform/health`). Plain words, only what was checked. Canonical: [`.claude/rules/platform-updates.md`](./.claude/rules/platform-updates.md).
28. **API work uses the `api-design` skill (STRICT)**: if you add, change, document or consume ANY API, edge function route, RPC, PostgREST query, JSON response or react-query fetch (Dine-In, order taking, webhooks included), read and follow `.claude/skills/api-design/SKILL.md` first. Fewest calls, one API per job: search what exists, extend before adding, return related data together in one response, never add an endpoint just because another component needs the same data. Keep the api-v1 envelope, snake_case keys, integer minor-unit money, ISO 8601 dates, stable error codes, idempotency for money and stock, and additive-only changes so old terminals keep working. Update `openapi.ts` and the docs, and measure calls before and after (or write NOT MEASURED). Mirrored: root `CLAUDE.md` skills index.
29. **Jira status follows where the code is (STRICT)**: a ticket you START working on moves to **In Progress** first (only what is being worked on now). A finished ticket goes to **Ready for testing** only when every `KAN-<n>:` commit for it is merged into `deploy/staging` (`git fetch`, then `git merge-base --is-ancestor <sha> origin/deploy/staging`). Otherwise it goes to **Dev done** (the Jira transition named "In Review" lands in Dev done). QA only tests what is on staging. Unfinished work stays In Progress. Canonical: [`.claude/rules/jira-status.md`](./.claude/rules/jira-status.md); mirrored in root `CLAUDE.md` §4 rule 15.

---

## Codebase Memory Protocol (REQUIRED)

### 1. Architecture First (MANDATORY)
Before opening any files:
- `get_architecture()`
- `search_graph()`

Understand project architecture, feature boundaries, components, services, API layers, and shared utilities. Never start by listing directories or recursively reading files.

---

### 2. Symbol Discovery
Locate functions, classes, hooks, components, interfaces, types, and services using:
- `search_graph(name_pattern="...")`

DO NOT use `grep`, `find`, or recursive file browsing unless searching for string literals.

---

### 3. Call Graph Analysis
Before modifying existing logic, determine impact using:
- `trace_path(function_name="...", direction="inbound")`
- `trace_path(function_name="...", direction="outbound")`

Identify callers, dependencies, execution flow, and affected modules. Never guess call relationships.

---

### 4. Read Minimal Code
Prefer `get_code_snippet(qualified_name="...")`. Read only the required function or component. Avoid opening entire files when only one symbol is needed.

---

### 5. Read Files Only When Necessary
Use `view_file` only for configuration, CSS, SQL migrations, environment files, documentation, generated code, or build scripts. Never open large source files before checking the graph.

---

### 6. Grep Usage
`grep_search` is ONLY allowed for string literals, CSS classes, translation keys, environment variables, TODO/FIXME, SQL, or configuration values. Never use grep to locate functions or components.

---

### 7. Before Editing
Always determine:
✓ Who calls this?
✓ What depends on it?
✓ Is it exported?
✓ Will this change break other modules?

Use `trace_path()` before editing.

---

### 8. Token Optimization Rules
Prefer chain: `search_graph` → `trace_path` → `get_code_snippet` → `view_file`. Never reverse this order.

---

### 9. Refactoring Workflow
1. `search_graph()`
2. `trace_path(inbound)`
3. `trace_path(outbound)`
4. `get_code_snippet()`
5. Modify
6. Verify affected callers

---

### 10. Debugging Workflow
Follow execution path: UI → Component → Hook → Service → API → Backend using `trace_path()` whenever possible.

---

### 11. Large Repository Rule
For repositories larger than 100 files, NEVER recursively inspect folders. Always begin with `get_architecture()` and `search_graph()`.

---

### 12. Output Expectations
Understand architecture, ownership, dependencies, and execution path before writing code. Guessing is prohibited when graph data is available.

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

## When in doubt

- Read the relevant `docs/*.md` spec before changing a feature
- If about to violate any rule above — **stop and ask the user**
- Prefer small, incremental changes over large refactors
- **Back up the database before any risky operation**

---

_Last updated: 2026-08-07_


## Working with the other AI tool (Claude Code and Antigravity share this repo)

Both tools keep a shared local hand-off at `.ai-bridge/HANDOFF.md` (not in git). **At the start of a
session read it. Before editing, add a "WORKING ON" line. At the end add a short entry** (what changed,
what is uncommitted, open decisions). To ask the other tool something: Claude Code runs
`agy -p "question" --mode plan`, Antigravity runs `claude -p "question"`.

### Delegate low-risk work to Antigravity (spend its tokens, not only Claude's)

Antigravity (`agy`) has its own token budget. Use it so Claude's tokens go to the hard parts.

- **Give to agy (low risk):** read-only research and code search, summaries, drafting docs and Jira text, translations (en/ar/de strings), writing or extending tests, small mechanical edits (renames, copy changes, adding a field to a list), and a **second review** of finished work.
- **Keep in Claude (high risk):** migrations, RLS and auth, edge function logic that changes live checkout or payments, anything touching secrets, and the final decision on every finding.
- **How:** `agy -p "<self-contained task, with file paths and acceptance criteria>" --mode plan` for read-only work and reviews. Use `--mode accept-edits` only for small, named files, and say which files it may touch. Never use `--dangerously-skip-permissions`.
- **Reviews:** after Claude's own security and devil's advocate reviews, ask agy for one more independent review of the changed files. Give it the goal, acceptance criteria and changed files, never Claude's conclusions. Verify any finding against the code before acting on it.
- **One at a time:** run a single agy call at a time (CPU rule). Do not run it in parallel with Claude subagents.
- **Always check the output:** agy's result is untrusted until Claude has read the diff and run the checks. Record in the hand-off file what agy did.
- **Never send** secrets, `.env` values, API keys or customer data to agy.
