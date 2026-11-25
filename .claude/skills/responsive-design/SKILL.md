---
name: responsive-design
description: Always build and review UI so it works at every screen size, from an iPhone SE (320px) up to 8K (7680px), on phone, tablet, laptop, desktop and TV. Use for ANY change to React/Next.js UI, CSS or layout, in all three apps.
---

# Responsive design (every screen, always)

Every UI change must work from **320px wide (iPhone SE, small Android) to 7680px (8K)**, in portrait and landscape, on touch and on mouse. Do this by default, without being asked.

## Sizes to design and check
| Class | Width | Notes |
|---|---|---|
| Small phone | 320-359 | iPhone SE, small Android. The hard floor: nothing may overflow or clip. |
| Phone | 360-479 | iPhone 12-16, most Android. |
| Large phone / small tablet | 480-767 | Plus/Max phones, landscape phones. |
| Tablet | 768-1023 | iPad portrait. Two columns where it helps. |
| Laptop | 1024-1439 | iPad landscape, small laptops. |
| Desktop | 1440-1919 | Full HD. |
| Large / 4K | 1920-3839 | Content must not stretch into unreadable line lengths. |
| 5K to 8K / TV | 3840-7680 | Cap content width or scale type; never leave a tiny island in a huge empty page. |

## Rules
1. **Mobile first.** Write the base styles for 320px, then widen with `min-width` breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, plus a container cap for 4K+).
2. **No horizontal page scroll, ever.** Use `min-w-0`, `overflow-wrap:anywhere`, `flex-wrap`, `truncate` where text can be long (names, codes, translations, RTL).
3. **Fluid, not fixed.** Prefer `%`, `fr`, `minmax()`, `clamp()`, `auto-fit/auto-fill` grids and `max-width` over fixed pixel widths and heights. Use `dvh`/`svh` (not `vh`) for full-height screens.
4. **Touch targets at least 44x44 CSS px** (48 for primary actions), with spacing between neighbours. Hover-only affordances need a touch equivalent.
5. **Safe areas:** use `env(safe-area-inset-*)` for fixed bars and set `viewport-fit=cover`.
6. **Content width caps for big screens:** readable text 60-75ch; app pages use a max-width container (for example 1120-1536px) and centre; dashboards may use extra columns, never one stretched column. For 4K/8K increase the cap or base font size (`clamp`) so UI is not tiny.
7. **Type scales fluidly** with `clamp()`. Body never below 16px on phones for inputs (prevents iOS zoom). Respect user zoom up to 200%.
8. **Images and media:** fixed `aspect-ratio`, `object-fit`, `sizes`/`srcset` (or Next `<Image sizes>`), no layout shift.
9. **Tables and wide data:** on small screens turn into stacked cards or give an intentional scroll container, never break the page.
10. **Dialogs, sheets, drawers:** full-screen or bottom sheet on phones; centred and width-capped on tablet and up; scroll inside, keep the primary button visible.
11. **Orientation and keyboard:** works in landscape; on-screen keyboard must not hide the focused field or the primary button.
12. **Preferences:** honour `prefers-reduced-motion`, dark mode where the app has it, RTL (use logical properties: `ms-/me-`, `ps-/pe-`, `inset-inline-*`, `text-start`).
13. **Design tokens only** (project rule): no raw colours while fixing layout.

## Review responsiveness on every UI update, new or old
- **New design:** build it responsive from the start (rules above).
- **Old design you touch:** when you edit a screen or component that already exists, review that whole screen for responsiveness at the widths below, not only your change. Fix what is broken if it is small and in scope; otherwise list it in the report as a known responsive gap with the width and the symptom.
- **Design polish / redesign / theme work (impeccable, polish, adapt):** include a responsive pass as a required step.
- **Reviewers:** the devils-advocate-reviewer must include a responsive lens (320 to 7680, touch targets, overflow, safe areas, big-screen width) in every UI review, and the report must say what was and was not seen.

## Check before reporting done
- Review the layout at **320, 375, 414, 768, 1024, 1440, 1920, 3840, 7680** (and landscape 667x375, 1024x768). In the browser use device mode and the custom size box; if no browser is available, reason through the CSS at each width and say it was NOT RUN visually.
- Look for: overflow, clipped text, overlapping fixed bars, unreachable buttons, tiny text on huge screens, empty vast margins, double scrollbars, 100vh bugs.
- In the final report list the widths checked and which were only reasoned, not seen.

## Pair with
`full-width-responsive-layout` (dashboards on 1920px+), `impeccable` (design polish), `nextjs-react-best-practices` (accessibility).
