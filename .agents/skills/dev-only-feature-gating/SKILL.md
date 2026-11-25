---
name: dev-only-feature-gating
description: Gate incomplete or work-in-progress UI tabs, pages, and components so they are only visible in Dev mode (import.meta.env.DEV) with a colored status dot badge, keeping production clean.
---

# Dev-Only Feature Gating

Use this skill when building new features, tabs, or admin pages that are incomplete, placeholder, or in active development.

## Core Rules

1. **Development Mode Only**: Unfinished or work-in-progress (WIP) features must evaluate `import.meta.env.DEV`.
2. **Visual Status Indicator**: In Dev Mode, render an inline colored status dot badge (`amber` / `bg-amber-500` for pending/WIP, `blue` for beta, `emerald` for ready).
3. **Preserve Disabled / Unclickable State for Placeholders**:
   - If a WIP feature or menu item was previously disabled or a `comingSoon` placeholder (e.g., `Branches`, `Integrations`), it **MUST remain disabled/unclickable (`comingSoon: true`)** in Dev Mode to prevent navigating to broken dead anchor links (like `#business-branches`).
   - Combining `comingSoon: true` + `devOnly: true` + `statusDot: "amber"` displays the pulsing amber status badge in Dev Mode while keeping the item safely unclickable (`cursor-not-allowed text-muted-foreground/50 opacity-60`).
4. **Production Mode Suppression**: In Production Mode (`import.meta.env.PROD`), `devOnly: true` automatically hides the tab or component completely so live users never see incomplete features.
5. **Checklists & Progress Metrics vs. Navigation Tabs**:
   - Gating (`devOnly: true`) is appropriate for optional sidebar/subnav links, preview tabs, or experimental admin tools.
   - For core setup checklists, onboarding wizards, and progress metrics (e.g., "4 of 4 configured"), obsolete or non-essential items MUST be completely removed from the data structure rather than kept in dev mode so progress metrics remain accurate and consistent.

---

## Implementation Patterns

### 1. Admin Sidebar & Page Tab Bar (`AdminLayout.tsx`)

In `AdminLayout.tsx` navigation definitions:

```tsx
// Unfinished page with a route:
{
  to: "/owner/theme/earnings",
  label: "Earnings & Payouts",
  icon: DollarSign,
  visibleFor: ["owner"],
  devOnly: true,        // Only visible in import.meta.env.DEV
  statusDot: "amber"   // Colored status dot indicator ('amber' | 'yellow' | 'blue' | 'red')
}

// Unfinished placeholder item (non-clickable / disabled):
{
  to: "#business-branches",
  label: "Branches",
  icon: Building2,
  visibleFor: ["owner"],
  comingSoon: true,     // Keeps item unclickable / disabled with cursor-not-allowed
  devOnly: true,        // Hides completely in import.meta.env.PROD
  statusDot: "amber"   // Displays pulsing status dot in Dev Mode
}
```

### 2. Component Wrapper (`DevOnlyGate`)

For inline component blocks or pages:

```tsx
import { ReactNode } from "react";

export function DevOnlyGate({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  if (!import.meta.env.DEV) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
```

### 3. Status Dot Badge Utility

```tsx
export function DevStatusDot({ status = "amber" }: { status?: "amber" | "yellow" | "blue" | "green" | "red" }) {
  if (!import.meta.env.DEV) return null;
  
  const colors = {
    amber: "bg-amber-500 shadow-amber-500/50",
    yellow: "bg-yellow-500 shadow-yellow-500/50",
    blue: "bg-blue-500 shadow-blue-500/50",
    green: "bg-emerald-500 shadow-emerald-500/50",
    red: "bg-red-500 shadow-red-500/50",
  };

  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[status]} shadow-xs shrink-0 animate-pulse`}
      title="Development Only — Work In Progress"
    />
  );
}
```
