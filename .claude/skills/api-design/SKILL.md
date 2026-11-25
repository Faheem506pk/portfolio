---
name: api-design
description: API and JSON standards for TabTake, with the "fewest calls, one API per job" rule. Use for ANY work that adds, changes, documents or consumes an API, edge function route, RPC, PostgREST query, JSON response, react-query fetch or webhook. Covers reuse-first decisions, response shape, errors, status codes, money and dates, pagination, idempotency, versioning and compatibility.
---

# API design (TabTake)

Read this before touching any API. It is the short version of what the repo already does, plus the standards that apply to it. Where this file and the code disagree, say so in your report instead of guessing.

## 0. Know where APIs live (do not assume one backend)
- `api-v1` (supabase/functions/api-v1/routes/*.ts): till, KDS, mobile, third parties. Documented in `api-v1/openapi.ts`, `docs/pos-api.html`, `docs/menu-api-specification/*`. Live docs: `/functions/v1/api-v1/api/v1/docs`.
- `dine-session` (supabase/functions/dine-session/): Dine-In sessions. One URL, many `action` values (move, combine, uncombine, seat, close, guest actions). NOT in the api-v1 docs.
- Storefront functions: `menu-public`, `page-public`, `basket`, `place-order`, `confirm-order`. Anonymous, cached (Next revalidate 60 plus tags). Keep them separate from api-v1.
- Root web app: Supabase client under RLS plus react-query. No endpoint is needed for ordinary reads.
- Inventory of what exists today: `docs/dine-in-api-inventory.md`. Read it first for orders and Dine-In.

## 1. THE RULE: fewest calls, one API per job
Before adding anything, search for what exists (routes, edge functions, RPCs, views, react-query keys, hooks). Then decide, in this order:
1. An existing call already returns it: use it.
2. It needs a little more: extend it, compatibly (optional field, optional `include=` flag, optional parameter).
3. The data is always read together: return it together in one nested response (PostgREST embedded select, a view, or one RPC). Never loop per row (N+1).
4. Only then add a new endpoint, and write down why in the report (different authorization, independent update, large or paginated data, different cache lifetime or lifecycle).
Never add an endpoint just because another component needs the same data: share it (one react-query key, one shared query). One job, one call: a client should not need two calls to finish one action (for example place an order = one `POST /orders`, not create then add lines then price).
Do not merge public storefront functions into api-v1, or the reverse. Share the logic in `supabase/functions/_shared` instead (for example `staffOrderPricing.ts` is the single pricing source).
Measure before and after (requests per screen, distinct query keys, database queries, payload bytes, p50 and p95). Write NOT MEASURED when you did not. Never claim a gain you did not measure.

## 2. Request and response shape (api-v1 contract)
- Success: `{ "success": true, "data": ... }` with `ok(data, status)`. Failure: `{ "success": false, "error": { "code", "message", "details"? } }` with `fail(code, message, status, details)`. No body with 204 (`noContent()`). Use the helpers in `api-v1/lib/http.ts` and the shared `Errors.*`. Do not invent another envelope.
- JSON keys are `snake_case`. Do not switch to camelCase. Enums are lowercase snake strings. IDs are UUID strings.
- Money: integer in minor units (`price_pence`), plus the store's currency code. Never a formatted string, never a float.
- Dates and times: ISO 8601 with an explicit offset (UTC `Z`). Dates only as `YYYY-MM-DD`. Do not send local-time strings without a zone.
- Booleans are booleans, numbers are numbers. Missing or unknown: `null` (keep the key, so clients do not guess). Empty collections: `[]`.
- Nest what is read together (an order with its lines, add-ons and table label). Keep nesting shallow and never circular. Return only the columns the caller needs and nothing the caller may not see.
- Every list has a `limit` with a hard cap and a stable sort. Large lists use cursor paging (`next_cursor`), not offsets. Never return an unbounded list.

## 3. Methods and status codes (RFC 9110)
`GET` read (safe, no side effects, cacheable). `POST` create or run an action. `PUT` replace. `PATCH` partial update. `DELETE` remove. Existing routes keep their methods.
`200` ok, `201` created, `204` ok with no body, `400` malformed request, `401` not signed in, `403` signed in but not allowed, `404` not found (also for a resource in another restaurant, never `403`, so ids are not leaked), `405`, `409` state conflict (already seated, already paid), `422` valid shape but invalid values (the repo uses `INVALID_BODY` 422), `429` rate limited with `Retry-After` (`Errors.rateLimited`), `500` unexpected (never expose details).
Error `code` is a stable UPPER_SNAKE string clients can switch on; `message` is plain English and safe to show. Never put SQL errors, stack traces, secrets or personal data in `message` or `details`.

## 4. Safety under retries and concurrency
- Every create that moves money or stock takes an `idempotency_key` created once per attempt (see `POST /orders`): the same key returns the same result with `idempotent: true`, never a second order.
- State changes (move table, combine, close) must be one database transaction with the right locks, in a fixed lock order, and must return `409` for a lost race, not a half change. Add a concurrency test.
- Validate every input at the edge (schema, ranges, UUIDs, enum members). Reject unknown or client-controlled fields that must be server-side (for example a price on an order line is a 400).
- Do not trust the client for identity, store, branch, price, role or status. Take them from the verified token and the database.

## 5. Compatibility (old terminals and the mobile app must keep working)
- Additive only: add fields, add optional parameters, add routes. Never rename, remove or retype a field, and never change what an existing field means.
- Replacing a field: keep both for a deprecation period. The repo marks them with the `X-Deprecated-Fields` header (see `ok()` in `lib/http.ts`); use that pattern, and add a `Sunset` date when one is agreed.
- Version in the path (`/api/v1`). A breaking change needs a new version and the owner's approval first.
- A behaviour change gets a heads-up line in `src/lib/platformUpdates.ts`, an update to `openapi.ts` and the matching docs, and is told to the user.

## 6. Security (always)
RLS on every table, authorization on the server (RLS plus checks), never only in the UI. `SECURITY DEFINER` functions set `search_path = public` and have restricted `EXECUTE`. Check both the staff-token path and the device-token path. Cross-tenant ids return `404`. Rate-limit anonymous and expensive endpoints. Audit-log destructive or moderation actions. See the `security-review` and `supabase-best-practices` skills.

## 7. Web app data fetching (react-query)
One query key per dataset and parameter set. Reuse it across components (the floor plan is `["owner-floor-plan", storeId, locationId]`). Set a `staleTime` that matches how fresh the data must be and avoid several timers on the same data. After a mutation, invalidate only the keys it changes. No fetching in `useEffect`. Do not refetch what a parent already holds.

## 8. Documentation and tests
- The POS page (`/v1/pos-docs`, `supabase/functions/api-v1/posDocs.ts`) is cut from `openapi.ts` by an allow-list, so a route documented in a POS tag appears there by itself. A route outside those tags (or a new tag) that a POS app needs must be added to the allow-list in `posDocs.ts`. Dine-In session actions are listed by hand in `posDocs.ts` and in `docs/dine-session-api.md`: update both when an action changes.
- Document a new or changed route in `openapi.ts` (summary, auth, parameters, body, responses, errors, example). Routes that exist but are missing from the docs are a bug: add them.
- Tests: the happy path, each error code, permission denied, a cross-tenant id, idempotent retry, and a concurrency case for state changes. Run only the relevant tests.

## 9. Review checklist (answer each in the report)
1. Did I search for an existing call first, and what did I find?
2. Is it one call for the whole job, with related data nested?
3. Any N+1, unbounded list or unneeded column?
4. Envelope, snake_case, minor-unit money, ISO dates, null and empty-array rules kept?
5. Right status codes and a stable error `code`, no internals in messages?
6. Idempotent where money or stock moves, transactional and locked where state changes?
7. Additive only, docs and `platformUpdates.ts` updated?
8. Authorization, RLS and tenant isolation checked on every path?
9. Calls measured before and after, or marked NOT MEASURED?
