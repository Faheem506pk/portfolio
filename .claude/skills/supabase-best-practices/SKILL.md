---
name: supabase-best-practices
description: Best practices for Supabase work - schema design, migrations, RLS, auth, storage, edge functions, RPC, and client usage with Next.js. Use whenever creating or changing database objects or Supabase client code.
---

# Supabase Best Practices

## Schema and migrations
- All schema changes go through migration files in `supabase/migrations/` (`supabase migration new <name>`). Never edit an applied migration; add a new one.
- Prefer `uuid` primary keys (`gen_random_uuid()`), `timestamptz` for time, `created_at`/`updated_at` columns, and `not null` + `check` constraints for invariants.
- Add foreign keys with explicit `on delete` behavior, and index every foreign key and every column used in RLS policies or frequent filters.
- Destructive changes (drop/rename column or table) need a safe path: add new, backfill, switch code, remove later.
- Regenerate types after schema changes (`supabase gen types typescript`) and use them in the app. Do not hand-write DB types.
- Keep seed data in `supabase/seed.sql`, never real user data.

## RLS (see also `security-review`)
- Enable RLS on every table in exposed schemas; write one policy per operation (select/insert/update/delete), scoped with `to authenticated`.
- Use `(select auth.uid())` instead of bare `auth.uid()` so it is evaluated once per query.
- Keep policy logic simple; move membership checks into a `security definer` helper with `set search_path = ''`, and index the lookup columns.
- Test policies: sign in as different users and as `anon`, and assert both allowed and denied access.

## Auth
- Use `@supabase/ssr` for Next.js (separate browser and server clients, cookie handling in middleware to refresh sessions).
- Server-side identity: `supabase.auth.getUser()`.
- Store roles/tenant in `app_metadata` or a protected table; never trust `user_metadata`.
- Create a `profiles` table keyed by `auth.users.id` (trigger on signup) instead of adding custom columns to `auth.users`.

## Queries and RPC
- Select only needed columns (no `select('*')` on wide tables); always paginate (`range`/`limit`) and order deterministically.
- Always handle `{ data, error }`: check `error` first, never assume `data` is non-null.
- Use RPC/Postgres functions for multi-step atomic operations (transactions); the client cannot do transactions across calls.
- Use `.single()` only when exactly one row is guaranteed; otherwise `.maybeSingle()`.
- Use idempotency (unique constraints + `upsert` with `onConflict`) for operations that may be retried.

## Storage
- Buckets private by default; path convention like `{user_id}/{uuid}.{ext}` with `storage.objects` policies matching the path.
- Validate type and size server-side; serve via signed URLs with short expiry.

## Edge Functions
- Keep `verify_jwt` enabled unless it is a signed webhook (then verify the signature yourself).
- Secrets via `supabase secrets set`, read with `Deno.env.get`. Validate input with zod; return minimal error detail; set explicit CORS origins.
- Keep functions small and idempotent; set timeouts and handle retries.

## Realtime
- Subscribe only to needed tables/filters; remember RLS applies to Realtime; clean up channels on unmount.

## Operations
- Run `supabase db lint` and check the Supabase security and performance advisors before finishing database work.
- Use `supabase db diff` / `db reset` locally to confirm migrations apply cleanly from scratch.
