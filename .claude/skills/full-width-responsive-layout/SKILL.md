---
name: full-width-responsive-layout
description: Guidelines and layout strategies for ensuring all dashboard screens, settings forms, cards, tables, and settings tabs fill 100% full width on large monitors (1920px+) without leaving blank empty space on the right or squishing content into narrow columns.
---

# Full-Width Responsive Layout & Anti-Whitespace Guidelines

## Core Objective
Ensure that every dashboard screen, settings panel, configuration form, and data display in the application expands dynamically to use **100% of the available horizontal width (`w-full`)** on desktop monitors (including 1920px+ ultra-wides). Prevent awkward empty whitespace voids on the right side of the screen while avoiding squeezed single-column card layouts.

---

## 🛑 Anti-Patterns & Causes of Empty Space on the Right

1. **Static Container Width Caps (`max-w-2xl`, `max-w-3xl`, `max-w-7xl`)**:
   - **Problem**: Wrapping pages in fixed pixel or rem width caps leaves 50%-70% blank empty space on 1920px monitors.
   - **Solution**: Always use `<div className="w-full space-y-6">` on outer page wrappers.

2. **Leaving Remaining Columns Empty in Grid Rows**:
   - **Problem**: Putting only 2 cards in a grid row on wide screens leaves the remaining 33%-50% right side completely blank.
   - **Solution**: Group all sibling section cards (e.g. `Customer notifications`, `Staff notifications`, `Owner notifications`) together inside a matching 3-column grid (`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full`), so that Card 1, Card 2, and Card 3 fill all 3 columns across the row side-by-side with zero wasted space on the right.

3. **Multi-Column Over-Squishing**:
   - **Problem**: Forcing cards with detailed long-form toggle rows into 4+ columns (`grid-cols-4`), squishing cards into 120px narrow strips that wrap text into single-word lines.
   - **Solution**: Match column counts to card density: 3 columns (`xl:grid-cols-3`) for toggle cards, 4 columns (`xl:grid-cols-4`) for compact metric cards.

4. **Table Column Squishing on Mobile / Small Screens**:
   - **Problem**: Rendering `<table>` without a minimum width or overflow wrapper forces 5+ columns into a 300px mobile viewport, squishing cell contents into 4-line single-word text wraps.
   - **Solution**: Wrap tables in `<CardContent className="p-0 overflow-x-auto scrollbar-none">` and apply `<table className="w-full min-w-[600px] text-sm">` with `whitespace-nowrap` on header/cell items. On wide screens, the table expands to `100% (w-full)`; on small screens, it scrolls horizontally without squishing.

---

## 🛠️ Responsive Layout Strategies by Component Type

### 1. Multi-Card Settings Panels (e.g. Notifications, Payment Methods, Services)
```tsx
<div className="space-y-6 w-full">
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
    <Card className="w-full h-full flex flex-col justify-between">...</Card>
    <Card className="w-full h-full flex flex-col justify-between">...</Card>
    <Card className="w-full h-full flex flex-col justify-between">...</Card>
  </div>
</div>
```

### 2. Full-Width Data Tables with Mobile Horizontal Scroll (e.g. Invoices, Orders, Tax Overview, Logs)
```tsx
<div className="space-y-6 w-full">
  <Card className="w-full">
    <CardHeader>...</CardHeader>
    <CardContent className="p-0 overflow-x-auto scrollbar-none">
      <table className="w-full min-w-[650px] text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            <th className="px-4 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">Tenant</th>
            <th className="px-4 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">Country</th>
            <th className="px-4 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/40">
            <td className="px-4 py-2 font-medium whitespace-nowrap">Nano Pizza</td>
            <td className="px-4 py-2 whitespace-nowrap">GB</td>
            <td className="px-4 py-2 whitespace-nowrap"><Badge>Active</Badge></td>
          </tr>
        </tbody>
      </table>
    </CardContent>
  </Card>
</div>
```

### 3. Stat & Metric KPI Cards (e.g. Usage, Storefront Stats, Opening Hours)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
  <Card className="w-full">...</Card>
</div>
```

---

## 📋 Pre-Flight Verification Checklist
- [ ] Are outer page containers free of `max-w-2xl` / `max-w-3xl` / `max-w-7xl` width caps?
- [ ] Are all sibling section cards placed together in 3-column desktop grids (`xl:grid-cols-3`) to fill the entire row from left to right?
- [ ] Is 100% of the horizontal space on 1920px monitors used without blank white gaps on the right?
- [ ] Do tables have `<CardContent className="p-0 overflow-x-auto scrollbar-none">` and `<table className="w-full min-w-[600px] text-sm">` so they scroll horizontally on mobile viewports instead of squishing cell text?
- [ ] Do cards refrain from squishing text into 1-word vertical breaks on smaller viewports?
