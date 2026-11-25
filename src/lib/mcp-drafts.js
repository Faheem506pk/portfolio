import crypto from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { mediumPolicyChecks, normalizeTitle, wordCount } from "@/lib/story-pipeline"
import { SITE_URL } from "@/lib/posts"

// Remote MCP server (Streamable HTTP, stateless) that can do exactly two things:
//   1. create_medium_draft: save a draft story that passes the Medium policy checks, as a PRIVATE DRAFT only
//   2. get_draft_quota: say how many drafts are left today
// It cannot publish, read, edit or delete anything. Defense in depth: fail-closed bearer auth, no browser
// origins, strict input validation, policy gate, daily and burst limits enforced in the database, audit log.

export const DAY_MAX = 100
export const MINUTE_MAX = 10
const MAX_BODY_BYTES = 200_000
const SUPPORTED_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"]

const sha256 = (value) => crypto.createHash("sha256").update(value).digest()

// Constant-time comparison against the configured tokens (current and next, for rotation).
export function verifyToken(presented) {
  const configured = [process.env.MCP_API_TOKEN, process.env.MCP_API_TOKEN_NEXT].filter((t) => t && t.length >= 32)
  if (configured.length === 0 || !presented) return null // fail closed: no valid token configured, no access
  const digest = sha256(presented)
  let match = false
  for (const token of configured) {
    if (crypto.timingSafeEqual(digest, sha256(token))) match = true
  }
  return match ? { clientId: digest.toString("hex").slice(0, 12) } : null
}

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
}

function json(status, body, extra = {}) {
  return new Response(body === null ? null : JSON.stringify(body), { status, headers: { ...HEADERS, ...extra } })
}

const rpcError = (id, code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } })
const rpcResult = (id, result) => ({ jsonrpc: "2.0", id, result })
const textResult = (text, isError = false) => ({ content: [{ type: "text", text }], isError })

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

