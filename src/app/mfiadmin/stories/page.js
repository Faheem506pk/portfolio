"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Columns3, ExternalLink, List, Loader2, PenLine, RefreshCw, ClipboardCopy } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MediumStatusBadge } from "@/components/admin/medium-status-badge"
import { PIPELINE_STATUSES, normalizeTitle } from "@/lib/story-pipeline"
import { syncWithMedium } from "@/lib/medium-sync"

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

async function fetchAll() {
  const [ideaRes, postRes] = await Promise.all([
    supabase.from("story_ideas").select("*").order("score", { ascending: false }).order("number"),
    supabase.from("posts").select("id, title, status, medium_status, medium_url, updated_at"),
  ])
  if (ideaRes.error) return { missing: true, ideas: [], posts: [] }
  return { missing: false, ideas: ideaRes.data || [], posts: postRes.data || [] }
}

export default function ContentStudioPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [view, setView] = useState("board") // board | list
  const [query, setQuery] = useState("")
  const [pillar, setPillar] = useState("all")
  const [syncing, setSyncing] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const apply = useCallback((result) => {
    if (result.missing) {
      setMissing(true)
    } else {
      setIdeas(result.ideas)
      setPosts(result.posts)
    }
    setLoading(false)
  }, [])

  const load = useCallback(async () => apply(await fetchAll()), [apply])

  useEffect(() => {
    let alive = true
    fetchAll().then((result) => {
      if (alive) apply(result)
    })
    return () => {
      alive = false
    }
  }, [apply])

  const postById = useMemo(() => new Map(posts.map((p) => [p.id, p])), [posts])
  const effective = (idea) => {
    const post = idea.post_id ? postById.get(idea.post_id) : null
    return post?.medium_status === "published_on_medium" ? "published" : idea.status
  }

  const pillars = useMemo(() => ["all", ...Array.from(new Set(ideas.map((i) => i.pillar).filter(Boolean)))], [ideas])

  const visible = ideas.filter((idea) => {
    const matches = `${idea.number} ${idea.title}`.toLowerCase().includes(query.toLowerCase())
    return matches && (pillar === "all" || idea.pillar === pillar)
  })

  const setStatus = async (idea, status) => {
    setBusyId(idea.id)
    const { error } = await supabase.from("story_ideas").update({ status }).eq("id", idea.id)
    setBusyId(null)
    if (error) return toast.error(error.message)
    setIdeas((prev) => prev.map((i) => (i.id === idea.id ? { ...i, status } : i)))
  }

  // Creates the blog draft once, links it to the idea, and opens the editor.
  const startWriting = async (idea) => {
    if (idea.post_id) return router.push(`/mfiadmin/blog/${idea.post_id}`)
    setBusyId(idea.id)
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title: idea.title, slug: `${slugify(idea.title).slice(0, 70)}-${Date.now()}`, status: "draft", content: "" }])
      .select("id")
      .single()
    if (error) {
      setBusyId(null)
      return toast.error(error.message)
    }
    await supabase.from("story_ideas").update({ post_id: data.id, status: "drafting" }).eq("id", idea.id)
    setBusyId(null)
    router.push(`/mfiadmin/blog/${data.id}`)
  }

  const copyBriefPath = async (idea) => {
    try {
      await navigator.clipboard.writeText(idea.brief_path || "")
      toast.success("Brief path copied. Open it in your editor or ask your AI agent to read it.")
    } catch {
      toast.error("Copy failed")
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    const result = await syncWithMedium(posts.map((p) => ({ ...p })))
    setSyncing(false)
    if (result.error) return toast.error(result.error)
    toast.success(
      result.updated ? `Marked ${result.updated} as published on Medium` : "Checked Medium. Nothing new to mark."
    )
    load()
  }

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (missing) {
    return (
      <Card>
        <CardContent className="space-y-2 py-10 text-center">
          <p className="font-medium">The content studio tables are not set up yet.</p>
          <p className="text-sm text-muted-foreground">
            Apply the new migrations (<code className="font-mono">0003</code> and <code className="font-mono">0004</code>) with{" "}
            <code className="font-mono">npm run db:push</code>, then reload this page.
          </p>
        </CardContent>
      </Card>
    )
  }

  const counts = Object.fromEntries(PIPELINE_STATUSES.map((s) => [s.value, 0]))
  ideas.forEach((i) => {
    counts[effective(i)] += 1
  })

  const IdeaCard = ({ idea }) => {
    const post = idea.post_id ? postById.get(idea.post_id) : null
    const status = effective(idea)
    return (
      <Card className="transition-colors hover:border-primary/40">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug text-foreground">
              <span className="mr-1 font-mono text-xs text-muted-foreground">#{idea.number}</span>
              {idea.title}
            </p>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{idea.score}/20</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="font-normal">
              {idea.pillar}
            </Badge>
            <Badge variant="outline" className="font-normal text-muted-foreground">
              {idea.kind === "from_sources" ? "From sources" : "Needs my details"}
            </Badge>
            {post && <MediumStatusBadge status={post.medium_status} />}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label={`Stage for idea ${idea.number}`}
              value={status}
              disabled={busyId === idea.id}
              onChange={(e) => setStatus(idea, e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              {PIPELINE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <Button size="sm" variant={idea.post_id ? "outline" : "default"} onClick={() => startWriting(idea)} disabled={busyId === idea.id}>
              <PenLine className="mr-1.5 h-3.5 w-3.5" />
              {idea.post_id ? "Open draft" : "Start writing"}
            </Button>
            {idea.brief_path && (
              <Button size="icon" variant="ghost" className="h-8 w-8" title="Copy brief file path" onClick={() => copyBriefPath(idea)}>
                <ClipboardCopy className="h-3.5 w-3.5" />
              </Button>
            )}
            {post?.medium_url && (
              <Button size="icon" variant="ghost" className="h-8 w-8" asChild title="Open on Medium">
                <a href={post.medium_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Content Studio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ideas.length} researched story ideas. Write the text yourself, then publish on Medium when you are ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSync} disabled={syncing}>
            {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Check Medium
          </Button>
          <Button variant="outline" asChild>
            <Link href="/mfiadmin/blog">All posts</Link>
          </Button>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {PIPELINE_STATUSES.map((s) => (
          <Card key={s.value}>
            <CardContent className="p-4">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-2xl font-bold">{counts[s.value]}</dd>
            </CardContent>
          </Card>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Search ideas…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
        <select
          aria-label="Filter by pillar"
          value={pillar}
          onChange={(e) => setPillar(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {pillars.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? "All pillars" : p}
            </option>
          ))}
        </select>
        <div className="ml-auto flex rounded-lg border border-border p-0.5">
          {[
            { key: "board", icon: Columns3, label: "Board" },
            { key: "list", icon: List, label: "List" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              title={label}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                view === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {view === "board" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PIPELINE_STATUSES.map((s) => {
            const column = visible.filter((i) => effective(i) === s.value)
            return (
              <section key={s.value} aria-label={s.label} className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold text-foreground">{s.label}</h2>
                  <span className="font-mono text-xs text-muted-foreground">{column.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">{s.hint}</p>
                <div className="space-y-3">
                  {column.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">Nothing here</p>
                  ) : (
                    column.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
                  )}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  )
}
