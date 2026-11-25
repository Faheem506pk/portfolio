---
name: underline-tabs
description: Make page or card tabs in the root Vite app (owner and admin) look like the Opening hours tabs - plain text tabs on one line with a coloured underline under the active one, joined to the content below, no pills, no scrollbar. Use whenever a screen has tabs, sub-navigation (like Printers / Templates / History) or channel switches, or when the user asks for tabs "like opening hours".
---

# Underline tabs (the Opening hours look)

Reference: `src/pages/owner/setup/Hours.tsx` (channel tabs on the schedule card) and
`src/components/admin/PrintingSubNav.tsx` (page sub-navigation).

## Look
- One row of plain text tabs, `text-sm font-medium`, an optional 16px icon before the label with `gap-2`.
- Tabs sit `gap-1` apart, each `px-3`, so labels are about 28px apart and the underline runs a little past the text on both sides.
- Active tab: dark text and a 2px underline in the **platform theme colour**, `border-b-2 border-primary text-foreground`. Never black or a fixed colour: `primary` follows the brand theme. Others: `border-transparent text-muted-foreground hover:text-foreground` (icons stay muted too).
- The row sits on a 1px `border-b border-border` line; the active underline sits on that line.
- No pills, no filled background, no rounded boxes, no shadow.
- Height `min-h-12` (48px), padding `px-3`.

## Rules
1. **No scrollbar, no vertical scroll.** The row is `flex overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`. Never put `-mb-px` on the tabs inside an `overflow-x-auto` row: it makes the row scroll up and down by 1px and shows a scrollbar. Tabs that do not fit swipe sideways.
2. **Joined to what they switch.** Tabs that switch a card's content go at the top of that card (first child, the card's own border around both). Page sub-navigation sits directly above the page title.
3. **Semantics.**
   - Switching content in place: `role="tablist"` on the row, `role="tab"` + `aria-selected` on each button.
   - Going to another page: a `<nav aria-label="...">` with `NavLink`s (active state from the router), no tab roles.
4. **Only semantic tokens** (`border-primary`, `text-foreground`, `text-muted-foreground`, `border-border`). Never raw colours.
5. `motion-reduce:transition-none` on the colour transition.
6. Do not repeat the active tab's name as a heading right under the tabs (the tab already says it); keep at most a one-line description.

## Copy-ready

Content tabs on a card:
```tsx
<div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
  <div role="tablist" aria-label="Channel" className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-border px-2 [scrollbar-width:none] sm:px-3 [&::-webkit-scrollbar]:hidden">
    {TABS.map((t) => (
      <button key={t.key} type="button" role="tab" aria-selected={active === t.key} onClick={() => setActive(t.key)}
        className={cn("min-h-12 shrink-0 border-b-2 px-3 text-sm font-medium transition-colors motion-reduce:transition-none",
          active === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
        {t.label}
      </button>
    ))}
  </div>
  {/* tab content */}
</div>
```

Page sub-navigation: see `PrintingSubNav.tsx` (same classes, `NavLink`, icon + label).
It sits on a **white band** (`bg-card`) across the top of the page, edge to edge: as the
page's first child, add
`-mx-[var(--page-pad,1.5rem)] -mt-[var(--page-pad,1.5rem)] px-[calc(var(--page-pad,1.5rem)-0.75rem)] pt-1 bg-card`
so it cancels the layout padding (`--page-pad`, set by `AdminLayout`) and the first tab's
text lines up with the page content below.

## Review
- 320px: tabs swipe sideways, no scrollbar visible, nothing wraps.
- 1440px and wider: one line, theme-colour underline exactly under the active tab, sitting on the border line, tabs evenly spaced.
- Keyboard: Tab reaches each tab, the focus ring is visible.
