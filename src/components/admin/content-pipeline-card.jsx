"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, PenLine } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Writing pipeline</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/mfiadmin/stories">
            Open Content Studio <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {missing ? (
          <p className="text-sm text-muted-foreground">
            The story pipeline tables are not set up yet. Run <code className="font-mono">npm run db:push</code> to add them.
          </p>
        ) : (
          <>
            <div>
              <div className="flex h-2 overflow-hidden rounded-full bg-muted" role="img" aria-label="Pipeline progress by stage">
                {PIPELINE_STATUSES.map((s, i) => (
                  <div
                    key={s.value}
                    style={{ width: `${(counts[s.value] / total) * 100}%`, opacity: 0.35 + i * 0.13 }}
                    className="bg-primary"
                    title={`${s.label}: ${counts[s.value]}`}
                  />
                ))}
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {PIPELINE_STATUSES.map((s) => (
                  <div key={s.value}>
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="font-display text-xl font-bold">{counts[s.value]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">{onMedium} tracked stories are live on Medium.</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Next up</p>
              <ul className="divide-y divide-border">
                {next.map((idea) => (
                  <li key={idea.id}>
                    <Link
                      href="/mfiadmin/stories"
                      className="flex items-center gap-3 py-2 text-sm transition-colors hover:text-primary"
                    >
                      <PenLine className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate">
                        <span className="font-mono text-xs text-muted-foreground">#{idea.number}</span> {idea.title}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{idea.score}/20</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
