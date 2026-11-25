import { supabase } from "@/lib/supabase"
import { normalizeTitle } from "@/lib/story-pipeline"

// Compares the public Medium feed with tracked posts and marks matches as published on Medium.
// Returns { updated, untracked, error }. Untracked = live on Medium but not in the admin yet.
export async function syncWithMedium(posts) {
  let feed
  try {
    const res = await fetch("/api/medium/feed", { cache: "no-store" })
    feed = await res.json()
  } catch {
    return { updated: 0, untracked: [], error: "Could not reach the Medium feed" }
  }
  if (feed.error) return { updated: 0, untracked: [], error: feed.error }

  const byTitle = new Map(posts.map((p) => [normalizeTitle(p.title), p]))
  let updated = 0
  const untracked = []

  for (const item of feed.items || []) {
    const post = byTitle.get(normalizeTitle(item.title))
    if (!post) {
      untracked.push(item)
      continue
    }
    if (post.medium_status === "published_on_medium" && post.medium_url) continue
    const { error } = await supabase
      .from("posts")
      .update({
        medium_status: "published_on_medium",
        medium_url: item.url,
        medium_published_at: item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date().toISOString(),
      })
      .eq("id", post.id)
    if (error) return { updated, untracked, error: error.message }
    updated += 1
  }
  return { updated, untracked, error: null }
}

// Adds a Medium story that exists online to the admin as a private draft (never published on your blog).
export async function trackMediumStory(item) {
  const slug = `medium-${normalizeTitle(item.title).replace(/\s+/g, "-").slice(0, 60)}-${Date.now()}`
  const { error } = await supabase.from("posts").insert([
    {
      title: item.title,
      slug,
      status: "draft",
      content: "",
      medium_status: "published_on_medium",
      medium_url: item.url,
      medium_published_at: item.publishedAt ? new Date(item.publishedAt).toISOString() : null,
    },
  ])
  return error ? error.message : null
}
