# Async button safety (STRICT, always read before touching a button that does async work)

Every button that triggers an async action (network call, Supabase call, form submit) **MUST**:

1. Show a loading indicator while the action is in flight.
2. Be `disabled` while the action is in flight.
3. Guard against a second click firing before React re-renders with that disabled state. A `loading` boolean from `useState` alone is not enough: the DOM's `disabled` attribute only updates after the state update commits, and two fast clicks (or a click synchronously followed by another state-dependent call in the same handler) can both fire before then. Use a synchronous `useRef` guard.

This was discovered via a real bug: `storefront-next`'s "Continue as guest" checkout button called `handleProceed()` synchronously right after `setGuestConfirmed(true)` in the same `onClick`. `handleProceed`'s guard read `guestConfirmed`'s stale pre-update value, so the first click always re-opened the same dialog; only the second click (after React had re-rendered) worked. Fixed in two parts: an explicit `justConfirmedGuest` parameter so the guard didn't need to wait on the state update, and wrapping the action in the shared hook below so the loading/re-entrancy problem can't recur the same way elsewhere.

## Do not hand-roll this per call site

Each app has **its own** copy of this pattern. **Never** import one app's hook into another; these are three independent apps with independent dependencies (see root `CLAUDE.md` §1a).

- **Root app** (`src/`): prefer `@tanstack/react-query`'s `useMutation`. It's already the idiomatic pattern here (see `CLAUDE.md` §8) and its `isPending` binds directly to a button's `disabled`/spinner. Don't hand-roll separate loading state for a real data mutation. For the rare one-off async action that isn't a mutation, use `src/hooks/useAsyncAction.ts`.
- **storefront-next**: no react-query dependency here. Use `storefront-next/src/hooks/useAsyncAction.ts` for every async button.
- **landing-page**: no react-query dependency here either. Use `landing-page/src/hooks/useAsyncAction.ts` for every async button.

All three `useAsyncAction.ts` files implement the same pattern (loading flag, error flag, `useRef` re-entrancy guard, `run()` wrapper) but are separate, independently-maintained files, not a shared package.

## Usage shape

```ts
const doThing = useAsyncAction(async () => {
  await someAsyncWork();
});

<Button disabled={doThing.loading} onClick={() => doThing.run()}>
  {doThing.loading ? <Loader2 className="animate-spin" /> : "Do thing"}
</Button>
```

Canonical: this file (`.claude/rules/async-button-safety.md`), mirrored at [`.cursor/rules/async-button-safety.mdc`](../../.cursor/rules/async-button-safety.mdc).
