---
name: topic-research
description: Decide if a story topic adds value before writing it. Researches reader demand, saturation, evidence and fit with the author's real experience, then scores it. Use for any "what should I write", "is this topic worth it", "find topics" request, and always before medium-writer.
---

# Topic research (run before writing any story)

Prerequisite: skill `author-profile`. Read `author/topic-backlog.md` and `author/stories-index.md` first. The backlog may already hold the answer.

## Method (do in order, sequentially, keep CPU low)
1. **Check duplicates**: is it already published (stories-index) or already in the backlog? If yes, link or reuse.
2. **Demand signals**: search for surveys and reports (Stack Overflow survey, JetBrains, Sonar, GitHub blog, daily.dev, Hacker News and dev.to discussion, Medium tag pages). Note what readers argue about, not only what is popular.
3. **Saturation**: search the exact title idea. Count how many strong, recent posts exist and what they miss. Saturated and generic means skip or find a first-hand angle.
4. **Evidence**: find primary sources (papers, official docs, vendor research). Mark single-vendor or secondhand statistics as UNVERIFIED. Never repeat a statistic without a source link.
5. **Author fit**: does he have real experience, a repo, a number or a failure to tell? If not, list what he must supply. No invented anecdotes.
6. **Differentiator**: one sentence on what only he can add (his repo, his measurement, Pakistan context, a counter-claim to a popular belief).
7. **Score** using the scale in `reviews/2026-11-25-topic-research.md`: Demand + Gap + Fit + Proof, each 1 to 5, max 20.

## Verdicts
- 16 or more: write now.
- 13 to 15: write only if the author supplies real details.
- Under 13 or on the ignore list: skip and say why.
- Ignore list: generic "AI will replace developers", tool comparisons without a real test, prompt listicles, retelling published stories, viral statistics without a primary source.

## Output
Save the research as `reviews/YYYY-MM-DD-topic-<slug>.md` with: verdict, score table, 3 to 5 sources with links, what is unverified, differentiator, what the author must supply, 3 title options. Add accepted topics to `author/topic-backlog.md`.

## Honesty rules
- Medium does not expose per-topic demand. Say that demand is inferred.
- Report conflicting sources as conflicting. Do not pick the flattering number.
- Date every source. Prefer 2025 and 2026 material.
- No em dashes.
