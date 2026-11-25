#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.env.AUTHOR_STUDIO_ROOT ?? path.join(here, "..", "..", ".."));
const AUTHOR = path.join(ROOT, "author");
const SKILLS = path.join(ROOT, "skills");
const DRAFTS = path.join(ROOT, "drafts");

const PLATFORMS = ["medium", "linkedin", "x", "youtube", "brief", "sources"] as const;
const PLATFORM_SKILL: Record<string, string> = {
  topic: "topic-research",
  medium: "medium-writer",
  linkedin: "linkedin-post",
  x: "x-thread",
  youtube: "youtube-script",
  pipeline: "content-pipeline",
};
const FILE_FOR: Record<(typeof PLATFORMS)[number], string> = {
  medium: "medium.md",
  linkedin: "linkedin.md",
  x: "x-thread.md",
  youtube: "youtube.md",
  brief: "brief.md",
  sources: "sources.md",
};

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const fail = (t: string) => ({ content: [{ type: "text" as const, text: t }], isError: true });

async function readOrNull(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

const slugSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]{1,60}$/, "slug: lowercase letters, digits, hyphens, 2 to 61 chars");

const server = new McpServer({ name: "author-studio", version: "0.1.0" });

server.tool(
  "get_author_profile",
  "Confirmed facts about the author (name, role, timeline, stack, projects, profile URLs). Call this first before writing anything for him. Never invent facts beyond this.",
  {},
  async () => {
    const t = await readOrNull(path.join(AUTHOR, "facts.json"));
    return t ? text(t) : fail("author/facts.json not found");
  },
);

server.tool(
  "get_voice_guide",
  "The author's voice, habits to fix, and hard writing rules (no em dashes, no invented details).",
  {},
  async () => {
    const t = await readOrNull(path.join(AUTHOR, "voice.md"));
    return t ? text(t) : fail("author/voice.md not found");
  },
);

server.tool(
  "get_strategy",
  "Audience, goals, content pillars and distribution plan.",
  {},
  async () => {
    const t = await readOrNull(path.join(AUTHOR, "goals-and-strategy.md"));
    return t ? text(t) : fail("author/goals-and-strategy.md not found");
  },
);

server.tool(
  "list_published_stories",
  "Stories already published on Medium. Check before proposing a topic. Link to existing stories instead of retelling them.",
  {},
  async () => {
    const t = await readOrNull(path.join(AUTHOR, "stories-index.md"));
    return t ? text(t) : fail("author/stories-index.md not found");
  },
);

server.tool(
  "get_medium_policy",
  "Medium rules, AI policy, distribution, paywall and the pre-publish gate. Read before drafting or handing over any story.",
  {},
  async () => {
    const t = await readOrNull(path.join(SKILLS, "medium-policy", "SKILL.md"));
    return t ? text(t) : fail("skills/medium-policy/SKILL.md not found");
  },
);

function words(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}
function shingles(t: string, n = 5) {
  const w = words(t);
  const s = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(" "));
  return s;
}

