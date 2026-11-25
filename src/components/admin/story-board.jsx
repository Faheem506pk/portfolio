"use client"

import { ClipboardCopy, ExternalLink, PenLine } from "lucide-react"

import { MediumStatusBadge } from "@/components/admin/medium-status-badge"
import { PIPELINE_STATUSES } from "@/lib/story-pipeline"

// The stage strip doubles as the filter: one calm row of stages with counts, not six big number cards.
export function StageStrip({ counts, active, onSelect }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return (
    <div className="wp-postbox" role="group" aria-label="Filter by stage">
      <div className="wp-stages">
        <button type="button" className="wp-stage" aria-pressed={active === "all"} onClick={() => onSelect("all")}>
          <span className="label">All stories</span>
          <span className="count">{total}</span>
        </button>
        {PIPELINE_STATUSES.map((s) => (
          <button key={s.value} type="button" className="wp-stage" aria-pressed={active === s.value} onClick={() => onSelect(s.value)}>
            <span className="label">
              <span className="wp-dot" data-tone={s.tone} aria-hidden="true" />
              {s.label}
            </span>
            <span className="count">{counts[s.value] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const OUTLINE = "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted max-sm:h-11"

export function IdeaCard({ idea, status, post, busy, onStage, onStart, onCopyBrief }) {
  const stage = PIPELINE_STATUSES.find((s) => s.value === status)
  return (
    <article className="wp-idea">
      <h3 className="title">
        <span className="text-muted-foreground">#{idea.number}</span> {idea.title}
      </h3>
      <div className="meta">
        <span className="wp-chip plain" data-tone={idea.kind === "from_sources" ? "info" : "warning"}>
          {idea.kind === "from_sources" ? "From sources" : "Needs my details"}
        </span>
        <span>{idea.pillar}</span>
        <span className="score" title="Score out of 20">
          {idea.score}/20
        </span>
      </div>
      {post && (
        <div className="meta">
          <MediumStatusBadge status={post.medium_status} />
        </div>
      )}
      <div className="actions">
        <label className="sr-only" htmlFor={`stage-${idea.id}`}>
          Stage for idea {idea.number}
        </label>
        <select
          id={`stage-${idea.id}`}
          value={status}
          disabled={busy}
          onChange={(e) => onStage(e.target.value)}
          className="h-8 rounded-lg border border-input bg-card px-2 text-sm max-sm:h-11"
          data-stage={stage?.tone}
        >
          {PIPELINE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="button" className={OUTLINE} onClick={onStart} disabled={busy}>
          <PenLine className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {idea.post_id ? "Open draft" : "Start writing"}
        </button>
        {idea.brief_path && (
          <button type="button" className={`${OUTLINE} px-2.5`} title="Copy the brief file path" aria-label="Copy the brief file path" onClick={onCopyBrief}>
            <ClipboardCopy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        )}
        {post?.medium_url && (
          <a className={`${OUTLINE} px-2.5`} href={post.medium_url} target="_blank" rel="noreferrer" title="Open on Medium" aria-label="Open on Medium">
            <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}

export function StoryColumns({ ideas, effective, postById, busyId, onStage, onStart, onCopyBrief, only }) {
  const columns = only && only !== "all" ? PIPELINE_STATUSES.filter((s) => s.value === only) : PIPELINE_STATUSES
  return (
    <div className="wp-board">
      {columns.map((s) => {
        const column = ideas.filter((i) => effective(i) === s.value)
        return (
          <section key={s.value} aria-label={s.label}>
            <div className="wp-col-head">
              <span className="wp-dot" data-tone={s.tone} aria-hidden="true" />
              <h2>{s.label}</h2>
              <span className="count">{column.length}</span>
            </div>
            <p className="wp-col-hint">{s.hint}</p>
            {column.length === 0 ? (
              <p className="wp-empty">Nothing in this stage.</p>
            ) : (
              column.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  status={effective(idea)}
                  post={idea.post_id ? postById.get(idea.post_id) : null}
                  busy={busyId === idea.id}
                  onStage={(value) => onStage(idea, value)}
                  onStart={() => onStart(idea)}
                  onCopyBrief={() => onCopyBrief(idea)}
                />
              ))
            )}
          </section>
        )
      })}
    </div>
  )
}
