---
name: friendly-errors
description: Make sure no raw error ever reaches a person on any screen (guest storefront, landing page, owner, reseller, super admin). Use on EVERY change that shows an error, toast, alert, inline message or failure state, and when reviewing any UI or edge function response. Codes like QUOTE_STAGING_FAILED, STAFF_ACTION_RETRY, "CODE: detail" strings, database errors and "Edge Function returned a non-2xx status code" must become plain, friendly sentences.
---

# Friendly errors everywhere (never raw)

People never see machine text. Not guests, not owners, not super admins.

**Raw (never shown):** `QUOTE_STAGING_FAILED: STAFF_ACTION_RETRY`, `COUPON_EXPIRED`, `duplicate key value violates unique constraint`, `new row violates row-level security policy`, `JWT expired`, `PGRST116`, `Edge Function returned a non-2xx status code`, `[object Object]`, `undefined`, stack traces.

**Friendly:** says what happened in plain words and what to do next. "The restaurant is busy updating orders. Please tap Place order again."

## The helpers (one per app, never import across apps)

| App | Helper | Notes |
|---|---|---|
| Customer storefront (`storefront-next/`) | `friendlyGuestMessage(raw, fallback?)` in `src/lib/guestErrorMessage.ts` | Already used by `qrError.ts` and `functionsError.ts` (`describeFunctionError`). |
| Main app: owner, reseller, super admin (`src/`) | `friendlyErrorMessage(raw, fallback?)` in `src/lib/friendlyError.ts` | `humanizeEdgeFunctionError` / `getEdgeFunctionErrorMessage` use it. `src/lib/friendlyToast.ts` makes every `toast.error(string)` friendly as a safety net. |
| Marketing site (`landing-page/`) | `friendlyErrorMessage` in `src/lib/friendlyError.ts` | Used by login and contact form. |

Each helper: keeps a message that is already plain English; maps known codes (`EXACT`), then code families (`FAMILIES`, by prefix); hides database or technical text behind the fallback; logs the raw text with `console.warn` for developers.

## Language

Friendly messages follow the language of the app the person is using:
- storefront: the page language (`<html lang>`: en, ar, de). An Arabic storefront shows Arabic messages.
- main app (owner, reseller, super admin): the app language (i18next: en, ar, de). An English admin sees English.
- landing page: the site language (en, de, fr, es, it, ar).

Each helper keeps its sentences per language in its `M` table. A new sentence needs every language of that app. Pass a fallback as a message KEY (for example `"reachRestaurant"`), not English text, so it is translated too.

## Rules when writing code

1. **Any error shown to a person goes through the app's helper**: `setError(friendlyGuestMessage(body.error, t("..."))`, `throw new Error(friendlyErrorMessage(data.error))`. Never `setError(error.message)` or `throw new Error(data.error)` straight from a server response.
2. **Pass a screen-specific fallback** when you have one (translated text): "We couldn't save your email. Try again." beats the generic one.
3. **New server error code?** Add its sentence to the helper's `EXACT` map in each app that can show it, in the same change. A family prefix covers it meanwhile, but a specific sentence is better.
4. **Edge functions** return `{ error: "CODE", message: "Plain sentence." }` when they can. The client still translates (the message may be missing or technical).
5. **Toasts in the main app** are already passed through the helper by `friendlyToast.ts`, but still call the helper with a fallback at the call site: the net cannot know the best wording.
6. **Do not show developer detail** ("error 500", table names, ids) to guests. Owners may see an order number or a field name when it helps them act.
7. **Translations**: storefront and main app screens with i18n pass their translated fallback; the helper's sentences are English.

## Review checklist (run before saying done)

- [ ] Grep the files you touched for `error.message`, `.error)`, `err.message`, `e.message`, `String(err` reaching `setError`, `toast`, `alert`, `throw new Error`, JSX. Each one goes through the helper.
- [ ] Every new error code from the server has a sentence in the helper (or a family covers it, and you said so).
- [ ] No `{error}` rendered directly from a response body.
- [ ] Tests: a code and a database error both show friendly text (`guestErrorMessage.test.ts`, `friendlyError.test.ts` show the pattern).
- [ ] Report: which screens were checked, and any raw path you saw but did not fix (as a follow-up).

No em dashes in messages.