const TOOLS = [
  {
    name: "create_medium_draft",
    title: "Create a Medium draft",
    description:
      "Saves ONE story as a private draft in the author's admin, ready to copy into Medium. It never publishes. " +
      "The story must follow Medium's rules: if any text was written or rewritten by AI, set ai_assisted to true and put a disclosure " +
      "sentence in the first two paragraphs (for example 'This story was written with the assistance of an AI writing program.'). " +
      "Never mention the author's employer or client projects. Resolve every [FILL] or [AUTHOR] note first. Limit: 100 drafts per day.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["title", "content_markdown", "tags", "ai_assisted"],
      properties: {
        title: { type: "string", minLength: 10, maxLength: 120, description: "Specific, honest title. No clickbait." },
        subtitle: { type: "string", maxLength: 200, description: "One sentence subtitle (optional)." },
        content_markdown: { type: "string", minLength: 200, maxLength: 60000, description: "The full story in Markdown, at least 300 words." },
        tags: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", minLength: 2, maxLength: 30 }, description: "1 to 5 Medium tags." },
        ai_assisted: { type: "boolean", description: "true if any AI-written or AI-rewritten text remains." },
      },
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  },
  {
    name: "get_draft_quota",
    title: "Draft quota for today",
    description: "Read-only. Returns how many drafts were saved today (UTC) and how many remain out of 100.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
]

function slugify(value = "") {
  return value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

// Names the author never wants in his stories (employer and client projects). Extend with MCP_FORBIDDEN_TERMS.
function forbiddenTerms() {
  const extra = (process.env.MCP_FORBIDDEN_TERMS || "").split(",").map((t) => t.trim()).filter(Boolean)
  return ["TabTake", "Speedy Eats", "BikeBox", "JUHUU Marketplace", "Qotion", "Zaplead", ...extra]
}

const DANGEROUS_HTML = /<\s*(script|iframe|object|embed|form|style|link|meta)\b/i

function validateDraft(args) {
  const errors = []
  const a = args && typeof args === "object" ? args : {}
  const allowed = new Set(["title", "subtitle", "content_markdown", "tags", "ai_assisted"])
  Object.keys(a).forEach((k) => !allowed.has(k) && errors.push(`Unknown field "${k}".`))

  const title = typeof a.title === "string" ? a.title.trim() : ""
  if (title.length < 10 || title.length > 120 || /[\r\n]/.test(title)) errors.push("title must be 10 to 120 characters on one line.")
  const subtitle = a.subtitle === undefined ? "" : typeof a.subtitle === "string" ? a.subtitle.trim() : null
  if (subtitle === null || subtitle.length > 200 || /[\r\n]/.test(subtitle || "")) errors.push("subtitle must be one line of up to 200 characters.")
  const content = typeof a.content_markdown === "string" ? a.content_markdown.replace(/\u0000/g, "").trim() : ""
  if (content.length < 200 || content.length > 60000) errors.push("content_markdown must be 200 to 60,000 characters.")
  else if (wordCount(content) < 300) errors.push("content_markdown must be at least 300 words.")
  const haystack = `${title} ${subtitle || ""} ${content}`.toLowerCase()
  const hits = forbiddenTerms().filter((t) => haystack.includes(t.toLowerCase()))
  if (hits.length) errors.push(`Mentions employer or client project names the author does not allow: ${hits.join(", ")}.`)
  if (DANGEROUS_HTML.test(content)) errors.push("Raw HTML such as script, iframe, form or style is not allowed. Use Markdown.")
  const tags = Array.isArray(a.tags) ? [...new Set(a.tags.map((t) => (typeof t === "string" ? t.trim() : "")))] : []
  if (tags.length < 1 || tags.length > 5 || tags.some((t) => !/^[A-Za-z0-9][A-Za-z0-9 .+#-]{1,29}$/.test(t))) errors.push("tags must be 1 to 5 plain tags of 2 to 30 characters.")
  if (typeof a.ai_assisted !== "boolean") errors.push("ai_assisted must be true or false.")

  return { errors, value: { title, subtitle: subtitle || "", content, tags, ai_assisted: a.ai_assisted === true } }
}

async function createDraft(args, client) {
  const { errors, value } = validateDraft(args)
  if (errors.length) return textResult(`Rejected: ${errors.join(" ")}`, true)

  // Medium policy gate (same checks as the admin editor). Errors block, warnings are returned.
  const issues = mediumPolicyChecks({
    title: value.title,
    content: value.content,
    tags: value.tags,
    ai_assisted: value.ai_assisted,
    paywall: false,
    cover_image_url: "set-in-admin",
    medium_status: "not_on_medium",
  })
  const blocking = issues.filter((i) => i.level === "error")
  if (blocking.length) return textResult(`Rejected by the Medium policy check: ${blocking.map((i) => i.text).join(" ")}`, true)
  const warnings = issues.filter((i) => i.level === "warn").map((i) => i.text)

  const supabase = db()
  if (!supabase) return textResult("The draft service is not configured.", true)

  // Duplicate guard before spending quota.
  const { data: existing, error: dupError } = await supabase.from("posts").select("id, title").ilike("title", value.title.replace(/[%_]/g, "")).limit(5)
  if (dupError) return textResult("The draft service is unavailable right now.", true)
  if ((existing || []).some((p) => normalizeTitle(p.title) === normalizeTitle(value.title))) {
    return textResult("Rejected: a post with the same title already exists. Choose a different title.", true)
  }

  const { data: slotOk, error: slotError } = await supabase.rpc("mcp_take_slot", { day_max: DAY_MAX, minute_max: MINUTE_MAX })
  if (slotError) {
    console.error("mcp_take_slot failed:", slotError.message)
    return textResult("The draft service is not ready (database update pending).", true)
  }
  if (!slotOk) return textResult(`Limit reached: at most ${DAY_MAX} drafts per day and ${MINUTE_MAX} per minute. Try again later.`, true)

  const slug = `${slugify(value.title).slice(0, 70) || "draft"}-${Date.now().toString(36)}`
  const { data: post, error: insertError } = await supabase
    .from("posts")
    .insert([
      {
        title: value.title,
        slug,
        excerpt: value.subtitle || null,
        content: value.content,
        tags: value.tags,
        status: "draft",
        medium_status: "not_on_medium",
        ai_assisted: value.ai_assisted,
        paywall: false,
        noindex: true,
      },
    ])
    .select("id")
    .single()
  if (insertError) {
    console.error("draft insert failed:", insertError.message)
    await supabase.rpc("mcp_release_slot")
    return textResult("The draft could not be saved.", true)
  }

  await supabase.from("mcp_draft_log").insert([{ client_id: client.clientId, post_id: post.id, title: value.title }])
  const { data: used } = await supabase.rpc("mcp_quota")
  const remaining = Math.max(0, DAY_MAX - (Number(used) || 0))
  return textResult(
    JSON.stringify({
      saved: true,
      status: "draft",
      post_id: post.id,
      open_in_admin: `${SITE_URL}/mfiadmin/blog/${post.id}`,
      remaining_today: remaining,
      warnings,
      next_step: "The author reviews it in the admin, copies it into Medium and publishes it himself.",
    })
  )
}

async function quota() {
  const supabase = db()
  if (!supabase) return textResult("The draft service is not configured.", true)
  const { data, error } = await supabase.rpc("mcp_quota")
  if (error) return textResult("The draft service is not ready (database update pending).", true)
  const used = Number(data) || 0
  return textResult(JSON.stringify({ limit_per_day: DAY_MAX, used_today: used, remaining_today: Math.max(0, DAY_MAX - used), limit_per_minute: MINUTE_MAX }))
}

// Entry point for the route handler.
export async function handleMcpRequest(request) {
  // Not for browsers: no CORS, and any Origin header is refused (protects against DNS rebinding).
  if (request.headers.get("origin")) return json(403, { error: "Browser origins are not allowed." })
  if (request.method !== "POST") return json(405, { error: "Use POST." }, { Allow: "POST" })

  const auth = request.headers.get("authorization") || ""
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : ""
  const client = verifyToken(bearer)
  if (!client) {
    await new Promise((r) => setTimeout(r, 400)) // slows down guessing
    return json(401, { error: "Unauthorized." }, { "WWW-Authenticate": 'Bearer realm="medium-drafts"' })
  }

  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) return json(415, { error: "Send application/json." })
  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "Request too large." })

  let message
  try {
    message = JSON.parse(raw)
  } catch {
    return json(400, rpcError(null, -32700, "Parse error"))
  }
  if (!message || Array.isArray(message) || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return json(400, rpcError(message?.id, -32600, "Invalid request"))
  }

  const { id, method, params } = message
  const isNotification = id === undefined
  if (isNotification) return new Response(null, { status: 202, headers: HEADERS }) // notifications need no reply

  switch (method) {
    case "initialize": {
      const asked = params?.protocolVersion
      return json(200, rpcResult(id, {
        protocolVersion: SUPPORTED_VERSIONS.includes(asked) ? asked : SUPPORTED_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "medium-drafts", version: "1.0.0" },
        instructions: "Only creates private Medium drafts. It never publishes. 100 drafts per day.",
      }))
    }
    case "ping":
      return json(200, rpcResult(id, {}))
    case "tools/list":
      return json(200, rpcResult(id, { tools: TOOLS }))
    case "tools/call": {
      const name = params?.name
      if (name === "create_medium_draft") return json(200, rpcResult(id, await createDraft(params?.arguments, client)))
      if (name === "get_draft_quota") return json(200, rpcResult(id, await quota()))
      return json(200, rpcError(id, -32602, "Unknown tool"))
    }
    default:
      return json(200, rpcError(id, -32601, "Method not found"))
  }
}
