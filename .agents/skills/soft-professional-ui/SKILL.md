---
name: soft-professional-ui
description: The house look for owner and admin screens in the root Vite app (src/): soft, clean, professional, like the Dine In page. Use for ANY new or polished page, panel, toolbar, card, list, table, dialog or sheet in src/pages/owner, src/pages/admin and src/components. Covers page shell, titles, buttons, colour tokens, dialogs, pagination, sticky bars and the review checklist.
---

# Soft professional UI (the Dine In look)

Reference screen: `src/pages/owner/dine-in/DineInHome.tsx` (`/owner/dine-in`). Match it. Calm, dense enough to scan, one clear primary action, colour used with meaning. Read `CLAUDE.md` section 5 and `.claude/rules/` first; this skill adds to them and never overrides them.

Use together with `responsive-design` (320px to 8K) and `impeccable` (for deeper design work). Run the `devils-advocate` review before calling UI work done.

## 1. Page shell
- The layout already pads every page (`p-4 sm:p-6`, `lg:p-5` in the platform nav). **Never add another `p-6` around a page.** That double padding is the most common defect.
- Wrap page content in `OwnerPageShell` (`src/components/owner/OwnerPageShell.tsx`) or use `mx-auto w-full min-w-0 max-w-[110rem]`. It fills phones to desktops and stops growing on 4K and 8K so lines and cards stay readable.
- Do not cap pages at `max-w-4xl` or `max-w-5xl` unless the page is a single narrow form. Never use `container mx-auto`.
- Vertical rhythm: `space-y-6` between sections, `space-y-3` inside a section.

## 2. Header
- One `h1`: `text-2xl font-semibold tracking-tight text-foreground`. Use `OwnerPageIntro` when the page needs a one-line summary. Same size on every page.
- Header row: `flex flex-wrap items-center justify-between gap-3`. Title left, actions right, wraps on small screens.
- Section headings: `text-base` or `text-lg font-semibold`, normal case. Do not use tiny uppercase letter-spaced labels as headings or eyebrows.
- A short helper line under a heading is `text-sm text-muted-foreground`. Never below `text-xs`; avoid `text-[9px]`, `text-[10px]` for anything a person must read.

## 3. Buttons and toolbars
- One filled primary button per area (the main action). Everything else is `variant="outline"` or `ghost`. Many identical bright buttons in a row is a bug.
- Do not colour secondary buttons differently (no blue, green and orange pills side by side). Group help and tours into one quiet menu ("Guides").
- Height: `h-9` on desktop and `max-sm:h-11` (or `min-h-11`) on touch. Dine In uses `min-h-11`.
- Icon size 16px (`h-4 w-4`), `aria-hidden="true"`, muted colour on outline buttons.
- Icon meaning: Export is the **upload** arrow (data leaves), Import is the **download** arrow (data comes in).
- Dashed orange "Add" buttons are not used. Use a plain outline button with a `Plus` icon.
- Every button that does async work follows `.claude/rules/async-button-safety.md` (`useMutation` `isPending`, or `useAsyncAction`).
- Keep existing `tour-*` class names on buttons. Guided tours find their targets with them.

## 4. Colour (semantic tokens only)
- Never raw colours (`bg-white`, `text-black`, hex, `slate-*`, `indigo-*`, `violet-*`, `purple-*`, `gray-*`). The brand is a runtime token set (orange by default; it can change per restaurant), so raw hues look wrong the moment the brand changes.
- Surfaces: `bg-background`, `bg-card`, `bg-muted/30` for quiet panels, `border-border`.
- Text: `text-foreground`, `text-muted-foreground`.
- Brand accent, used sparingly: `bg-primary` (the one filled button, the active item), `bg-primary-soft text-primary-deep` (soft chips and counts, open or selected rows), `border-primary/30`.
- Status colours with meaning: `success` (done, paid, live), `warning` (needs attention, allergen notice), `destructive` (delete, errors). Use `/10` backgrounds with a full-colour text or icon, for example `border-warning/30 bg-warning/10`.
- No gradients on headers or cards (an image scrim is fine). No coloured side borders thicker than 1px.
- Colour adds meaning, not decoration. A tasteful amount: one accent chip per row, a soft selected state, status badges.

