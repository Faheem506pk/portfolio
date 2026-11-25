"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { AlertTriangle, CheckCircle2, FileText, FolderGit2, Inbox, Loader2, Trophy, Wrench } from "lucide-react"

import { supabase } from "@/lib/supabase"

// A WordPress-style box: header bar with a title, then the body.
export function Postbox({ title, action, children }) {
  return (
    <section className="wp-postbox" aria-label={title}>
      <div className="wp-postbox-head">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="wp-postbox-body">{children}</div>
    </section>
  )
}

// `head: true` returns only the count, so these stay cheap.
async function countRows(table, apply) {
  let query = supabase.from(table).select("*", { count: "exact", head: true })
  if (apply) query = apply(query)
  const { count, error } = await query
  // A missing table (migration not yet applied) should not break the dashboard.
  if (error) return null
  return count ?? 0
}

export function AtAGlance() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.all([
      countRows("posts", (q) => q.eq("status", "published")),
      countRows("posts", (q) => q.eq("status", "draft")),
      countRows("projects"),
      countRows("skills"),
      countRows("achievements"),
      countRows("messages", (q) => q.eq("is_read", false)),
      countRows("posts", (q) => q.eq("medium_status", "published_on_medium")),
    ]).then(([published, drafts, projects, skills, achievements, unread, onMedium]) => {
      if (alive) setStats({ published, drafts, projects, skills, achievements, unread, onMedium })
    })
    return () => {
      alive = false
    }
  }, [])

  const plural = (n, one, many) => `${n ?? 0} ${n === 1 ? one : many}`

  return (
    <Postbox title="At a Glance">
      {!stats ? (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading
        </p>
      ) : (
        <>
          <ul className="wp-glance">
            <li>
              <Link href="/mfiadmin/blog">
                <FileText aria-hidden="true" />
                {plural(stats.published, "post live", "posts live")}
              </Link>
            </li>
            <li>
              <Link href="/mfiadmin/blog">
                <FileText aria-hidden="true" />
                {plural(stats.drafts, "draft", "drafts")}
              </Link>
            </li>
            <li>
              <Link href="/mfiadmin/projects">
                <FolderGit2 aria-hidden="true" />
                {plural(stats.projects, "project", "projects")}
              </Link>
            </li>
            <li>
              <Link href="/mfiadmin/skills">
                <Wrench aria-hidden="true" />
                {plural(stats.skills, "skill category", "skill categories")}
              </Link>
            </li>
            <li>
              <Link href="/mfiadmin/achievements">
                <Trophy aria-hidden="true" />
                {plural(stats.achievements, "achievement", "achievements")}
              </Link>
            </li>
            <li>
              <Link href="/mfiadmin/messages">
                <Inbox aria-hidden="true" />
                {stats.unread ? `${stats.unread} unread` : "No unread messages"}
              </Link>
            </li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            {stats.onMedium === null ? "Medium tracking needs the latest database update." : `${stats.onMedium} tracked ${stats.onMedium === 1 ? "story is" : "stories are"} live on Medium.`}
          </p>
        </>
      )}
    </Postbox>
  )
}

export function SiteHealth() {
  const [issues, setIssues] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      const found = []
      const { data: posts } = await supabase
        .from("posts")
        .select("id, title, meta_description, cover_image_url")
        .eq("status", "published")
      ;(posts || []).forEach((post) => {
        if (!post.meta_description) found.push({ level: "warn", text: `"${post.title}" has no meta description`, href: `/mfiadmin/blog/${post.id}` })
        if (!post.cover_image_url) found.push({ level: "info", text: `"${post.title}" has no cover image`, href: `/mfiadmin/blog/${post.id}` })
      })
      const { data: projects } = await supabase.from("projects").select("id, name, image_url, images")
      ;(projects || []).forEach((project) => {
        const hasImage = project.image_url || (project.images && project.images.length > 0)
        if (!hasImage) found.push({ level: "info", text: `Project "${project.name}" has no image`, href: "/mfiadmin/projects" })
      })
      if (alive) setIssues(found)
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  return (
    <Postbox
      title="Content health"
      action={<span className="muted text-muted-foreground">{issues ? `${issues.length} item${issues.length === 1 ? "" : "s"}` : ""}</span>}
    >
      {!issues ? (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking
        </p>
      ) : issues.length === 0 ? (
        <p className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" /> Everything looks complete.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {issues.slice(0, 8).map((issue, i) => (
            <li key={i} className="border-b border-border py-1.5 last:border-0">
              <Link href={issue.href} className="flex items-start gap-2 hover:underline">
                <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${issue.level === "warn" ? "text-primary" : "text-muted-foreground"}`} />
                <span>{issue.text}</span>
              </Link>
            </li>
          ))}
          {issues.length > 8 && <li className="pt-1.5 text-muted-foreground">and {issues.length - 8} more</li>}
        </ul>
      )}
    </Postbox>
  )
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// Same idea as WordPress "Quick Draft": a title and a few notes become a draft post.
export function QuickDraft() {
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error("Give the draft a title first.")
    setSaving(true)
    const { error } = await supabase.from("posts").insert([
      { title: title.trim(), slug: `${slugify(title).slice(0, 70) || "draft"}-${Date.now()}`, content: notes, status: "draft" },
    ])
    setSaving(false)
    if (error) return toast.error(error.message)
    setTitle("")
    setNotes("")
    toast.success("Draft saved. Find it under Posts.")
  }

  return (
    <Postbox title="Quick Draft">
      <form onSubmit={save} className="space-y-3">
        <div>
          <label htmlFor="qd-title" className="mb-1 block font-medium">
            Title
          </label>
          <input
            id="qd-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 w-full border bg-background px-2 text-[13px]"
          />
        </div>
        <div>
          <label htmlFor="qd-notes" className="mb-1 block font-medium">
            Notes
          </label>
          <textarea
            id="qd-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="What is on your mind?"
            className="w-full border bg-background px-2 py-1.5 text-[13px]"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-8 items-center border border-primary bg-primary px-3 text-[13px] text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving" : "Save draft"}
        </button>
      </form>
    </Postbox>
  )
}
