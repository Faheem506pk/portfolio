// Shared constants and pure helpers for the content studio (Medium tracking + writing pipeline).

export const MEDIUM_HANDLE = "@faheem506pk"
export const MEDIUM_PROFILE_URL = "https://faheem506pk.medium.com"

export const MEDIUM_STATUSES = [
  { value: "not_on_medium", label: "Not on Medium" },
  { value: "draft_on_medium", label: "Draft on Medium" },
  { value: "published_on_medium", label: "Published on Medium" },
]

// Writing pipeline, in order. `label` is what the author sees.
export const PIPELINE_STATUSES = [
  { value: "idea", label: "Idea", tone: "neutral", hint: "Researched, can start from sources" },
  { value: "needs_details", label: "Needs my details", tone: "warning", hint: "Waiting for your real experience" },
  { value: "drafting", label: "Writing", tone: "primary", hint: "You are writing the story" },
  { value: "review", label: "Review", tone: "info", hint: "Fact-check, policy check and edit" },
  { value: "ready", label: "Ready to publish", tone: "success", hint: "Final text, publish on Medium yourself" },
  { value: "published", label: "Published", tone: "success", hint: "Live on Medium" },
]

export function normalizeTitle(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

export function wordCount(markdown = "") {
  return markdown.trim().split(/\s+/).filter(Boolean).length
}

const CLICKBAIT = /(you won't believe|shocking|insane|mind-?blowing|will blow|changed my life|secret trick)/i
const MEDIUM_META = /(medium partner program|earn(ing)? (money )?on medium|boost(ed)? (story|stories)|medium curation|grow (on )?medium)/i
const DISCLOSURE =
  /(assistance of an ai|written with (the )?(help|assistance) of|ai writing program|ai-assisted|ai assistance)/i

/**
 * Pre-publish checks against Medium's published rules (see skills/medium-policy in the repo).
 * Heuristics only: a pass is not a guarantee. Returns [{ level: "error"|"warn"|"info", text }].
 */
export function mediumPolicyChecks(post) {
  const issues = []
  const content = post.content || ""
  const title = (post.title || "").trim()
  const tags = post.tags || []
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#"))
  const topOfStory = paragraphs.slice(0, 3).join(" ")

  if (!title || /^untitled/i.test(title)) issues.push({ level: "error", text: "Add a real title." })
  if (title.length > 100) issues.push({ level: "warn", text: "Title is over 100 characters. Keep it specific and short." })
  if (CLICKBAIT.test(title)) issues.push({ level: "warn", text: "Title looks sensational. Medium penalizes clickbait." })

  if (post.ai_assisted && !DISCLOSURE.test(topOfStory)) {
    issues.push({
      level: "error",
      text: "AI-assisted text needs a disclosure sentence in the first two paragraphs, or Medium limits it to your followers.",
    })
  }
  if (post.ai_assisted && post.paywall) {
    issues.push({
      level: "error",
      text: "AI-generated writing cannot be paywalled. Only paywall text that is substantially your own.",
    })
  }
  if (MEDIUM_META.test(content) || MEDIUM_META.test(title)) {
    issues.push({
      level: post.paywall ? "error" : "info",
      text: post.paywall
        ? "Stories about Medium itself cannot be paywalled."
        : "Stories about Medium itself get Network Distribution only. Tag it medium-meta.",
    })
  }
  if (tags.length > 5) issues.push({ level: "warn", text: `${tags.length} tags. Medium allows 5.` })
  if (/\[(FILL|AUTHOR)[^\]]*\]/i.test(content)) {
    issues.push({ level: "error", text: "Unresolved [FILL] or [AUTHOR] notes in the text." })
  }
  if (/[\u2014\u2013]/.test(content)) issues.push({ level: "info", text: "Contains em or en dashes (your style rule says none)." })
  if (/[a-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.[a-z]{2,}/i.test(content) || /\b03\d{2}[-\s]?\d{7}\b/.test(content)) {
    issues.push({ level: "error", text: "Personal email or phone number found. Remove it." })
  }
  if (/(api[_-]?key|secret|password|token)\s*[:=]\s*\S+/i.test(content)) {
    issues.push({ level: "error", text: "Possible secret in the text or code. Remove it." })
  }
  if (/!\[\]\(/.test(content)) issues.push({ level: "warn", text: "An image has no alt text." })
  if (/(utm_|affiliate|amzn\.to|[?&]ref=)/i.test(content)) {
    issues.push({ level: "warn", text: "Possible affiliate or tracking link. Disclose affiliate links." })
  }
  const words = wordCount(content)
  if (words > 0 && words < 800) issues.push({ level: "info", text: `${words} words. 1,500 to 2,500 tends to do best.` })
  if (!post.cover_image_url) issues.push({ level: "info", text: "No cover image. Use your own or a licensed one, and caption AI images." })
  if (post.medium_status === "published_on_medium" && !post.medium_url) {
    issues.push({ level: "warn", text: "Marked published on Medium but no Medium URL saved." })
  }
  return issues
}
