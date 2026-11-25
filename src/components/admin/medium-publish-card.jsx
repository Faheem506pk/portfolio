"use client"

import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { AlertTriangle, CheckCircle2, ClipboardCopy, ExternalLink, Info, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/markdown"
import { MediumStatusBadge } from "@/components/admin/medium-status-badge"
import { MEDIUM_STATUSES, mediumPolicyChecks } from "@/lib/story-pipeline"

const LEVEL_ICON = {
  error: <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />,
  warn: <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />,
  info: <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />,
}

// Copies the rendered story as rich text so pasting into Medium keeps headings, lists and code.
async function copyRich(node, markdown) {
  const html = node.innerHTML
  if (navigator.clipboard && window.ClipboardItem) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([markdown], { type: "text/plain" }),
      }),
    ])
    return
  }
  // Fallback for browsers without ClipboardItem: select the rendered node and copy.
  const range = document.createRange()
  range.selectNodeContents(node)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  document.execCommand("copy")
  selection.removeAllRanges()
}

export function MediumPublishCard({ post, update }) {
  const renderRef = useRef(null)
  const [copying, setCopying] = useState(false)
  const issues = useMemo(() => mediumPolicyChecks(post), [post])
  const errors = issues.filter((i) => i.level === "error").length

  const copyForMedium = async () => {
    setCopying(true)
    try {
      await copyRich(renderRef.current, `# ${post.title}\n\n${post.content || ""}`)
      toast.success("Copied. In Medium, click Write, add the title, then paste into the body.")
    } catch {
      toast.error("Copy failed. Use Copy Markdown instead.")
    } finally {
      setCopying(false)
    }
  }

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(`# ${post.title}\n\n${post.content || ""}`)
      toast.success("Markdown copied")
    } catch {
      toast.error("Copy failed")
    }
  }

  const changeStatus = (value) => {
    const patch = { medium_status: value }
    if (value === "published_on_medium" && !post.medium_published_at) {
      patch.medium_published_at = new Date().toISOString()
    }
    update(patch)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Medium</CardTitle>
        <MediumStatusBadge status={post.medium_status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medium_status">Status on Medium</Label>
          <select
            id="medium_status"
            value={post.medium_status || "not_on_medium"}
            onChange={(e) => changeStatus(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {MEDIUM_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medium_url">Medium URL</Label>
          <div className="flex gap-2">
            <Input
              id="medium_url"
              value={post.medium_url || ""}
              onChange={(e) => update({ medium_url: e.target.value })}
              placeholder="https://faheem506pk.medium.com/..."
              className="text-sm"
            />
            {post.medium_url && (
              <Button variant="outline" size="icon" asChild title="Open on Medium">
                <a href={post.medium_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={Boolean(post.ai_assisted)}
              onChange={(e) => update({ ai_assisted: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            AI wrote or rewrote some of this text
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={Boolean(post.paywall)}
              onChange={(e) => update({ paywall: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            I will put it behind the paywall
          </label>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Policy check
            {errors === 0 ? (
              <span className="flex items-center gap-1 normal-case tracking-normal text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> no blockers
              </span>
            ) : (
              <span className="normal-case tracking-normal text-destructive">{errors} to fix</span>
            )}
          </p>
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing flagged. You still read it fully before publishing.</p>
          ) : (
            <ul className="space-y-1.5">
              {issues.map((issue, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground">
                  {LEVEL_ICON[issue.level]}
                  <span>{issue.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={copyForMedium} disabled={copying || !post.content}>
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Copy for Medium
          </Button>
          <Button variant="outline" onClick={copyMarkdown} disabled={!post.content}>
            Copy Markdown
          </Button>
          <Button variant="outline" asChild>
            <a href="https://medium.com/new-story" target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Medium editor
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          You publish on Medium yourself. This page only helps you copy the story and track its status.
        </p>

        {/* Hidden render used only as the source for rich-text copy. */}
        <div ref={renderRef} className="sr-only" aria-hidden="true">
          <Markdown content={post.content || ""} />
        </div>
      </CardContent>
    </Card>
  )
}
