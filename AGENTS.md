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
| Draft a Medium story | `medium-writer` |
| Review, score, fact-check a Medium story | `medium-editor` (root `SKILL.md`) |
| YouTube script, title, description | `youtube-script` |
| LinkedIn post or profile copy | `linkedin-post` |
| X thread, bio | `x-thread` |

Skills live in `skills/`. Run `scripts/sync-skills.sh` to copy them to `.claude/skills/` and `.agents/skills/`.

3. MCP server `author-studio` (`mcp/author-studio`, build with `cd mcp/author-studio && npm install && npm run build`). Tools: `get_author_profile`, `get_voice_guide`, `get_strategy`, `list_published_stories`, `list_open_questions`, `list_skills`, `get_platform_guide`, `list_drafts`, `read_draft`, `create_draft`, `check_draft`.

## Non-negotiable rules
- Review first. Never rewrite an original story without approval.
- Never invent anecdotes, credentials, tests, metrics, quotes or clients. Ask the author.
- Never publish, post, send or edit on Medium, LinkedIn, X, YouTube or GitHub. Draft only.
- Confidential client work is never named. No phone or personal email in generated content.
- No em dashes in anything written for him.
- Verify technical claims against primary sources and cite URLs.

## Where things go
`drafts/<date>-<slug>/` working drafts, `reviews/` reports, `articles/` approved finals, `templates/` report templates.

## Efficiency
Keep CPU load low: no parallel builds, no full-repo scans unless needed, one subagent at a time.
