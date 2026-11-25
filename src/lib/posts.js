import { createClient } from "@supabase/supabase-js"

export const SITE_URL = "https://faheem506pk.vercel.app"

// Server-side reads. The anon key is enough: RLS only exposes published posts
// to unauthenticated callers, so drafts can never leak through these helpers.
// Returns null when the environment variables are missing (for example a Vercel preview without Supabase
// settings) so the build and the blog pages degrade to "no posts" instead of crashing.
function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key ? createClient(url, key) : null
}

const LIST_FIELDS = "slug, title, excerpt, cover_image_url, tags, published_at, updated_at"

export async function getPublishedPosts() {
  const db = client()
  if (!db) return []
  const { data, error } = await db
    .from("posts")
    .select(LIST_FIELDS)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Failed to load posts:", error.message)
    return []
  }
  return data ?? []
}

export async function getPostBySlug(slug) {
  const db = client()
  if (!db) return null
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) {
    console.error(`Failed to load post "${slug}":`, error.message)
    return null
  }
  return data
}

export function readingMinutes(markdown = "") {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 225))
}

export function formatPostDate(value) {
  if (!value) return ""
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function postUrl(slug) {
  return `${SITE_URL}/blog/${slug}`
}
