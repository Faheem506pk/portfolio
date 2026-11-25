---
name: sticky-page-footer
description: Put the Save button in a fixed footer bar and fix height problems on owner and admin pages in the root Vite app. Covers sticky Save / Discard (unsaved changes) bars that must sit flush with the bottom and side edges of the scroll area, pages that do not fill the full height, and cards in a row that end at different heights or stop short of their container. Use whenever a save bar or footer floats above the bottom, content shows under it, a page has two Save buttons or Save buttons that jump around, a page does not reach the bottom of the screen, or cards in a grid are uneven or cut off.
---

# Sticky page footer and full-height layout

## The bug this fixes
The owner and admin pages scroll inside `AdminLayout`'s content area:

```
flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-[var(--page-pad)] ... flex flex-col
```

That area has padding (16px on phones, 24px from `sm`, 20px at `lg` on the platform nav). A plain `sticky bottom-0` bar stops at that padding, not at the real edge. So:
- the bar floats 16 to 24px above the bottom, with page content visible underneath it;
- with `-mx-6` the sides can be off by 4px on screens where the padding is 20px.

## The rule
1. **Use the shared component** `src/components/owner/StickySaveBar.tsx` for any "unsaved changes" bar:
   ```tsx
   <StickySaveBar
     visible={hasChanges}
     saving={save.isPending}
     onSave={() => save.mutateAsync().catch(() => undefined)}
     onDiscard={resetForm}
   />
   ```
   It already:
   - sits flush with the bottom and side edges;
   - adds iPhone safe-area padding;
   - stacks full-width 44px buttons on phones;
   - shows a spinner, disables both buttons while saving, and has a `useRef` double-click guard (`.claude/rules/async-button-safety.md`).
2. **For any other sticky bottom bar** (pagination, page actions), copy the same offsets. Never hard-code `-mx-6` or `bottom-0`:
   ```
   sticky z-20 mt-auto
   bottom-[calc(var(--page-pad,1.5rem)*-1)]
   -mx-[var(--page-pad,1.5rem)] -mb-[var(--page-pad,1.5rem)] px-[var(--page-pad,1.5rem)]
   pb-[max(0.75rem,env(safe-area-inset-bottom))]
   border-t border-border bg-background/95 backdrop-blur
   ```
   `--page-pad` is set by `AdminLayout` to its own padding, so the bar cancels it exactly at every width.
3. **The page root must let the bar reach the bottom:** use `flex flex-1 flex-col gap-6`, not `space-y-6`, and put the bar as the **last child**.
   - `mt-auto` pushes the bar to the bottom on short pages.
   - Drop the page's bottom padding (`pb-12`) while the bar is shown, otherwise it leaves a gap under the bar at the end of the page.
4. **One save action per page.** Remove any second Save button in the header; the bar is the only one. Show the bar only while there are unsaved changes, and give it a Discard that restores the loaded values.
5. **Do not use this inside dialogs or sheets.** They use `DialogFooter` (see `soft-professional-ui` section 7). Cards with their own footer (for example in `MenuEditor.tsx`) keep `sticky bottom-0` inside the card, because they are not the page scroll area.

## Height problems (fix together with the footer)

### Page does not reach the bottom of the screen
The scroll area in `AdminLayout` is `flex flex-col`. A page root that is a plain block (`space-y-6`) only grows as tall as its content. On short pages the footer then sits in the middle of the screen.
- **Page root:** `mx-auto flex w-full min-w-0 max-w-[110rem] flex-1 flex-col gap-6`.
- **Footer bar:** the last child, with `mt-auto`. `StickySaveBar` already has it.
- Never give a page root `h-screen`, `min-h-screen` or `100vh`. The layout header already takes space, so the page overflows and gets a double scrollbar. Use `flex-1` instead.

### Cards in a row end at different heights or look cut off
- **Grid:** `grid items-stretch gap-4` with columns that fit the content, for example `grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4` for cards that hold switch lists. Do not force 4 columns at `xl` when the cards get too narrow.
- **Wrapper:** each grid item's wrapper `div` gets `h-full min-w-0`. Wrappers that render their children straight into the grid (such as `PlanGatedFeature`) need nothing extra.
- **Card:** `flex h-full flex-col rounded-xl border border-border bg-card shadow-2xs`. The body that should grow gets `flex-1`. Header and footer stay their natural height.
- **No fixed heights:** no `h-[420px]` or `max-h-*` on cards with content. A fixed height cuts off the bottom border and the last rows (the "card stops short" bug). If a list really must be capped, put `max-h-*` with `overflow-y-auto` on the inner list, never on the card.
- **Rows inside cards:** use `min-h-9` (or `min-h-11` for touch) so rows keep a stable height. Long labels get `min-w-0 truncate`, or wrap below the switch, never under it.

### Dialogs and sheets
Height is handled by `dialogViewportStyle` (92dvh) and `DialogFooter`. Use `dvh`, never `vh`, and keep the footer outside the scrolling body (see `soft-professional-ui` section 7).

## When `--page-pad` is missing
If a page renders outside `AdminLayout` (for example a full-bleed editor), set the variable on that page's own scroll container to match its padding:
```
p-[var(--page-pad)] [--page-pad:1rem] sm:[--page-pad:1.5rem]
```
Without it, the bar falls back to 24px (`var(--page-pad,1.5rem)`).

## Review checklist
- Short page (or collapse sections): the footer sits at the very bottom of the screen, not mid-page.
- Cards in each row line up at the bottom, every card shows its full bottom border, and nothing is cut off at any width.
- Scroll to the middle of the page: the bar touches the bottom edge, and no content shows below it.
- Scroll to the very end: no blank band under the bar.
- The bar's border and background run edge to edge of the content area, with no 4px gaps at the sides.
- Check at 320px, 768px, 1440px and 1920px or wider. On phones the buttons stack, Save is on top, and each is 44px tall.
- Fast double click on Save sends one request.
- Say plainly which widths you saw in a browser and which you only reasoned about.
