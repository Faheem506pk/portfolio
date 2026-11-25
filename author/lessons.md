# Lessons learned (read before every task, add after every task)

Format: date | area | lesson | why

## Research and fact-checking
- 2026-11-25 | sources | Open the primary source and check the latest version before quoting numbers. A secondary summary said developer AGENTS.md files gave about +4%, but paper v3 says +2.4% and not statistically significant. | Secondary summaries quote older versions.
- 2026-11-25 | sources | Check whether the original authors published an update before quoting an old result. METR's Feb 2026 update says its newer data is unreliable and speedups are likely larger now. | A stale headline can contradict its own source.
- 2026-11-25 | numbers | Never write a statistic you did not verify, even in a hook. An unsourced "55% faster" slipped into a draft and had to be removed. | The check_draft tool flags numbers, but only the author or a source can verify them.
- 2026-11-25 | demand | Medium does not expose per-topic demand. Say demand is inferred from surveys and discussion, never measured. Treat vendor curation percentages as unverified. | Avoids false precision.
- 2026-11-25 | evidence | Report sample size, date, who paid, and limits next to every study number. Mark single-vendor claims. | Makes the article trustworthy.

## Writing
- 2026-11-25 | voice | No em dashes. Merge one-line paragraphs. No recap lists. Retell no already-published story, link it. | Author's known habits and hard rule.
- 2026-11-25 | authenticity | Do not claim the author has a personal habit ("I ask") unless confirmed. Use neutral titles when unsure. | Never invent experience.
- 2026-11-25 | structure | Repeating one section template (supports / watch) across four sections reads formulaic. Vary it. | Reviewer finding on draft 1.

## Workflow and tools
- 2026-11-25 | repo | The live portfolio clone is `~/CV` (Next.js 16, Supabase, Vercel). Never read `.env.local`. Work on a branch, never push `main` without approval. | `main` deploys to faheem506pk.vercel.app.
- 2026-11-25 | tools | The MCP server is `mcp/author-studio`; rebuild with `npm run build` after changes. Vale works with `vale --config <repo>/.vale.ini file`; style packages may only exist in the original worktree. | Avoid wasted setup time.
- 2026-11-25 | network | A GitHub push or Next.js build can fail once on a network blip (HTTP 500, Google Fonts fetch). Retry once before debugging. | Both succeeded on retry.
- 2026-11-25 | process | Run `topic-research` before drafting, then `check_draft`, then `medium-editor` review, then wait for approval before revising. | Review-first policy.
- 2026-11-25 | cpu | Run work sequentially, one build at a time, no extra agents unless asked. | User's global CPU rule.

## Platform policy
- 2026-11-25 | medium | Medium AI policy (updated 2026-11-12): AI-generated text cannot be paywalled, AI-assisted text needs a disclosure sentence in the first two paragraphs or gets Network Only distribution, AI images need captions. No official per-day story limit found in the help pages, spam rules apply. | Account safety. Agents draft, the author rewrites and owns the text.
- 2026-11-25 | scale | Do not mass-produce full stories. 60 full AI drafts would break the spirit of Medium's policy and the no-invention rule. Make briefs and outlines, write full drafts one at a time with the author's real details. | Quality and account risk.
- 2026-11-25 | vercel | A branch preview build failed with "supabaseUrl is required" because Supabase environment variables were not set for the Preview scope. Our branch changes no site code. Fix in Vercel env settings, never paste keys in chat or commit them. | Previews need their own env vars.

## Author facts to confirm (do not assume)
- Whether he wants an AI-assistance disclosure line on posts.
- Which TabTake or JavaScript lessons are safe to publish.
- 2026-11-25 | process | When the author approves only must-fix items, apply only those and list the untouched should-fix items in the revised file header.
