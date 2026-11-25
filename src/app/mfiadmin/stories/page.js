"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Columns3, List, Loader2, RefreshCw } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { PIPELINE_STATUSES } from "@/lib/story-pipeline"
import { syncWithMedium } from "@/lib/medium-sync"
import { IdeaCard, StageStrip, StoryColumns } from "@/components/admin/story-board"

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

const OUTLINE = "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted max-sm:h-11"

export default function ContentStudioPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [view, setView] = useState("board") // board | list
  const [stage, setStage] = useState("all")
  const [query, setQuery] = useState("")
  const [pillar, setPillar] = useState("all")
  const [syncing, setSyncing] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const apply = useCallback((result) => {
    if (result.missing) setMissing(true)
    else {
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
  const effective = useCallback(
    (idea) => {
      const post = idea.post_id ? postById.get(idea.post_id) : null
      return post?.medium_status === "published_on_medium" ? "published" : idea.status
    },
    [postById]
  )

  const pillars = useMemo(() => ["all", ...Array.from(new Set(ideas.map((i) => i.pillar).filter(Boolean)))], [ideas])

  const filtered = ideas.filter((idea) => {
    const matches = `${idea.number} ${idea.title}`.toLowerCase().includes(query.toLowerCase())
    return matches && (pillar === "all" || idea.pillar === pillar)
  })

  const counts = useMemo(() => {
    const c = Object.fromEntries(PIPELINE_STATUSES.map((s) => [s.value, 0]))
    ideas.forEach((i) => {
      c[effective(i)] += 1
    })
    return c
  }, [ideas, effective])

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
    toast.success(result.updated ? `Marked ${result.updated} as published on Medium` : "Checked Medium. Nothing new to mark.")
    load()
  }

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (missing) {
    return (
      <div className="wp-notice warn">
        <p className="font-medium">The content studio tables are not set up yet.</p>
        <p className="mt-1 text-muted-foreground">
          Apply the new migrations (<code>0003</code> and <code>0004</code>) with <code>npm run db:push</code>, then reload this page.
        </p>
      </div>
    )
  }

  const listItems = stage === "all" ? filtered : filtered.filter((i) => effective(i) === stage)

  return (
    <div className="space-y-6">
      <div className="wp-heading" style={{ marginBottom: 0 }}>
        <h1>Content Studio</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" className={OUTLINE} onClick={handleSync} disabled={syncing}>
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 text-muted-foreground" />}
            Check Medium
          </button>
          <Link href="/mfiadmin/blog" className={OUTLINE}>
            All posts
          </Link>
        </div>
      </div>
      <p className="wp-sub" style={{ margin: "-8px 0 0" }}>
        {ideas.length} researched story ideas. You write the text yourself, then publish on Medium when you are ready.
      </p>

      <StageStrip counts={counts} active={stage} onSelect={setStage} />

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="idea-search">
          Search ideas
        </label>
        <input id="idea-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ideas" className="w-full max-w-xs" />
        <label className="sr-only" htmlFor="idea-pillar">
          Filter by pillar
        </label>
        <select id="idea-pillar" value={pillar} onChange={(e) => setPillar(e.target.value)} className="h-9 rounded-lg border border-input bg-card px-3 text-sm max-sm:h-11">
          {pillars.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? "All topics" : p}
            </option>
          ))}
        </select>
        <div className="ml-auto flex rounded-lg border border-border bg-card p-0.5" role="group" aria-label="View">
          {[
            { key: "board", icon: Columns3, label: "Board" },
            { key: "list", icon: List, label: "List" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm max-sm:h-10 ${
                view === key ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "board" ? (
        <StoryColumns
          ideas={filtered}
          effective={effective}
          postById={postById}
          busyId={busyId}
          onStage={setStatus}
          onStart={startWriting}
          onCopyBrief={copyBriefPath}
          only={stage}
        />
      ) : listItems.length === 0 ? (
        <p className="wp-empty">No stories match.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {listItems.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              status={effective(idea)}
              post={idea.post_id ? postById.get(idea.post_id) : null}
              busy={busyId === idea.id}
              onStage={(value) => setStatus(idea, value)}
              onStart={() => startWriting(idea)}
              onCopyBrief={() => copyBriefPath(idea)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
