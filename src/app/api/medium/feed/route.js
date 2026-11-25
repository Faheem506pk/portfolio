import { NextResponse } from "next/server"
import { MEDIUM_HANDLE } from "@/lib/story-pipeline"

// Public Medium RSS feed for the author's profile. No credentials involved.
// Medium returns only the most recent stories (about ten), which is enough to detect what is live.
export const revalidate = 300

function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  if (!m) return ""
  return decode(m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim())
}

// Titles in the feed can carry HTML entities (for example &amp;), which would break title matching.
function decode(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

export async function GET() {
  try {
    const res = await fetch(`https://medium.com/feed/${MEDIUM_HANDLE}`, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio admin feed check)" },
      next: { revalidate: 300 },
    })
    if (!res.ok) return NextResponse.json({ items: [], error: `Medium returned ${res.status}` }, { status: 200 })
    const xml = await res.text()
    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map((m) => {
      const block = m[1]
      const link = pick(block, "link").split("?")[0]
      return { title: pick(block, "title"), url: link, publishedAt: pick(block, "pubDate") }
    })
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ items: [], error: "Could not reach Medium" }, { status: 200 })
  }
}
