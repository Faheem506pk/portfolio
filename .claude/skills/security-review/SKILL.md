---
name: security-review
description: Security checklist for Supabase + Next.js/React code. Use after implementing or changing any code touching auth, data access, RLS policies, migrations, storage, edge functions, API routes, server actions, forms, env vars or dependencies.
---

# Security Review (Supabase + Next.js)

Review every file touched. For each finding record: severity (Critical/High/Medium/Low/Info), file:line, attack scenario (one sentence), fix.
Mark each checklist item PASS / FAIL / N/A. Do not mark PASS for something you did not inspect.

## 1. Secrets and configuration
- [ ] `SUPABASE_SERVICE_ROLE_KEY` and other secrets are never in client code, `NEXT_PUBLIC_*` vars, logs, or committed files.
- [ ] Service-role client is created only in server-only modules (`import 'server-only'`) and only when RLS bypass is truly required; each use is justified in a comment.
- [ ] `.env*` files are gitignored; only the anon key and URL are public.
- [ ] No hardcoded credentials, tokens, or JWT secrets.

## 2. Authentication
- [ ] Server code trusts `supabase.auth.getUser()`, not `getSession()` or unverified cookies/JWT payloads.
- [ ] Protected pages, route handlers, and server actions each check auth themselves (middleware alone is not enough).
- [ ] Authorization data (roles, tenant) is read from `app_metadata` or a server-side table, never from `user_metadata` (user-editable).
- [ ] Redirect targets after login/logout (`next`, `redirect_to`) are validated against an allowlist (no open redirect).
- [ ] Auth cookies are set via the official `@supabase/ssr` helpers (HttpOnly, Secure, SameSite).

## 3. Authorization and RLS
- [ ] Every table in `public` (or any exposed schema) has `ENABLE ROW LEVEL SECURITY` and explicit policies per operation.
- [ ] No `USING (true)` / `WITH CHECK (true)` on non-public data. UPDATE policies have BOTH `USING` and `WITH CHECK`.
- [ ] Policies are scoped `TO authenticated` (or `anon` only when intended) and use `(select auth.uid())` for performance.
- [ ] Multi-tenant data: every policy checks tenant membership; no cross-tenant read/write (IDOR test: user A requests user B's id).
- [ ] Views use `security_invoker = true` (or are not exposed); otherwise they bypass RLS.
- [ ] `SECURITY DEFINER` functions set `search_path = ''`, validate inputs, check the caller, and are not executable by `anon`/`public` unless intended (revoke default EXECUTE).
- [ ] Storage buckets: private by default; policies on `storage.objects` restrict by bucket and owner/path; signed URLs have short expiry.
- [ ] No privilege escalation: users cannot update their own role, tenant id, or `is_admin` columns (column-level control or trigger).

## 4. Input validation and injection
- [ ] All external input (body, params, searchParams, headers, form data, webhooks) validated with zod at the boundary; types are not trusted from the client.
- [ ] No string-built SQL. Use the Supabase client, RPC with typed parameters, or parameterized queries. Dynamic filters/ordering use allowlists.
- [ ] Mass assignment: only allowlisted fields are written (never spread request body into insert/update).
- [ ] File uploads: type, size, and extension checked; stored under server-generated names/paths.
- [ ] SSRF: server-side fetches of user-supplied URLs are restricted (allowlist, no internal IPs).

## 5. Frontend
- [ ] No `dangerouslySetInnerHTML` with unsanitized content; if needed, sanitize with a vetted library.
- [ ] User content in URLs (`href`, `src`) is protocol-checked (no `javascript:`).
- [ ] No sensitive data in client components, localStorage, or URLs. Server-only data not passed as props to client components.
- [ ] Server actions: authenticate, authorize, validate; do not rely on hidden form fields for identity or permissions.
- [ ] Security headers configured (CSP, `X-Content-Type-Options`, `Referrer-Policy`, frame protection, HSTS).

## 6. API routes, Edge Functions, webhooks
- [ ] Edge Functions verify JWT (do not disable `verify_jwt` without justification); webhook endpoints verify signatures and reject replays.
- [ ] CORS is restricted to known origins (no `*` with credentials).
- [ ] Rate limiting / abuse protection on auth, password reset, OTP, signup, and expensive endpoints.
- [ ] Error responses do not leak stack traces, SQL, or internal ids; logs contain no tokens/PII.
- [ ] State-changing endpoints are not callable via simple GET; CSRF considered for cookie-auth endpoints.

## 7. Dependencies and supply chain
- [ ] `npm audit --omit=dev` run; High/Critical findings addressed or justified.
- [ ] New dependencies are justified, maintained, and minimal. Lockfile committed.

## 8. How to verify (do at least what applies)
- Run `supabase db lint` and review Supabase security advisors.
- Write or run a test that signs in as user A and attempts to read/modify user B's rows (must fail), and as `anon` against protected tables (must fail).
- Grep for risky patterns: `service_role`, `NEXT_PUBLIC_`, `dangerouslySetInnerHTML`, `getSession(`, `eval(`, `.rpc(`, `using (true)`.

## Output
Return a findings table and a verdict: PASS / PASS WITH CAVEATS / FAIL. Any Critical/High/Medium finding triggers the fix loop in `task-workflow`.
