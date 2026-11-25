# CLAUDE.md — Project Context for Claude Code (Antigravity)

> This file is the canonical context for AI coding agents (Claude Code in Antigravity, Cursor, etc.) working on this repo **outside of Lovable**. Lovable.dev co-edits this same repo via GitHub two-way sync, so anything you do here must stay compatible with Lovable's conventions.
>
> **This file covers the root Vite app only.** This repository actually contains three separate frontend apps — see §1a below before assuming a rule here applies everywhere.

---

## 1. What this project is

**Tabtake** — a multi-tenant restaurant SaaS with a Theme Engine and Marketplace. Built originally on [Lovable.dev](https://lovable.dev) and synced to GitHub for hybrid development.

Four user surfaces, one design system:
- **Super Admin** — platform operators (`/admin/*`)
- **Reseller Admin** — manages a portfolio of tenants
- **Restaurant Owner** — manages a single tenant (`/owner/*`)
- **Customer** — public storefront / marketplace (`/`, `/marketplace`) — **note:** the live customer ordering flow does not run in this app anymore; see §1a.

Key modules:
- **Tenant Management** — see `docs/tenant-management-requirements.md`
- **Theme Engine** — see `docs/theme-engine-plan.md` (5 runtime layers, 28 tables, 6 batches A–F all shipped)
- **Marketplace** — theme submissions, purchases (currently mocked Stripe), revenue splits, health checks

---

## 1a. This repo is three separate apps, not one

Discovered and documented during a full-app review on 2026-08-12. This is easy to miss because all three live in the same git repository, but they are independent frontends with independent dependencies:

| App | Root | Port (dev) | Stack | What it is |
|---|---|---|---|---|
| **This app** | `src/` (repo root) | 8080 | Vite + React 18 | Super Admin, Reseller Admin, Restaurant Owner surfaces. The business/back-office side of the product. |
| **Marketing site** | `landing-page/` | 3000 | Next.js 16 + React 19 | The public marketing website (tabtake.com). Own design system at `landing-page/UI.md`, own `AGENTS.md`/`CLAUDE.md`. |
| **Customer storefront** | `storefront-next/` | 3001 | Next.js 16 + React 19 | The **real, live** customer ordering app: browsing, cart, checkout (Stripe/PayPal/Square/cash), customer login, order tracking, QR table ordering, embeddable widget. Own `AGENTS.md`/`CLAUDE.md`. |

This root app's own storefront code under `src/pages/`/`src/components/storefront/` is legacy — `src/App.tsx` redirects `/store/*`, `/t/:token`, `/track/*`, and `/widget/:slug` straight to `storefront-next` on port 3001. **Do not add or fix customer-ordering features in this app's storefront components; they are not what customers see.** Work in `storefront-next/` instead, and read its own `AGENTS.md`/`CLAUDE.md`/`README.md` first — its conventions differ from this file (Next.js App Router, not Vite/react-router; its own Supabase client setup).

Likewise, anything about the public marketing pages (homepage, pricing preview, contact form, tabtake.com in general) belongs in `landing-page/`, governed by its own `landing-page/UI.md`, not this file's design-system section (§5).

All three apps share one Supabase project (see `supabase/` at the repo root) but each has its own `package.json` and lockfile discipline — see §7.

**Rule 34 in §4 ("Forbidden: Next.js") applies to this root app only.** `landing-page/` and `storefront-next/` are intentionally Next.js and that is correct for them; do not "fix" that.

---

## 2. Tech stack (do not change without discussion)

- **Frontend**: React 18 + Vite 5 + TypeScript 5 + Tailwind CSS v3 + shadcn/ui (Radix primitives)
- **Routing**: react-router-dom
- **Data**: @tanstack/react-query
- **DnD**: @dnd-kit
- **Backend**: Supabase (Postgres + Auth + Storage + Edge Functions in Deno) — managed via "Lovable Cloud" but it is a real Supabase project
- **Tests**: Vitest (frontend), Deno tests (edge functions)
- **Deploy**: self-host via `deploy/` (docker-compose, host nginx → edge-nginx → kong → supabase stack). See `.lovable/plan.md`.

**Forbidden in this app specifically**: Next.js, Vue, Svelte, Angular, server-side React frameworks, alternative ORMs (no Prisma/Drizzle), alternative auth (no Clerk/Auth0). The Lovable agent will revert these. (`landing-page/` and `storefront-next/` are Next.js by design — see §1a.)

---

## 3. Repo layout

```
src/
  pages/
    admin/         # Super Admin screens
    owner/         # Restaurant Owner screens
    *.tsx          # Public + auth pages (storefront pages here are legacy — see §1a)
  components/
    ui/            # shadcn primitives — DO NOT modify casually
    *.tsx          # App-specific components
  hooks/
  integrations/supabase/
    client.ts      # AUTO-GENERATED — never edit
    types.ts       # AUTO-GENERATED from DB schema — never edit. As of 2026-08-12 this is
                    # stale (missing plans/currencies/feature_catalog/plan_versions/
                    # plan_version_prices and more) — a large share of the app works
                    # around this with `(supabase as any)`. Regenerating this file is a
                    # standing to-do, not a sign the pattern is intentional.
  index.css        # design tokens (HSL CSS vars)
landing-page/       # SEPARATE Next.js app — public marketing site. See §1a. Own UI.md/AGENTS.md.
storefront-next/    # SEPARATE Next.js app — real live customer ordering flow. See §1a. Own AGENTS.md.
supabase/
  config.toml      # function settings; project_id is auto-managed
  migrations/      # timestamped SQL — append-only, never edit existing files
  functions/<name>/index.ts   # Deno edge functions (auto-deployed by Lovable) — shared by all three apps
docs/              # product specs (tenant-management, theme-engine plan)
deploy/            # self-host docker stack
mem://             # Lovable agent memory (visible as files; safe to read, edit cautiously)
.lovable/plan.md   # current architectural plan
CLAUDE.md          # this file — covers src/ (this app) only
```

---

## 4. Hard rules (Lovable will fight you on these)

1. **Never edit** `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `.env`. They are regenerated.
2. **Never edit existing files in** `supabase/migrations/`. To change schema, add a new timestamped migration file: `YYYYMMDDHHMMSS_short_description.sql`.
3. **Never modify** the `auth`, `storage`, `realtime`, `supabase_functions`, `vault` schemas.
4. **Roles**: stored in `public.user_roles` with the `app_role` enum + `has_role(uuid, app_role)` SECURITY DEFINER function. **Never** put a `role` column on `profiles`/`users` — that is a privilege-escalation footgun. RLS policies must use `has_role(auth.uid(), 'admin')`.
5. **RLS**: every new table needs `ENABLE ROW LEVEL SECURITY` + explicit policies. Use the existing helpers: `has_role`, `works_at_tenant`, `is_reseller_admin_of`, `tenant_descendants`. Don't duplicate them.
6. **SECURITY DEFINER functions** must `SET search_path = public` and only be `EXECUTE`-grantable to roles that need them. See migration `20260508093207_*.sql` for the hardening pattern.
7. **Design tokens**: NEVER write raw colors in components (`bg-white`, `text-black`, hex codes). Always use semantic tokens defined in `src/index.css` and `tailwind.config.ts`. All colors are HSL. (A 2026-08-12 review found roughly 40+ raw-color violations across the owner surface and 18+ across billing — this rule is not currently being followed consistently; don't add more.)
8. **Supabase client import**: always `import { supabase } from "@/integrations/supabase/client"`. Don't create a new client.
9. **Auth**: never enable anonymous sign-ups. Standard email + Google OAuth only.
10. **AI features**: prefer Lovable AI Gateway (no API key needed) — calls go through the `lovable-ai` pattern. Don't add OpenAI/Anthropic SDKs unless the user explicitly asks.
11. **Optimize CPU (STRICT — non-negotiable)**: **MUST** keep CPU load low. **NEVER** parallel background agents unless the user explicitly asks. **NEVER** dual-run codebase-memory + project-mind (or duplicate MCP indexers). **NEVER** concurrent multi-app `tsc`/build/yarn. **NEVER** full-repo recursive scans when graph/snippet tools exist. **MUST** skip verify typechecks unless the user asks or the change is high-risk. **MUST** stop if CPU is pegged. Full rule: `AGENTS.md` hard rule 23 + [`.claude/rules/cpu-optimize.md`](./.claude/rules/cpu-optimize.md).
12. **Async Button Safety (ALWAYS READ before touching a button that does async work)**: Every button triggering an async action MUST show a loading indicator, be `disabled` while in flight, and guard against a second click firing before React re-renders (a `useRef` re-entrancy guard, not just `loading` state). Each of the three apps (§1a) has its **own** hook for this; never import one app's hook into another. Root app: prefer `useMutation`'s `isPending` (§8), fall back to `src/hooks/useAsyncAction.ts` for non-mutation one-offs. Full rule: `AGENTS.md` hard rule 24 + [`.claude/rules/async-button-safety.md`](./.claude/rules/async-button-safety.md).
13. **Commit messages start with a Jira key**: `KAN-<number>: summary`. Key from the user, else the branch name, else the last commit with one; otherwise ask. Hooks refuse commits and pushes without it. **Hooks not set up on this machine?** Check `git config core.hooksPath`; if it is not `.githooks`, run `bash .githooks/ensure-hooks.sh` yourself (no need to ask) before committing, and tell the developer it was turned on. Claude Code also runs it automatically at session start (`.claude/settings.json`) and `bun install` runs it too. Full rule: `AGENTS.md` hard rule 25 + [`.claude/rules/commit-messages.md`](./.claude/rules/commit-messages.md).
14. **Keep the platform update pages current**: every change people will notice also updates `src/lib/platformUpdates.ts` (What's new, Releases, Status at `/platform/whats-new`, `/platform/release`, `/platform/status`; live checks at `/platform/health`). Any change in behaviour for people, old terminal apps or the mobile app gets a heads-up line there and is told to the user. Dev mode only (`src/lib/devMode.ts`); owner, manager, reseller and super admin can view. Full rule: `AGENTS.md` hard rule 27 + [`.claude/rules/platform-updates.md`](./.claude/rules/platform-updates.md).

15. **Jira status follows where the code is (STRICT)**: when you START work on a ticket, move it to **In Progress** first (only the tickets actually being worked on now). When work on a ticket is finished, move it to **Ready for testing** only if ALL its commits are already merged into `deploy/staging` (check with `git fetch` then `git merge-base --is-ancestor <sha> origin/deploy/staging` for each `KAN-<n>:` commit). If any commit is not on `deploy/staging` yet, move it to **Dev done** instead (in this Jira workflow the transition named "In Review" lands in the Dev done status). Never put a ticket in Ready for testing for code QA cannot reach. Unfinished work stays In Progress. Full rule: `AGENTS.md` hard rule 29 + [`.claude/rules/jira-status.md`](./.claude/rules/jira-status.md).
---

## 5. Design system (warm-corporate)

Defined in `src/index.css` + `tailwind.config.ts`. Inspired by Stripe / Linear / Ramp — calm, dense, restrained. **This section covers the root app (`src/`) only** — `landing-page/` follows its own dark/orange system in `landing-page/UI.md`, and `storefront-next/` has its own theming layer.

- Background: bone `hsl(38 33% 95%)`
- Primary: violet `hsl(247 60% 60%)`
- Cards: pure white with subtle warm borders
- Font: Geist
- Tabular numbers (`font-variant-numeric: tabular-nums`) on all financial values
- Density toggle: `.dense` class on root
- All four surfaces share one design language; only accent + density change.

**Forbidden**: generic SaaS gradients, playful illustrations, non-semantic colors, serif fonts (except where explicitly approved).

See `mem://design/system.md` for the full palette + token reference.

---

## 6. Database & migrations workflow (hybrid)

When working in **Antigravity / Claude Code**:

1. Write the migration file by hand: `supabase/migrations/$(date -u +%Y%m%d%H%M%S)_description.sql`.
2. Apply it locally if you have the Supabase CLI: `supabase db push` against your local stack (see `deploy/`).
3. Commit + push to GitHub.
4. **In Lovable**: open the project — Lovable will detect the new migration and prompt the user to apply it to the cloud DB. **Lovable does not auto-apply migrations from GitHub pushes.** The user must trigger it from the Lovable UI.
5. After it's applied, `src/integrations/supabase/types.ts` regenerates automatically and syncs back to GitHub.

When working in **Lovable**: the agent uses an internal `supabase--migration` tool that does steps 1+2+4 in one shot. Just ask it.

**Edge functions**: anything in `supabase/functions/<name>/index.ts` auto-deploys when Lovable sees the change. From Antigravity, push to GitHub → in Lovable, the deploy is automatic on next sync. These functions are the shared API boundary for `landing-page/` and `storefront-next/` too, not just this app.

---

## 7. Hybrid workflow — do this to avoid conflicts

```text
┌───────────────┐  push    ┌─────────┐   sync   ┌─────────┐
│  Claude Code  │ ───────▶ │ GitHub  │ ◀──────▶ │ Lovable │
│ (Antigravity) │ ◀─────── │  main   │          │  agent  │
└───────────────┘  pull    └─────────┘          └─────────┘
```

**Golden rules:**
1. **Always pull before starting a session in either tool.** Lovable commits frequently and silently.
2. **Pick one tool per task.** Don't have Antigravity and Lovable editing the same files in the same hour. Merge conflicts on auto-generated files (`types.ts`, `package-lock.json`) are painful.
3. **Branching**: Lovable now has experimental branch support (Account Settings → Labs). For risky multi-file work in Antigravity, create a branch, push, then have Lovable review/merge via PR.
4. **Lockfiles**: this root app uses **bun**. If you don't have bun, install it (`curl -fsSL https://bun.sh/install | bash`). Don't introduce `package-lock.json` or `pnpm-lock.yaml`. Note: `landing-page/` and `storefront-next/` currently use `yarn.lock` each — that's their own convention, don't try to unify it with bun. As of 2026-08-12, this root app's repo root had both `bun.lock` and a recently-touched `yarn.lock` present at once, which shouldn't happen — if you see both again, figure out which one is actually being used before installing anything.
5. **Generated files** — if `types.ts` conflicts, take Lovable's version (it's regenerated from the live DB).
6. **Secrets**: never commit `.env`. Lovable manages cloud secrets via its UI. For local dev, copy `deploy/.env.example` → `deploy/.env`.

