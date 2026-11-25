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
  "get_topic_backlog",
  "Researched and scored story topics with status and what real details the author must supply. Check this before proposing or writing any story.",
  {},
  async () => {
    const t = await readOrNull(path.join(AUTHOR, "topic-backlog.md"));
    return t ? text(t) : fail("author/topic-backlog.md not found");
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
