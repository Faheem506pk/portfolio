---
name: clean-dense-audit-feed
description: Design and build clean, high-density, restrained enterprise activity feeds, audit logs, event timelines, and tabular event streams with date-grouping, segmented filters, subtle inline metadata, and JSON payload inspection.
---

# Clean Dense Audit & Activity Feed

This skill defines the canonical standards, UX patterns, and component architecture for building clean, high-density, enterprise-grade audit logs, activity feeds, security timelines, and event streams.

---

## When to use this skill

- Designing or refactoring **Audit Trails**, **Activity Logs**, **Security Event Feeds**, or **Webhook / Job History**.
- When an interface feels overly verbose, tall, or cluttered with too many colorful pill tags ("rainbow vomit").
- When users need high information density, fast visual scannability, date-oriented temporal structure, and instant payload inspection.

---

## Core UX & Design Principles

### 1. Restrained Palette & Zero Rainbow Clutter
- **Monochrome & Subtle Neutrals by Default**: Standard actions, icons, and metadata chips MUST use neutral text (`text-foreground`, `text-muted-foreground`) and muted background fills (`bg-muted/50`, `border-border/40`).
- **Reserve Color Exclusively for High-Signal Events**:
  - 🔴 **Destructive / High-Risk** (`domain.custom_removed`, `tenant.suspend`, `access.revoked`, `is_sensitive`): Soft rose/red indicator (`text-rose-600`, `bg-rose-500/10`, `border-rose-500/20`).
  - 🟢 **Positive / Activation** (`tenant.create`, `tenant.resume`, `access.restored`): Subtle emerald indicator.
  - ⚪ **Standard Events** (`invite.send`, `role.grant`, `page_layout.publish`, `tax.seed`): Crisp monochrome/neutral typography.

### 2. Ultra-Compact Single-Line Row Layout (~32px – 38px Height)
- Every event row must be single-line on desktop with horizontal breathing room:
  - **Left**: Subtle icon (14px) + Human-readable Title (12px bold) + Monospace action key (`bg-muted/50 text-muted-foreground px-1.5 py-0.2 rounded border`).
  - **Middle**: Inline context details (Email, Domain, Actor role) as clean secondary text (`text-muted-foreground`) without loud neon boxes.
  - **Right**: Tabular timestamp (relative + exact time) + Quick "Payload" toggle button.

### 3. Segmented Filter Control
- Filter pills MUST use a clean segmented container (`bg-muted/60 p-0.5 rounded-lg border border-border/60`):
  - Inactive tabs: `text-muted-foreground hover:text-foreground`
  - Active tab: `bg-background text-foreground shadow-2xs font-semibold`
  - Avoid individual multi-colored saturated buttons.

### 4. Temporal Date-Group Headers
- Group logs chronologically under sticky headers:
  - `Today`, `Yesterday`, `Wed, Aug 19, 2026`, etc.
  - Small uppercase tracking (`text-[10px] font-semibold text-muted-foreground uppercase tracking-wider`).
  - Right-aligned group event count (`3 events`).

### 5. Expandable JSON Payload Inspector
- Toggle inline dark-mode code viewer (`bg-zinc-950 text-zinc-100 font-mono text-[10px] rounded border border-zinc-800`).
- Include Event ID, IP Address, and a one-click **Copy JSON** button.

### 6. Pagination & Row Density Controls
- Show item range (`Showing 1–20 of 53 events`).
- Provide rows per page selector (`15`, `25`, `50`, `100`).
- Include First, Previous, Page Indicator, Next, and Last page controls.

---

## Reference Component Template

```tsx
import { useState, useMemo, useCallback } from "react";
import {
  Activity,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// 1. Data Contract
export type EventLogItem = {
  id: string;
  action: string;
  actor_role: string | null;
  metadata: Record<string, any> | null;
  is_sensitive: boolean;
  created_at: string;
};

// 2. Action Presentation Mapper
function getActionPresentation(action: string) {
  const isDestructive = action.includes("removed") || action.includes("suspend") || action.includes("revoked");
  const cleanTitle = action
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: cleanTitle,
    icon: Activity,
    isDestructive,
  };
}

// 3. Compact Row Component
export function AuditLogRow({ log, isExpanded, onToggle }: { log: EventLogItem; isExpanded: boolean; onToggle: () => void }) {
  const pres = getActionPresentation(log.action);
  const Icon = pres.icon;

  return (
    <div className={`transition-colors duration-100 ${isExpanded ? "bg-muted/30" : "hover:bg-muted/20"}`}>
      <div
        onClick={onToggle}
        className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs cursor-pointer select-none"
      >
        {/* Left */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Icon className={`h-3.5 w-3.5 shrink-0 ${pres.isDestructive ? "text-rose-500" : "text-muted-foreground/70"}`} />
          <span className="font-medium text-foreground text-[12px] shrink-0">{pres.title}</span>
          <code className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.2 rounded border border-border/40 shrink-0 hidden sm:inline">
            {log.action}
          </code>

          {/* Context Details */}
          <div className="flex items-center gap-2 overflow-hidden text-[11px] shrink truncate text-muted-foreground">
            {typeof log.metadata?.email === "string" && (
              <span className="truncate font-normal text-foreground/80">{log.metadata.email}</span>
            )}
            {log.actor_role && (
              <span className="hidden md:inline text-muted-foreground/70 text-[10px] capitalize shrink-0">
                by {log.actor_role.replace("_", " ")}
              </span>
            )}
            {log.is_sensitive && (
              <span className="text-[9px] font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded shrink-0 border border-rose-500/20">
                Sensitive
              </span>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0 text-muted-foreground">
          <span className="text-[11px] tabular-nums font-normal">
            {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            type="button"
            className="h-5 px-1.5 rounded text-[10px] font-medium flex items-center gap-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <span>{isExpanded ? "Hide" : "Payload"}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Expanded JSON Viewer */}
      {isExpanded && (
        <div className="px-4 py-2.5 bg-zinc-950 text-zinc-100 border-t border-border/40 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px]">
              <FileCode2 className="h-3 w-3 text-zinc-400" />
              <span>Event ID: {log.id}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(JSON.stringify(log, null, 2));
                toast.success("Payload copied");
              }}
              className="h-6 px-2 text-[10px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-1 rounded"
            >
              <Copy className="h-3 w-3" />
              Copy JSON
            </Button>
          </div>
          <pre className="rounded bg-zinc-900/90 p-2.5 text-zinc-200 font-mono text-[10px] overflow-x-auto border border-zinc-800 max-h-48">
            {JSON.stringify(log.metadata || {}, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```
