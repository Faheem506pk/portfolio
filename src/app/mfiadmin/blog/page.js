"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2, RefreshCw } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { MediumStatusBadge } from "@/components/admin/medium-status-badge"
import { PostStats } from "@/components/admin/post-stats"
import { syncWithMedium, trackMediumStory } from "@/lib/medium-sync"

function formatDate(value) {
  if (!value) return ""
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function PostsList() {
  const router = useRouter()
  const params = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [view, setView] = useState("all") // all | published | draft | not_on_medium
  const [syncing, setSyncing] = useState(false)
  const [untracked, setUntracked] = useState([])
  const autoCreated = useRef(false)

  async function fetchPosts() {
    const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false })
    if (error) setError(error.message)
    else setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    let alive = true
    supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (!alive) return
        if (error) setError(error.message)
        else setPosts(data || [])
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title: "Untitled post", slug: `untitled-${Date.now()}`, status: "draft" }])
      .select("id")
      .single()
    setCreating(false)
    if (error) return setError(error.message)
    router.push(`/mfiadmin/blog/${data.id}`)
  }

  // "New > Blog post" in the admin bar links here with ?new=1.
  useEffect(() => {
    if (params.get("new") === "1" && !autoCreated.current) {
      autoCreated.current = true
      const id = requestAnimationFrame(() => handleCreate())
      return () => cancelAnimationFrame(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from("posts").delete().eq("id", post.id)
    if (error) setError(error.message)
    else setPosts((prev) => prev.filter((p) => p.id !== post.id))
  }

  const onMedium = (p) => p.medium_status === "published_on_medium"
  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status !== "published").length,
    not_on_medium: posts.filter((p) => !onMedium(p)).length,
  }

  const visible = posts.filter((post) => {
    if (!post.title.toLowerCase().includes(query.toLowerCase())) return false
    if (view === "published") return post.status === "published"
    if (view === "draft") return post.status !== "published"
    if (view === "not_on_medium") return !onMedium(post)
    return true
  })

  const handleSync = async () => {
    setSyncing(true)
    const result = await syncWithMedium(posts)
    setSyncing(false)
    if (result.error) return toast.error(result.error)
    setUntracked(result.untracked)
    toast.success(result.updated ? `Marked ${result.updated} post${result.updated === 1 ? "" : "s"} as published on Medium` : "Checked Medium. No new matches.")
    if (result.updated) fetchPosts()
  }

  const handleTrack = async (item) => {
    const message = await trackMediumStory(item)
    if (message) return toast.error(message)
    setUntracked((prev) => prev.filter((i) => i.url !== item.url))
    toast.success("Added as a private draft you can edit")
    fetchPosts()
  }

  const views = [
    { key: "all", label: "All" },
    { key: "published", label: "Live on blog" },
    { key: "draft", label: "Drafts" },
    { key: "not_on_medium", label: "Not on Medium" },
  ]

  return (
    <div>
      <div className="wp-heading">
        <h1>Posts</h1>
        <button type="button" className="wp-btn-add" onClick={handleCreate} disabled={creating}>
          {creating ? "Creating" : "Add New"}
        </button>
        <button type="button" className="wp-btn-add" onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          Check Medium
        </button>
      </div>

      {error && <div className="wp-notice error">{error}</div>}

      {untracked.length > 0 && (
        <div className="wp-notice warn">
          <strong>Live on Medium but not tracked here ({untracked.length})</strong>
          <ul className="mt-1 list-none p-0">
            {untracked.map((item) => (
              <li key={item.url} className="flex flex-wrap items-center justify-between gap-2 py-1">
                <a href={item.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {item.title}
                </a>
                <button type="button" className="text-primary hover:underline" onClick={() => handleTrack(item)}>
                  Track it
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="wp-views">
        {views.map((v) => (
          <li key={v.key}>
            <button type="button" aria-current={view === v.key} onClick={() => setView(v.key)}>
              {v.label} <span className="count">({counts[v.key]})</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-2 flex justify-end">
        <label className="sr-only" htmlFor="post-search">
          Search posts
        </label>
        <input
          id="post-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts"
          className="h-8 w-60 border bg-card px-2 text-[13px]"
        />
      </div>

      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">On your blog</th>
              <th scope="col">On Medium</th>
              <th scope="col">Tags</th>
              <th scope="col">Last modified</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="muted">
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Loading
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="muted">
                  {posts.length === 0 ? "No posts yet. Use Add New to write the first one." : "No posts match."}
                </td>
              </tr>
            ) : (
              visible.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/mfiadmin/blog/${post.id}`} className="row-title">
                      {post.title}
                    </Link>
                    <div className="row-actions">
                      <Link href={`/mfiadmin/blog/${post.id}`}>Edit</Link>
                      {post.status === "published" && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                          View
                        </a>
                      )}
                      {post.medium_url && (
                        <a href={post.medium_url} target="_blank" rel="noreferrer">
                          Medium
                        </a>
                      )}
                      <button type="button" className="delete" onClick={() => handleDelete(post)}>
                        Delete
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`wp-status ${post.status === "published" ? "ok" : ""}`}>{post.status === "published" ? "Live" : "Draft"}</span>
                    {post.status === "published" && (
                      <div className="mt-1">
                        <PostStats slug={post.slug} compact />
                      </div>
                    )}
                  </td>
                  <td>
                    <MediumStatusBadge status={post.medium_status} />
                  </td>
                  <td className="muted">{(post.tags || []).join(", ")}</td>
                  <td className="muted">{formatDate(post.updated_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminBlogPage() {
  return (
    <Suspense fallback={null}>
      <PostsList />
    </Suspense>
  )
}