server.tool(
  "check_medium_policy",
  "Heuristic Medium policy check for a story: AI disclosure in first two paragraphs, tags, mentions, clickbait title, forms, affiliate, privacy, meta-Medium topic, and similarity to existing drafts and articles. Signals only, not a guarantee. Read get_medium_policy for the full gate.",
  {
    content: z.string().min(1).max(200_000).describe("Full story markdown"),
    aiAssisted: z.boolean().default(true).describe("true if any text was written or rewritten by AI"),
    plannedPaywall: z.boolean().default(false),
    tags: z.array(z.string()).max(20).optional(),
    selfPath: z.string().optional().describe("repo-relative path of this draft, excluded from similarity"),
  },
  async ({ content, aiAssisted, plannedPaywall, tags, selfPath }) => {
    const issues: string[] = [];
    const body = content.replace(/<!--[\s\S]*?-->/g, "");
    const paras = body.split(/\n{2,}/).map((p) => p.trim()).filter((p) => p && !p.startsWith("#"));
    const firstTwo = paras.slice(0, 3).join(" ").toLowerCase();
    if (aiAssisted && !/(assistance of an ai|written with (the )?(help|assistance) of|ai writing program|ai-assisted|ai assistance)/.test(firstTwo)) {
      issues.push("No AI disclosure sentence found near the top. Medium requires one in the first two paragraphs for AI-written or AI-assisted text, otherwise Network Only distribution.");
    }
    if (aiAssisted && plannedPaywall) issues.push("Paywall planned for AI-assisted text. AI-generated writing cannot be paywalled. Only paywall text that is substantially the author's own.");
    if (/medium partner program|earn(ing)? (money )?on medium|boost(ed)? (story|stories)|medium curation|grow (on )?medium/i.test(body)) {
      issues.push("Mentions Medium meta topics. Meta stories about Medium are Network Distribution and not paywall-eligible. Tag medium-meta.");
      if (plannedPaywall) issues.push("Do not paywall a Medium-focused story.");
    }
    const h1 = body.match(/^#\s+(.+)$/m)?.[1] ?? "";
    if (h1 && /(you won't believe|shocking|secret|insane|mind-?blowing|10x|changed my life|will blow)/i.test(h1)) issues.push("Title looks sensational. Boost and General Distribution penalize clickbait.");
    if (h1 && h1.length > 100) issues.push("Title is very long. Keep it specific and under about 100 characters.");
    if (tags && tags.length > 5) issues.push(`${tags.length} tags. Medium allows 5. Use fewer, relevant ones.`);
    const mentions = (body.match(/(^|\s)@[a-z0-9_.]{2,}/gi) ?? []).length;
    if (mentions > 5) issues.push(`${mentions} @mentions. Mass mentions disqualify General Distribution.`);
    if (/(utm_|affiliate|amzn\.to|\?ref=|aff=)/i.test(body)) issues.push("Possible affiliate or tracking links. Disclose affiliate links in the story and keep promotion first-party.");
    if (/<form|<iframe|typeform|forms\.gle|docs\.google\.com\/forms/i.test(body)) issues.push("Form or embed that may collect personal data. Not allowed on Medium. Link out clearly instead.");
    if (/[a-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.[a-z]{2,}/i.test(body) || /(\+?92\s?3\d{2}\s?\d{7}|03\d{2}[-\s]?\d{7})/.test(body)) issues.push("Personal email or phone number found. Remove it.");
    if (/(api[_-]?key|secret|password|token)\s*[:=]\s*\S+/i.test(body)) issues.push("Possible secret in text or code. Remove it.");
    if (/\[FILL|\[AUTHOR/i.test(body)) issues.push("Unresolved [FILL] or [AUTHOR] markers. Resolve before publishing.");
    const nonAscii = (body.match(/[\u0600-\u06FF]/g) ?? []).length;
    if (nonAscii > 50) issues.push("Large amount of Urdu text. Medium only curates English stories for General Distribution and Boost for now.");
    if (/(\u2014|\u2013)/.test(body)) issues.push("Em or en dash found. Author rule: remove.");
    const imgs = body.match(/!\[[^\]]*\]\([^)]*\)/g) ?? [];
    for (const im of imgs) if (!/!\[[^\]]+\]/.test(im)) issues.push("Image without alt text. Add alt text and credit.");
    // similarity to other drafts and articles
    const mine = shingles(body);
    const dup: string[] = [];
    for (const dir of [DRAFTS, path.join(ROOT, "articles")]) {
      const stack = [dir];
      while (stack.length) {
        const d = stack.pop()!;
        const ents = await fs.readdir(d, { withFileTypes: true }).catch(() => []);
        for (const e of ents) {
          const fp = path.join(d, e.name);
          if (e.isDirectory()) { stack.push(fp); continue; }
          if (!/\.md$/.test(e.name) || e.name === "brief.md") continue;
          const rel = path.relative(ROOT, fp);
          if (selfPath && rel === selfPath) continue;
          const other = await readOrNull(fp);
          if (!other) continue;
          const sh = shingles(other.replace(/<!--[\s\S]*?-->/g, ""));
          if (!sh.size || !mine.size) continue;
          let hit = 0;
          for (const g of mine) if (sh.has(g)) hit++;
          const ratio = hit / Math.min(mine.size, sh.size);
          if (ratio > 0.3) dup.push(`${rel} (${Math.round(ratio * 100)}% overlap)`);
        }
      }
    }
    if (dup.length) issues.push(`High overlap with: ${dup.join(", ")}. Duplicate or templated content violates Medium's spam rules.`);
    return text(issues.length ? `${issues.length} policy signal(s):\n- ${issues.join("\n- ")}` : "No policy signals found by the heuristic. Still run the full pre-publish gate in get_medium_policy and have the author read it.");
  },
);

server.tool(
  "get_topic_backlog",
  "Researched and scored story topics with status and what real details the author must supply. Check this before proposing or writing any story.",
  {},
  async () => {
    const t = await readOrNull(path.join(AUTHOR, "topic-backlog.md"));
    return t ? text(t) : fail("author/topic-backlog.md not found");
  },
);

server.tool(
  "get_lessons",
  "Lessons learned and the study queue. Read before every task and apply them.",
  {},
  async () => {
    const a = await readOrNull(path.join(AUTHOR, "lessons.md"));
    const b = await readOrNull(path.join(AUTHOR, "study-queue.md"));
    return text([a ?? "", b ?? ""].join("\n\n"));
  },
);

server.tool(
  "add_lesson",
  "Append one lesson to author/lessons.md or one item to author/study-queue.md. Append only. Never include secrets or personal contact details.",
  {
    kind: z.enum(["lesson", "study"]),
    area: z.string().min(2).max(40).describe("e.g. sources, writing, tools"),
    text: z.string().min(10).max(600),
  },
  async ({ kind, area, text: body }) => {
    if (/\u2014|\u2013/.test(body)) return fail("No em or en dashes. Rephrase.");
    if (/(api[_-]?key|secret|password|token)\s*[:=]/i.test(body)) return fail("Looks like a secret. Not stored.");
    const day = new Date().toISOString().slice(0, 10);
    const file = path.join(AUTHOR, kind === "lesson" ? "lessons.md" : "study-queue.md");
    const line = kind === "lesson" ? `- ${day} | ${area} | ${body}\n` : `- ${body} | added ${day} | area: ${area}\n`;
    await fs.appendFile(file, line, "utf8");
    return text(`Added to ${path.relative(ROOT, file)}`);
  },
);

server.tool(
  "list_open_questions",
  "Facts still unknown about the author. Ask him these instead of guessing.",
  {},
  async () => {
    const t = await readOrNull(path.join(AUTHOR, "questions-for-author.md"));
    return t ? text(t) : fail("author/questions-for-author.md not found");
  },
);

server.tool(
  "list_skills",
  "Available writing skills (name and description).",
  {},
  async () => {
    const entries = await fs.readdir(SKILLS, { withFileTypes: true }).catch(() => []);
    const out: string[] = [];
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const t = await readOrNull(path.join(SKILLS, e.name, "SKILL.md"));
      const m = t?.match(/^description:\s*(.+)$/m);
      out.push(`- ${e.name}: ${m?.[1] ?? ""}`);
    }
    out.push("- medium-editor: Review, score and fact-check Medium articles (root SKILL.md).");
    return text(out.join("\n"));
  },
);

server.tool(
  "get_platform_guide",
  "Full writing guide for a platform: medium, linkedin, x, youtube, or pipeline (end to end workflow). Also accepts a skill name.",
  { platform: z.string().describe("medium | linkedin | x | youtube | pipeline | editor | <skill name>") },
  async ({ platform }) => {
    if (platform === "editor" || platform === "medium-editor") {
      const t = await readOrNull(path.join(ROOT, "SKILL.md"));
      return t ? text(t) : fail("SKILL.md not found");
    }
    const skill = PLATFORM_SKILL[platform] ?? platform;
    if (!/^[a-z0-9-]+$/.test(skill)) return fail("invalid platform");
    const t = await readOrNull(path.join(SKILLS, skill, "SKILL.md"));
    return t ? text(t) : fail(`No guide for "${platform}"`);
  },
);

server.tool(
  "list_drafts",
  "List draft folders and the files inside them.",
  {},
  async () => {
    const dirs = await fs.readdir(DRAFTS, { withFileTypes: true }).catch(() => []);
    const out: string[] = [];
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      const files = await fs.readdir(path.join(DRAFTS, d.name));
      out.push(`${d.name}: ${files.join(", ")}`);
    }
    return text(out.length ? out.join("\n") : "No drafts yet.");
  },
);

server.tool(
  "read_draft",
  "Read one draft file.",
  { folder: z.string().describe("draft folder name"), platform: z.enum(PLATFORMS) },
  async ({ folder, platform }) => {
    if (!/^[a-z0-9-]+$/.test(folder)) return fail("invalid folder");
    const t = await readOrNull(path.join(DRAFTS, folder, FILE_FOR[platform]));
    return t ? text(t) : fail("draft not found");
  },
);

server.tool(
  "create_draft",
  "Save a draft to drafts/<date>-<slug>/<platform file>. Never overwrites an existing file. Draft only: this server cannot publish anywhere.",
  {
    slug: slugSchema,
    platform: z.enum(PLATFORMS),
    content: z.string().min(1).max(200_000),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("YYYY-MM-DD, defaults to today"),
  },
  async ({ slug, platform, content, date }) => {
    const day = date ?? new Date().toISOString().slice(0, 10);
    const dir = path.join(DRAFTS, `${day}-${slug}`);
    const file = path.join(dir, FILE_FOR[platform]);
    if (!file.startsWith(DRAFTS + path.sep)) return fail("invalid path");
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.writeFile(file, content, { encoding: "utf8", flag: "wx" });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "EEXIST") {
        return fail(`Refusing to overwrite ${path.relative(ROOT, file)}. Choose a new slug or ask the author.`);
      }
      throw e;
    }
    return text(`Saved ${path.relative(ROOT, file)}`);
  },
);

