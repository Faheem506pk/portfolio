"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, PenLine } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Postbox } from "@/components/admin/dashboard-widgets"
import { PIPELINE_STATUSES } from "@/lib/story-pipeline"

// Compact "what is done and what is next" view for the dashboard.
export function ContentPipelineCard() {
  const [ideas, setIdeas] = useState(null)
  const [posts, setPosts] = useState([])
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    async function load() {
      const [ideaRes, postRes] = await Promise.all([
        supabase.from("story_ideas").select("id, number, title, score, status, post_id").order("score", { ascending: false }),
        supabase.from("posts").select("id, medium_status"),
      ])
      if (ideaRes.error) {
        setMissing(true)
        setIdeas([])
        return
      }
      setIdeas(ideaRes.data || [])
      setPosts(postRes.data || [])
    }
    load()
  }, [])

  if (ideas === null) return null

  const publishedPostIds = new Set(posts.filter((p) => p.medium_status === "published_on_medium").map((p) => p.id))
  const effective = (idea) => (idea.post_id && publishedPostIds.has(idea.post_id) ? "published" : idea.status)

  const counts = Object.fromEntries(PIPELINE_STATUSES.map((s) => [s.value, 0]))
  ideas.forEach((idea) => {
    counts[effective(idea)] += 1
  })
  const total = ideas.length || 1
  const next = ideas.filter((i) => effective(i) !== "published").slice(0, 3)
  const onMedium = posts.filter((p) => p.medium_status === "published_on_medium").length

  return (
    <Postbox
      title="Writing pipeline"
      action={
        <Link href="/mfiadmin/stories" className="inline-flex items-center gap-1 text-primary hover:underline">
          Content Studio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="space-y-5">
        {missing ? (
          <p className="text-sm text-muted-foreground">
            The story pipeline tables are not set up yet. Run <code className="font-mono">npm run db:push</code> to add them.
          </p>
        ) : (
          <>
            <div>
              <div className="wp-bar" role="img" aria-label="Stories by stage">
                {PIPELINE_STATUSES.filter((s) => counts[s.value] > 0).map((s) => (
                  <span
                    key={s.value}
                    style={{ width: `${(counts[s.value] / total) * 100}%`, background: s.tone === "primary" ? "var(--primary)" : `var(--tone-${s.tone})` }}
                    title={`${s.label}: ${counts[s.value]}`}
                  />
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {PIPELINE_STATUSES.map((s) => (
                  <div key={s.value}>
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="wp-dot" data-tone={s.tone} aria-hidden="true" />
                      {s.label}
                    </dt>
                    <dd className="text-xl font-semibold">{counts[s.value]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">{onMedium} tracked stories are live on Medium.</p>
            </div>

            <div>
              <p className="mb-2 font-medium">Next up</p>
              <ul className="divide-y divide-border">
                {next.map((idea) => (
                  <li key={idea.id}>
                    <Link
                      href="/mfiadmin/stories"
                      className="flex items-center gap-3 py-2 text-sm transition-colors hover:text-primary"
                    >
                      <PenLine className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate">
                        <span className="text-muted-foreground">#{idea.number}</span> {idea.title}
                      </span>
                      <span className="text-muted-foreground tabular-nums">{idea.score}/20</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </Postbox>
  )
}