---

## 8. Conventions for new code

- **Components**: small and focused. New page → `src/pages/<area>/<Name>.tsx`. Register the route in `src/App.tsx`. If it's an admin page, add a sidebar entry in `src/components/AdminLayout.tsx`. Note: a 2026-08-12 review found several existing files that badly violate "small and focused" (`MenuEditor.tsx` ~221KB/4,200+ lines, `OwnerThemeBuilder.tsx` ~125KB, admin `ThemeBuilder.tsx` ~116KB) — don't treat these as precedent for new code, and prefer decomposing them further rather than growing them more.
- **Forms**: `react-hook-form` + `zod` + shadcn `<Form />`. (Some existing settings screens use plain `useState` instead — that's a known gap, not the pattern to copy.)
- **Toasts**: `sonner` via `import { toast } from "sonner"`.
- **Dates**: `date-fns`.
- **Icons**: `lucide-react` only.
- **Async data**: `useQuery` / `useMutation` from `@tanstack/react-query`. Don't fetch in `useEffect`. (A few existing files still do this — e.g. `PlatformStripeFallbackCard.tsx`, parts of `TenantsList.tsx`/`ApplicationsList.tsx` — known gaps, not precedent.)
- **Error boundaries**: keep network failures graceful — toast + retry, don't crash. In particular, don't swallow errors in an empty `catch {}` with no toast — a 2026-08-12 review found this in the owner Kitchen Display's ticket-advance action, which leaves kitchen staff with no signal a bump failed.
- **Audit logs**: every destructive or moderation action in an edge function must `INSERT INTO public.audit_logs` with the actor + target + action. Prefer routing destructive admin actions (suspend/archive/delete) through an edge function rather than direct client-side table writes, so this is enforced consistently.
- **Tests**: not required for every change, but if you add one, mirror the path (`src/foo.tsx` → `src/foo.test.tsx`). Run with `bun run test`.

---

## 9. Common commands

```bash
bun install              # install deps (root app)
bun run dev              # runs all three apps together: this Vite app + landing-page + storefront-next
bun run dev:admin        # vite dev server only (this app, port 8080)
bun run dev:landing      # landing-page only (port 3000)
bun run dev:storefront   # storefront-next only (port 3001)
bun run build             # production build (all three)
bun run lint              # eslint
bun run test              # vitest
bun add <pkg>              # add a dependency (DO NOT use npm/yarn/pnpm) — this app only

# self-host stack
cd deploy && make up && make migrate && make seed-admin
```

---

## 10. Where to find product context

- **Theme Engine plan + spec** → `docs/theme-engine-plan.md`
- **Tenant Management spec** → `docs/tenant-management-requirements.md`
- **Tenant coverage matrix** → `docs/tenant-management-coverage.md`
- **Self-host architecture** → `.lovable/plan.md`
- **Lovable's project memory** → `mem://index.md` (start here, it links the rest)
- **Marketing site design system** → `landing-page/UI.md`
- **Customer storefront scope** → `storefront-next/README.md`
- **i18n (EN/AR + RTL across all three apps)** → `docs/i18n/phase.md` + `docs/i18n/memory.md` (+ `docs/i18n/leftovers-inventory.md` for leftovers).
- **Full-app review notes (2026-08-12)** → root `README.md`'s "Known issues" section has the highlights; ask the project owner for the full review document if you need the complete list with file/line references.
- **Security posture & accepted risks** → ask the user to share their security memory; it's not in the repo.

---

## 11. When in doubt

- Read `mem://index.md` and any linked memory files **before** changing design or making architectural decisions.
- Read the relevant `docs/*.md` spec **before** changing a feature.
- Confirm which of the three apps (§1a) you're actually supposed to be working in before writing code — "the storefront" and "the website" are two different apps, neither of which is this one's own storefront components.
- If you're about to do something that violates rules in §4 — stop and ask the user.
- Prefer small PRs. Lovable users iterate fast; large refactors from Antigravity are hard to review.

---

_Last updated: 2026-08-12 (added §1a on the three-app structure and known-issue notes from that day's full-app review; previously updated 2026-05-08). Keep this file current — both Claude Code and Lovable read it._
# Project Rules (Supabase + React + Next.js)

These rules apply to every task. Detailed procedures live in `.claude/skills/`.

## Stack
- Backend: Supabase (Postgres, Auth, Storage, Edge Functions, RLS)
- Frontend: React + Next.js (App Router, TypeScript strict)

## Mandatory workflow for EVERY task
Load and follow the `task-workflow` skill. In short:

1. **Understand** - restate the goal, assumptions, and acceptance criteria. Ask only if a wrong guess would be costly or irreversible.
2. **Decompose** - break the task into small subtasks (each independently verifiable, ideally under ~50 changed lines or one concern). Write them as a task list before coding.
3. **Execute one subtask at a time** - after each one: re-read the diff, run typecheck/lint/tests, and challenge it ("what breaks? what is the attacker's move?").
4. **Security pass** - apply the `security-review` skill to everything touched, AND run the `security-reviewer` subagent (`.claude/agents/security-reviewer.md`) on the changed files.
5. **Devil's advocate review** - apply the `devils-advocate` skill AND run the `devils-advocate-reviewer` subagent (`.claude/agents/devils-advocate-reviewer.md`, fresh context) once all subtasks are done. Give each reviewer the goal, acceptance criteria, changed files and the checks already run, never your own conclusion.
6. **Fix loop** - if the review finds any issue of severity Medium or higher, redo the affected subtasks, then repeat steps 4-5. Max 3 loops; if issues remain, report them honestly instead of hiding them.
7. **Report** - finish with the report in `.claude/skills/task-workflow/REPORT_TEMPLATE.md`.

Never mark a task done without evidence (commands run, output seen). Never claim a check passed that was not run.

### Automatic by default (the user does NOT have to ask, in every chat prompt)
- The workflow above runs on every coding task, including small ones (keep small tasks proportionate, but still do steps 4 to 7).
- `supabase-best-practices` whenever the change touches SQL, migrations, RLS, edge functions, RPCs or Supabase client code.
- `api-design` whenever you add, change, document or consume ANY API, edge function route, RPC, PostgREST query, JSON response or react-query fetch (including Dine-In, order taking, webhooks). Fewest calls, one API per job: search what exists first, extend before adding, return related data together, additive only. Apply it automatically, without being asked.
- `nextjs-react-best-practices` whenever the change touches React or Next.js code (`storefront-next/`, `landing-page/`, and React in `src/`).
- `responsive-design` on EVERY UI/CSS/layout change in any of the three apps: it must work from an iPhone SE (320px) to 8K (7680px), phone, tablet, laptop, desktop and TV. State in the report which widths were checked and which were only reasoned. Review responsiveness on every UI update, new or old: when touching an existing screen, review the whole screen at 320, 768, 1440 and 3840+ and fix small gaps or list them in the report.
- `soft-professional-ui` on EVERY new or changed screen, panel, toolbar, card, list, dialog or sheet in the root Vite app (`src/pages/owner`, `src/pages/admin`, `src/components`): the soft, clean, professional Dine In look (page shell with no extra padding, one `text-2xl font-semibold` title, one filled primary button, semantic brand tokens only, stable rows, grouped and paged long lists, shared dialog sizing). Apply it automatically, without being asked in the prompt, together with `responsive-design`, and run its review checklist before reporting done.
- `fluid-responsive-ui` on EVERY UI change in the root Vite app, together with `responsive-design`: the copy-ready recipes (page width cap, adaptive grids, tables, tabs, sticky bars, dialogs and sheets, big-screen scaling, width-by-width review) so every screen works from 320px to 8K. Apply it automatically, without being asked in the prompt.
- `friendly-errors` on EVERY change that shows an error, toast, alert or failure state, in all three apps and every surface (guest, landing page, owner, reseller, super admin): no raw code, "CODE: detail" string or database error ever reaches a person; use each app's helper (`storefront-next/src/lib/guestErrorMessage.ts`, `src/lib/friendlyError.ts`, `landing-page/src/lib/friendlyError.ts`). Apply it automatically, without being asked.
- Reviewers run ONE AT A TIME (CPU rule: at most one subagent at a time): security-reviewer, then devils-advocate-reviewer. Verify any High finding yourself against the code before acting on it, and fix it before reporting done.
- If a check could not run (no Deno, timeouts, no browser), say so in the report as NOT RUN; never imply it passed.
- Update `src/lib/platformUpdates.ts` (What's new, Releases, Status) on every change people will notice, without being asked (`.claude/rules/platform-updates.md`).

## Non-negotiables
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. No `NEXT_PUBLIC_` prefix on secrets. Service-role code lives only in server-only modules.
- Every table in an exposed schema has RLS enabled and explicit policies. No `using (true)` on user data.
- Authorization is enforced on the server (RLS + server checks), never only in the UI or middleware.
- On the server use `supabase.auth.getUser()`, not `getSession()`, to trust identity.
- Validate all external input (forms, route params, search params, request bodies, webhooks) with a schema (zod) at the boundary.
- Never edit already-applied migrations; add new ones in `supabase/migrations/`.
- No `any`, no `@ts-ignore` without a written reason. No secrets, tokens or PII in logs.
- Don't add dependencies without stating why, checking maintenance status, and checking for known vulnerabilities.
- Prefer small, reversible changes. Do not refactor unrelated code.

## Skills index
- `task-workflow` - decomposition, execution loop, fix loop, final report
- `security-review` - security checklist for Supabase + Next.js
- `devils-advocate` - adversarial end-of-task review
- `supabase-best-practices` - schema, RLS, auth, storage, edge functions, migrations
- `api-design` - API and JSON standards plus the "fewest calls, one API per job" rule: reuse first, response envelope, snake_case, minor-unit money, ISO dates, status codes, idempotency, pagination, versioning and compatibility, review checklist
- `nextjs-react-best-practices` - App Router, server/client boundaries, data fetching, performance, accessibility
- `responsive-design` - every screen size from 320px (iPhone SE) to 8K, mobile first, touch targets, big-screen width caps
- `soft-professional-ui` - the Dine In look for owner and admin UI: page shell, titles, buttons, brand colour tokens, rows, grouping and paging, dialogs and sheets, review checklist
- `fluid-responsive-ui` - recipes for full responsiveness 320px to 8K: width caps, grids, tables, tabs, sticky bars, dialogs and sheets, big screens, review method
- `friendly-errors` - no raw error codes or database errors on any screen; per-app friendly message helpers, rules and review checklist
- `sticky-page-footer` - Save button in a fixed footer (`StickySaveBar`, flush with the bottom and sides via `--page-pad`, one Save per page) plus height fixes: full-height page roots, equal-height cards, no cut-off cards
- `underline-tabs` - tabs like Opening hours: plain text, coloured underline under the active tab, joined to the content, no pills, no scrollbar (copy-ready classes for card tabs and page sub-navigation)

## Commands (adjust to the project)
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`
- Test: `npm test`
- DB lint/advisors: `supabase db lint`, and review Supabase security advisors
- Dependency audit: `npm audit --omit=dev`


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