const BANNED_PHRASES = [
  "in today's fast-paced world",
  "game-changer",
  "game changer",
  "delve",
  "unlock the power",
  "revolutionize",
  "in conclusion",
  "buckle up",
  "let's dive in",
  "without further ado",
];

function checkText(t: string, platform: string) {
  const issues: string[] = [];
  const dashes = (t.match(/—|–/g) ?? []).length;
  if (dashes) issues.push(`Em/en dash found ${dashes} time(s). Replace with comma, period or colon.`);
  const fills = (t.match(/\[FILL[^\]]*\]/g) ?? []).length;
  if (fills) issues.push(`${fills} unfilled [FILL] placeholder(s). Get real details from the author.`);
  const lower = t.toLowerCase();
  for (const p of BANNED_PHRASES) if (lower.includes(p)) issues.push(`AI-tell phrase: "${p}".`);
  const pct = t.match(/\b\d+(\.\d+)?\s?%/g);
  if (pct) issues.push(`Numbers to verify with the author or a source: ${[...new Set(pct)].join(", ")}.`);
  const times = t.match(/\b\d+(\.\d+)?x\b/gi);
  if (times) issues.push(`Multipliers to verify: ${[...new Set(times)].join(", ")}.`);
  const paras = t.split(/\n{2,}/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#") && !s.startsWith("```"));
  const short = paras.filter((p) => p.split(/\s+/).length <= 6).length;
  if (platform === "medium" && paras.length > 10 && short / paras.length > 0.4) {
    issues.push(`${Math.round((short / paras.length) * 100)}% of paragraphs are 6 words or fewer. Merge into 2 to 4 sentence paragraphs.`);
  }
  const words = t.split(/\s+/).filter(Boolean).length;
  const limits: Record<string, [number, number]> = { medium: [800, 2500], linkedin: [120, 260], x: [60, 700] };
  const lim = limits[platform];
  if (lim && (words < lim[0] || words > lim[1])) {
    issues.push(`Length ${words} words is outside the usual ${lim[0]}-${lim[1]} for ${platform}.`);
  }
  return { words, issues };
}

server.tool(
  "check_draft",
  "Lint draft text against the author's hard rules: em dashes, unfilled placeholders, AI-tell phrases, unverified numbers, choppy paragraphs, length. Signals for review, not proof.",
  { content: z.string().min(1).max(200_000), platform: z.enum(["medium", "linkedin", "x", "youtube", "other"]).default("medium") },
  async ({ content, platform }) => {
    const { words, issues } = checkText(content, platform);
    return text(
      issues.length
        ? `${words} words. ${issues.length} issue(s):\n- ${issues.join("\n- ")}`
        : `${words} words. No rule violations found. Still run an editorial review.`,
    );
  },
);

await server.connect(new StdioServerTransport());
