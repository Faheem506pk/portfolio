"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Loader2,
  Plus,
  PenLine,
  Trash2,
  ExternalLink,
  FileText,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PostStats } from "@/components/admin/post-stats"
import { MediumStatusBadge } from "@/components/admin/medium-status-badge"
import { syncWithMedium, trackMediumStory } from "@/lib/medium-sync"
import { toast } from "sonner"

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState("all") // all | not_on_medium | on_medium
  const [syncing, setSyncing] = useState(false)
  const [untracked, setUntracked] = useState([])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false })

    if (error) setError(error.message)
    else setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    const stamp = Date.now()
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title: "Untitled post", slug: `untitled-${stamp}`, status: "draft" }])
      .select("id")
      .single()

    setCreating(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(`/mfiadmin/blog/${data.id}`)
  }

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from("posts").delete().eq("id", post.id)
    if (error) setError(error.message)
    else setPosts((prev) => prev.filter((p) => p.id !== post.id))
  }

  const onMedium = (p) => p.medium_status === "published_on_medium"

  const visible = posts.filter((post) => {
    const matches = post.title.toLowerCase().includes(query.toLowerCase())
    if (filter === "not_on_medium") return matches && !onMedium(post)
    if (filter === "on_medium") return matches && onMedium(post)
    return matches
  })

  const handleSync = async () => {
    setSyncing(true)
    const result = await syncWithMedium(posts)
    setSyncing(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    setUntracked(result.untracked)
    toast.success(
      result.updated
        ? `Marked ${result.updated} post${result.updated === 1 ? "" : "s"} as published on Medium`
        : "Checked Medium. No new matches."
    )
    if (result.updated) fetchPosts()
  }

  const handleTrack = async (item) => {
    const message = await trackMediumStory(item)
    if (message) {
      toast.error(message)
      return
    }
    setUntracked((prev) => prev.filter((i) => i.url !== item.url))
    toast.success("Added as a private draft you can edit")
    fetchPosts()
  }

  const published = posts.filter((p) => p.status === "published").length
  const drafts = posts.length - published

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {published} published &middot; {drafts} draft{drafts === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSync} disabled={syncing}>
            {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Check Medium
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            New post
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex rounded-lg border border-border p-0.5 text-sm">
          {[
            { key: "all", label: `All (${posts.length})` },
            { key: "not_on_medium", label: `Not on Medium (${posts.filter((p) => !onMedium(p)).length})` },
            { key: "on_medium", label: `On Medium (${posts.filter(onMedium).length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                filter === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {untracked.length > 0 && (
        <Card>
          <CardContent className="space-y-3 py-4">
            <p className="text-sm font-medium text-foreground">
              Live on Medium but not tracked here ({untracked.length})
            </p>
            <ul className="divide-y divide-border">
              {untracked.map((item) => (
                <li key={item.url} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                  <a href={item.url} target="_blank" rel="noreferrer" className="truncate hover:text-primary">
                    {item.title}
                  </a>
                  <Button variant="outline" size="sm" onClick={() => handleTrack(item)}>
                    Track it
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {visible.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">
              {posts.length === 0 ? "No posts yet" : "No posts match that search"}
            </p>
            {posts.length === 0 && (
              <p className="max-w-sm text-sm text-muted-foreground">
                Create your first post and it will appear on your public blog once published.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((post) => (
            <Card key={post.id} className="group transition-colors hover:border-primary/40">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/mfiadmin/blog/${post.id}`}
                      className="truncate text-lg font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    {post.status === "published" ? (
                      <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10">
                        <CheckCircle2 className="h-3 w-3" />
                        On my blog
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Draft
                      </Badge>
                    )}
                    <MediumStatusBadge status={post.medium_status} />
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    /blog/{post.slug}
                  </p>
                  {post.status === "published" && (
                    <div className="mt-2">
                      <PostStats slug={post.slug} compact />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {post.status === "published" && (
                    <Button variant="ghost" size="icon" asChild title="View live">
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild title="Edit">
                    <Link href={`/mfiadmin/blog/${post.id}`}>
                      <PenLine className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(post)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
