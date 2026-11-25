# Portfolio and author studio: instructions for any AI agent

This repository holds two things for **Muhammad Faheem Iqbal (faheem506pk)**, a full stack software engineer in Islamabad:

1. **The portfolio website** (Next.js 16, React 19, Supabase), live at https://faheem506pk.vercel.app. Code in `src/`, product intent in `PRODUCT.md`, design rules in `DESIGN.md`, database in `supabase/` and `src/scripts/`.
2. **The author studio**: knowledge, skills and tools for writing his content (Medium, LinkedIn, X, YouTube). Files in `author/`, `skills/`, `mcp/author-studio/`, `drafts/`, `reviews/`, `articles/`.

## Website work
- Read `PRODUCT.md` and `DESIGN.md` first. The single conversion is a CV download.
- Commands: `npm run dev`, `npm run build`, `npm run lint`. Never commit `.env*` files. Supabase keys stay in Vercel and local env only.
- The live site deploys from `main` on Vercel. Work on a branch, never push to `main` without the author's approval.

## Content work (read in this order)
1. `author/README.md`, `author/facts.json`, `author/voice.md`, `author/goals-and-strategy.md`, `author/stories-index.md`.
2. Pick the skill:

| Task | Skill |
|---|---|
| Know the author, rules, voice | `author-profile` |
| Plan or repurpose content end to end | `content-pipeline` |
| Learn and record lessons (start and end of every task) | `lessons-learned` |
| Decide if a topic is worth writing (always first) | `topic-research` |
| Medium rules, AI policy, paywall, Partner Program, pre-publish gate (always) | `medium-policy` |
| Draft a Medium story | `medium-writer` |
| Review, score, fact-check a Medium story | `medium-editor` (root `SKILL.md`) |
| YouTube script, title, description | `youtube-script` |
| LinkedIn post or profile copy | `linkedin-post` |
| X thread, bio | `x-thread` |

Skills live in `skills/`. Run `scripts/sync-skills.sh` to copy them to `.claude/skills/` and `.agents/skills/`.

3. MCP server `author-studio` (`mcp/author-studio`, build with `cd mcp/author-studio && npm install && npm run build`). Tools: `get_author_profile`, `get_voice_guide`, `get_strategy`, `get_topic_backlog`, `get_medium_policy`, `check_medium_policy`, `get_lessons`, `add_lesson`, `list_published_stories`, `list_open_questions`, `list_skills`, `get_platform_guide`, `list_drafts`, `read_draft`, `create_draft`, `check_draft`.

## Quick start (what to do next time)
0. Read `author/lessons.md` and `author/study-queue.md` (skill `lessons-learned`). Apply them. At the end of the task add new lessons and study items.
1. Read this file, then `author/README.md`.
2. New story request: run `topic-research` first. Check `author/topic-backlog.md` and `author/stories-index.md`.
3. Ask the author for the real details listed in the backlog row. Do not write prose until you have them.
4. Draft with `medium-writer` into `drafts/<date>-<slug>/`, run `check_draft`, then review with `medium-editor` into `reviews/`.
5. After approval, repurpose with `linkedin-post`, `x-thread`, `youtube-script`.
6. Update `author/stories-index.md` and the backlog status. Never publish.

## Learning loop (required every task)
Start: read `author/lessons.md` and `author/study-queue.md`. End: record 1 to 5 specific lessons and what to study next, then tell the author. Never store secrets or personal contact details in them.

## Non-negotiable rules
- Review first. Never rewrite an original story without approval.
- Never invent anecdotes, credentials, tests, metrics, quotes or clients. Ask the author.
- Never publish, post, send or edit on Medium, LinkedIn, X, YouTube or GitHub. Draft only.
- Confidential client work is never named. No phone or personal email in generated content.
- No em dashes in anything written for him.
- The author wants Partner Program income. Default to the paid track: agents research, outline, fact-check and edit feedback, the author writes the text himself. Read skill `medium-policy` and run `check_medium_policy` before handing over any story. Never buy, enroll, enter bank or tax details, or publish for him.
- Medium policy: AI-generated text cannot be paywalled and needs a disclosure sentence in the first two paragraphs (else Network Only). The author rewrites drafts in his own words. Never batch-publish: spam rules apply, plan 1 to 2 stories per week.
- Verify technical claims against primary sources and cite URLs.
- Never write a story before `topic-research` says it adds value (score 16 or more, or 13 to 15 with real author details). Do not write topics on the ignore list.
- Mark any statistic without a primary source as UNVERIFIED. Never repeat viral numbers.
- Medium does not expose per-topic demand: say demand is inferred, not measured.
- Keep this file and `author/` lean. Research shows long context files can raise cost and not improve results, so add only rules that change behavior.

## Admin Content Studio (website)
- `/mfiadmin/stories` is the writing pipeline (60 researched ideas, stages Idea to Published). `/mfiadmin/blog` is the Markdown editor with a Medium card: status on Medium, Medium URL, AI and paywall flags, a policy check, and Copy for Medium (rich text) so the author pastes into Medium and publishes himself.
- Pasting rich text from Medium into the editor converts it to Markdown. "Check Medium" reads the public feed (`/api/medium/feed`) and marks matching posts as published.
- Tables come from `supabase/migrations/0003` and `0004`. The author applies them with `npm run db:push`. Agents must not run migrations or touch `.env*`.
- Supabase clients must not be created at module load without env checks. A missing variable on a Vercel preview used to crash the build.

## Where things go
`drafts/<date>-<slug>/` working drafts, `reviews/` reports, `articles/` approved finals, `templates/` report templates.

## Efficiency
Keep CPU load low: no parallel builds, no full-repo scans unless needed, one subagent at a time.