## 5. Cards, lists and rows
- Card: `rounded-xl border border-border bg-card shadow-2xs`. Hover can add `hover:shadow-md`. No nested cards.
- Rows keep a **stable height**: do not let a metadata line wrap and change the row height when a row opens, hovers or loads. Use `flex-nowrap`, `min-w-0` and `truncate`, and a `min-h-*` on the row.
- Selected or open row: `bg-primary-soft border-primary/30`, normal font weight (do not bold the whole row).
- Counts and tags are chips (`rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium`), not monospace text. Monospace is only for codes and IDs.
- Empty state: dashed border box, one icon, one sentence on what is missing, one sentence on what to do (see Dine In "no active tables"). Loading: a small spinner. Error: a destructive-tinted box with a Retry button, never an empty `catch {}`.
- Starter and template cards: clean 16:9 image, name as `text-base font-semibold`, quiet subtitle, soft chips for counts. Only the recommended card gets the filled button; the rest are outline.

## 6. Long lists: group and page
- Group by meaning with a normal-case heading and a count ("Recommended for you 1", "More cuisines 9"). Group rows by category on review screens.
- Page long lists. 10 cards or 20 rows per page. Controls: Previous, "Page x of y", Next, and "21 to 40 of 134" in `aria-live="polite"`. Reset to page 1 when a search or filter changes. Clamp the page index when the list shrinks.
- A filter beside paging uses toggle buttons with counts (All, Errors, Warnings), `aria-pressed`, and resets on new data.
- Save bars and other page-level bottom bars: use `StickySaveBar` and the `sticky-page-footer` skill (flush with the bottom via `--page-pad`, never a plain `bottom-0` that floats above the layout padding).
- Pagination bars and tab bars that matter stay visible while scrolling: `sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur` for pagination, `sticky top-0 z-20 bg-background` for tabs. Extend the background to the page edge with negative margins (`-mx-4 px-4 sm:-mx-6 sm:px-6`).
- Tabs that do not fit scroll sideways (`overflow-x-auto flex-nowrap`), they never overflow the page.

## 7. Dialogs and sheets
- Use the shared `Dialog`, `AlertDialog` and `Sheet` components. Their width comes from `dialogViewportStyle` in `src/lib/dialogViewport.ts` (nearly full width on phones, at least 30vw and at most 80vw on large screens, 92dvh tall). Do not hard-code widths, `vh` heights or `w-[...px]`. Use the `size` prop or a `max-w-*` class for the preferred width, and `dvh` not `vh`.
- A dialog with `p-0` must also set `sm:p-0`, because the base adds `sm:p-6`. Otherwise you get an unwanted outer padding band.
- Structure: header (title `text-lg font-semibold`, description `text-sm text-muted-foreground`), scrolling body, footer. Long bodies scroll inside the dialog, the footer stays reachable.
- Footer: `DialogFooter` gives a 12px gap, stacked full-width buttons on phones (primary on top) and side by side on wider screens. Never override it to `gap-0`. Destructive confirmations use `AlertDialog`.
- A popup that explains a locked control says what is needed first, shows the steps with done and not-done states, and has a button to go and fix it ("Go to Stripe setup"). Make a locked switch clickable to open that explanation instead of leaving it dead.
- A dialog is for a task that needs focus. Do not use a modal for something a plain inline section can do.

## 8. Safety checks that belong in the UI
- Do not let a control be switched on when its prerequisite is missing (for example online payment on premise needs Stripe Connect). Lock it, show why, and also enforce it on the server.
- Server rules always win. The UI check is a convenience, never the only check.

## 9. Review checklist (run before saying done)
1. No extra page padding; title is `text-2xl font-semibold`; content uses the shell and cap.
2. One filled primary button per area; the rest outline; heights 36px and 44px on touch.
3. Only semantic tokens (grep the files you touched for `slate-`, `indigo-`, `violet-`, `purple-`, `bg-white`, `#`).
4. No text under 12px that people must read; no uppercase tracked micro-labels.
5. Rows keep a constant height; long names truncate; nothing wraps into the action buttons.
6. Empty, loading, error and disabled states exist; long lists are grouped and paged.
7. Dialogs use shared components, `dvh`, `sm:p-0` with `p-0`, shared footer spacing.
8. Checked or reasoned at 320, 768, 1440 and 3840 or wider. Say which were only reasoned. Without a browser, say plainly that nothing was seen.
9. eslint on touched files, related vitest, then the `devils-advocate` review. Fix Medium findings before reporting.

## 10. Things not to do
- Do not build the same card repeated as the page structure, icon plus heading plus text.
- Do not add motion for its own sake. Respect reduced motion.
- Do not edit `src/components/ui/*` casually; change the shared component only when a defect affects every consumer (as with dialog width and footer gap), and say so in the report.
- Do not touch the legal allergen wording, or other required legal text, when restyling it.
- Do not add a em dash in any copy or document.
