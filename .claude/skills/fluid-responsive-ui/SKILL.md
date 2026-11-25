---
name: fluid-responsive-ui
description: Copy-ready recipes for making screens fully responsive from 320px phones to 8K, in this repo's root Vite app. Use with responsive-design on ANY UI change. Covers page width caps, grids, tables, tabs, toolbars, sticky bars, dialogs and sheets, big-screen scaling, touch targets and a width-by-width review method.
---

# Fluid responsive UI (recipes)

`responsive-design` says WHAT must hold (320px to 7680px, no horizontal scroll, 44px touch targets). This skill says HOW, with patterns that already work in this repo. Use both. Without a browser, reason through each width and say which were only reasoned.

## 1. Page width
- Content root: `mx-auto w-full min-w-0 max-w-[110rem]` (or `OwnerPageShell`). Fills phones to 1760px, then stops, so 4K and 8K do not stretch lines.
- The layout already pads pages. Never add another `p-6`.
- Every flex or grid child that holds text needs `min-w-0`. Long names use `truncate` or `[overflow-wrap:anywhere]`.

## 2. Grids that adapt without breakpoints
- Cards: `grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-4`. One column at 320px, as many as fit on a wide screen. Dine In uses this.
- When breakpoints are clearer: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`.
- Form rows: `grid grid-cols-1 gap-3 sm:grid-cols-2`. Never a bare `grid-cols-2` inside a dialog (fields are 130px wide at 320px).

## 3. Headers and toolbars
- `flex flex-wrap items-center justify-between gap-3`. Title block `min-w-0`. Actions wrap under the title on phones.
- Many actions: keep one primary button visible, move the rest into a `DropdownMenu`. A toolbar that needs a second row on phones is acceptable; clipped buttons are not.
- A banner next to buttons uses the same height (`min-h-9`, `max-sm:min-h-11`) and `items-center`, so the row aligns.

## 4. Tables and wide data
- Wrap in `overflow-x-auto` (the shared `Table` already does). Give wide tables an intentional `min-w-*` on the table, not on the page.
- On phones prefer stacked rows or cards for lists the user reads (name, status, price on lines). Keep real tables for dense admin data.
- Fixed-width header cells (`w-[100px]`) are fine only inside a scroll container.

## 5. Tabs
- Tab lists that can exceed the width: `flex-nowrap overflow-x-auto [&>*]:shrink-0`. Never let them wrap into two rows or overflow the page.
- Sticky tab bars: `sticky top-0 z-20 bg-background`. Extend to the page edge with `-mx-4 px-4 sm:-mx-6 sm:px-6`.

## 6. Sticky bars and the scroll area padding
- Sticky offsets measure from the padded edge of the scroll container, so the bar floats 16 to 24px away from the screen edge. Cancel the padding with a negative offset that matches the layout padding: `sticky -top-4 sm:-top-6` (bottom: `-bottom-4 sm:-bottom-6`), checked against the real padding in the browser inspector (16px on phones, 24px from sm up in this layout). Do not add a background-coloured box-shadow to fill the gap: it paints over the content next to the bar (it hid the intro line above a tab bar and a heading below a pagination bar).
- Bottom pagination bars: `sticky bottom-0 z-10 border-t bg-background`. Solid background, not a see-through blur.

## 7. Dialogs, alert dialogs and sheets
- Use the shared components only. Width comes from `dialogViewportStyle` (`src/lib/dialogViewport.ts`): nearly full width on phones, at least 30vw and at most 80vw on large screens, 92dvh tall.
- Set preferred width with `size` or a `max-w-*` class. Never fixed `w-[...px]`, never `vh` (use `dvh`).
- `p-0` on a dialog also needs `sm:p-0` (the base adds `sm:p-6`).
- Long content scrolls inside the body; the footer stays reachable. Footer buttons stack on phones with the primary on top.
- Sheets: `w-[85%]` on phones with a `sm:max-w-*` that steps up at `min-[1920px]`, `min-[2560px]` and `min-[3840px]`.

## 8. Rows that do not jump
- Metadata lines in list rows: `flex-nowrap overflow-hidden`, text `min-w-0 truncate`, and a `min-h-*` on the row. A line that wraps when the row opens or hovers changes the height and looks broken.
- Fixed side controls (icon buttons) get `shrink-0`; the name column gets `min-w-0 flex-1`.

## 9. Big screens (4K, 8K, TV)
- Cap content (section 1), let grids add columns, let dialogs and sheets scale (section 7).
- Text sizes do not auto-scale. For dashboards shown on TVs, wrap in a container that raises the root font size at `min-[2560px]` (for example `text-[1.125rem]`) instead of changing every class. Say so in the report when you do not.
- Do not centre a small island in a vast empty page; use extra columns or a side panel.

## 10. Phones
- Inputs are at least 16px tall text on phones (prevents iOS zoom). Primary actions 44px (`max-sm:h-11`, `min-h-11`).
- Hover-only controls need a touch path: show them always on touch (`max-lg:opacity-100 opacity-0 group-hover:opacity-100`).
- Fixed bars use `env(safe-area-inset-bottom)`. Dialogs and sheets use `dvh`.
- Landscape phones (667x375): check dialogs and sticky bars do not cover the whole screen.

## 11. Review method (width by width)
Check or reason each of: **320, 375, 768, 1024, 1440, 1920, 3840, 7680**, plus landscape 667x375.
For each, look for: horizontal scroll, clipped or overlapping text, a button pushed off screen, rows changing height, two scrollbars, a sticky bar with a gap, a dialog narrower than its content, a vast empty margin.
Report the widths seen and the widths only reasoned. If no browser was available, say so plainly.

## 12. Quick greps before reporting done
- `grep -nE "[0-9]+vh\\b" file` : replace with `dvh`.
- `grep -nE "grid-cols-[2-9]\\b" file` : each must have a smaller-screen fallback.
- `grep -nE "w-\\[[0-9]+px\\]" file` : only inside scroll containers.
- `grep -n "p-0" file` near `DialogContent` : needs `sm:p-0`.
- `grep -nE "text-\\[(8|9|10)px\\]" file` : raise to `text-xs` if people must read it.
