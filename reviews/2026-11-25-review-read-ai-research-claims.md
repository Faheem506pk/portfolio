# Medium Article Review

- **Article:** Before You Repeat That AI Statistic: 7 Questions I Ask First
- **Draft path:** `drafts/2026-11-25-read-ai-research-claims/medium.md` (unchanged)
- **Review date:** 2026-11-25
- **Intended audience (assumed):** Developers and writers who quote AI statistics, mid-level reading experience
- **Central promise:** Four famous AI coding studies explained, plus a 7-question checklist for reading a claim
- **Publication verdict:** **Needs revision**

## Executive assessment

**Overall score:** 6.5/10

**One-sentence verdict:** A useful, well-organized explainer whose own fact-check fails in two places (the AGENTS.md numbers and the missing METR update), which is exactly the failure the article warns about.

**Biggest strength:** The 7-question checklist and the "who, how many, what, when, limit" quoting template are concrete and reusable.

**Biggest obstacle to publication:** The article's credibility rests on being right about the studies. Section 3 misstates the paper's numbers, and Section 1 ignores METR's own February 2026 update that changes the story.

## Weighted scorecard

| Dimension | Weight | Score | Evidence and reason |
|---|---:|---:|---|
| Title and subtitle | 10% | 7 | Clear promise, but "7 Questions I Ask First" asserts a personal habit the author has not confirmed. The numbered title is common. |
| Opening hook and promise | 15% | 6 | Four viral claims in a row is a fair hook, but it is abstract. No concrete moment. "Some I could not trace to a primary source" is stated without an example. |
| Narrative, structure, and flow | 15% | 7 | Logical (cases, then checklist, then template). Sections 1 to 4 repeat the same pattern ("What it supports / What to watch"), which reads formulaic. |
| Technical accuracy and evidence | 20% | 6 | Veracode, Stack Overflow and most METR figures check out. AGENTS.md numbers are wrong for the current paper version. METR update missing. Two claims unverified. |
| Clarity, readability, and grammar | 10% | 8 | Plain and clear. A few 26 to 35 word sentences. |
| Authenticity and originality | 10% | 5 | Built only from public sources. Many "how to read statistics" posts exist. No first-hand test or the author's own data. |
| Practical value and specificity | 10% | 7 | The checklist is usable. Would be stronger with one worked example on a claim the reader can verify. |
| Ending and reader engagement | 10% | 6 | Closing question is generic. The "pause before you pass it on" line is a stock moral. |
| **Weighted total** | **100%** | **6.5/10** | 0.7 + 0.9 + 1.05 + 1.2 + 0.8 + 0.5 + 0.7 + 0.6 = 6.45 |

## What is working

1. The "limits" half of each case study is the right instinct and is balanced (not anti-AI, not pro-AI).
2. The one-sentence quoting template is memorable and practical.
3. Plain language, a clear arc, and sources listed at the end.

## Highest-impact issues

| Priority | Section / short excerpt | Problem | Why it matters | Recommended change |
|---|---|---|---|---|
| Must fix | Sec 3: "Developer-written files gave about a 4% gain... LLM-generated files slightly hurt" | Current paper (v3, Sep 2026) reports developer-provided files +2.4% on average (p = 21%, not significant) and LLM-generated files -0.5% (SWE-bench) and -2% (CTXbench), also not significant. The 4% figure is from a secondary summary of an earlier version. | An article about checking claims must not misquote one. | Replace with the v3 numbers and say neither difference is statistically significant. |
| Must fix | Sec 3: "The authors recommend keeping human-written files minimal" | Not in the abstract or conclusion I could verify. Authors say context files help for non-standard practices, repository overviews did not help, and any change should be evaluated rigorously. | Misattributed recommendation. | Quote what the authors actually conclude. |
| Must fix | Sec 1 and template sentence | METR published an update on 2026-02-24: its newer experiment gave an unreliable signal because developers refused to work without AI, and METR believes speedups are likely larger in early 2026. The original 19% figure had a confidence interval of +2% to +39%. | Quoting 19% without the interval and the update contradicts the article's own advice. It is also the best live example of "date the result." | Add the update and the interval. Use this as the headline example. |
| Must fix | Sec 1: "Other results suggest junior developers may benefit more" | Came from commentary in search results, not a source I verified. | Unsourced claim in a post about sourcing. | Cut it or cite a primary source. |
| Must fix | Sec 2: "Veracode's 2026 follow-up reports a 56% pass rate" | Single-page claim, not verified here. | Same reason. | Verify on Veracode's site or cut. |
| Should fix | Q6 and intro: "figures about technical debt and developer time I looked for" and "Some I could not trace" | No example named. Reader cannot check. | Vague self-reference weakens trust. | Name one specific example with where it appeared, or remove. |
| Should fix | Title: "7 Questions I Ask First" | First-person habit not confirmed by the author. | Authenticity rule. | Confirm, or retitle "7 Questions to Ask Before You Repeat an AI Statistic". |
| Should fix | Sec 1 to 4 | Same "What it supports / What to watch" template, flagged by Vale as colon-reveal. | Predictable rhythm. | Vary one or two sections, or merge into a table plus prose. |
| Should fix | Whole article | No first-hand element. Topic is crowded. | Originality is the main curation criterion third-party guides cite. | Add one test the author ran, for example the AGENTS.md experiment (topic 1). Consider merging both stories. |
| Optional | Ending | Generic question and stock moral. | Weak close. | End on the template sentence or a specific next step. |

## Technical fact-check (accessed 2026-11-25)

| Claim / example | Status | Evidence or source URL | Required correction / qualification |
|---|---|---|---|
| METR: 16 experienced developers, 246 tasks, AI allowed or banned per task | Verified | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ | None |
| METR: tasks took 19% longer with AI; developers forecast 24% speedup and afterward believed 20% | Verified | Same | Add confidence interval +2% to +39% (from the Feb 2026 update) |
| METR: tools were mostly Cursor with Claude 3.5/3.7 Sonnet, early 2025 | Verified (Cursor Pro with Claude 3.x seen on page) | Same | None |
| METR result "may be outdated" | Partly verified | https://metr.org/blog/2026-02-24-uplift-update/ | State METR's update: new data unreliable due to selection effects, speedup likely larger in early 2026 |
| Junior developers may benefit more | Unverified | Secondary commentary only | Cut or source |
| Veracode: 100+ LLMs, 80 tasks, insecure option chosen 45% of the time | Verified | https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/ | None |
| Veracode: JavaScript failure rates 38% to 45% | Verified | Same | None |
| Veracode: XSS defenses failed in 86% of relevant cases | Verified | Same (CWE-80; log injection 88%) | None |
| Veracode sells application security products and designed tasks with a secure and insecure option | Verified (company is a vendor; task design stated in press release) | Same | None |
| Veracode 2026 follow-up: 56% pass rate | Unverified | Single page in search results | Verify or cut |
| AGENTS.md paper: no general success improvement, cost up over 20% | Verified | https://arxiv.org/abs/2602.11988 (v3, 29 Sep 2026) | Cost +20% and +23% |
| AGENTS.md: benchmark of 138 issues in 12 Python repositories | Verified | https://arxiv.org/html/2602.11988 (benchmark called CTXbench) | None |
| AGENTS.md: developer-written files about +4%; LLM-generated slightly hurt | Incorrect (for current version) | Same | Developer +2.4% (p = 21%); LLM -0.5% and -2% (p = 87% and 37%); none significant |
| AGENTS.md: authors recommend keeping human files minimal | Unverified | Abstract says files help for non-standard practices, overviews not helpful, evaluate rigorously | Replace with the authors' stated conclusion |
| Stack Overflow 2025: 84% use or plan to use AI | Verified | https://survey.stackoverflow.co/2025/ai | None |
| Stack Overflow: 46% distrust vs 33% trust, 3% highly trust | Verified | Same | None |
| Stack Overflow: positive sentiment about 60% vs over 70% before | Verified (60% on page); earlier 70%+ from Stack Overflow press coverage | Same | Link the press release for the earlier figure |
| Stack Overflow: over 49,000 developers in 177 countries | Partly verified | Stack Overflow press coverage, not found on the AI page | Link the exact source |
| Author recommended AGENTS.md in an earlier story | Opinion/experience (confirmed in story 1 text) | https://faheem506pk.medium.com/the-ai-native-repository-markdown-files-quality-gates-i-set-up-before-coding-5c0f9638e229 | Author to confirm wording |

## Paragraph-by-paragraph notes

### Introduction
Hook is fair but abstract. Replace "AI makes you much faster. AI makes you slower." with the METR story: a study found developers slower while believing they were faster, and the same lab later said its follow-up was unreliable. That is a real, checkable twist.

### Main sections
- Sec 1: add the interval and the update. Strongest section once fixed.
- Sec 2: accurate. Trim the 2026 sentence unless verified. Vale flags passive voice ("were designed") but that is acceptable.
- Sec 3: rewrite numbers. Keep the personal paragraph about AGENTS.md if the author confirms it, because it is the best authenticity element.
- Sec 4: accurate. The comparison with METR is good.
- Checklist and template: keep. Q6 needs an example.

### Conclusion
Replace the stock moral with a specific action: "next time, find the paper, write the sample size and date next to the number."

## Headline and subtitle options

1. Before You Repeat That AI Statistic: 7 Questions to Ask First
2. The Lab That Said AI Slows Developers Down Just Told You Not to Trust Its Follow-Up
3. How to Read AI Research Claims Without Fooling Yourself

Subtitle: Four well-known AI coding studies, what they measured, and a two-minute checklist.

## Revision plan

### Must fix
- [ ] Correct the AGENTS.md numbers and conclusion using v3 of the paper.
- [ ] Add METR's February 2026 update and the +2% to +39% interval, and use it as the lead example.
- [ ] Remove or source "junior developers may benefit more".
- [ ] Verify or remove the Veracode 2026 56% figure.
- [ ] Author confirms or removes first-person claims and the disclosure line.

### Should fix
- [ ] Name a concrete unsourced statistic (Q6), or remove the vague mention.
- [ ] Break the repeated "supports / watch" pattern.
- [ ] Add one first-hand element (for example a small test of the author's own AGENTS.md) or accept this is a sources-only explainer.
- [ ] Shorten sentences over 25 words.

### Optional polish
- [ ] Spell out METR on first use.
- [ ] Use contractions for a conversational tone.
- [ ] Add a small table summarizing the four studies (who, how many, what, date, limit).

## Vale / prose-linter findings

Run with the repository `.vale.ini` (Google, Voices, Direct, Claude, AiTells packages) on a copy of the draft.
- **Genuine:** sentences of 26 to 35 words (Direct.Length), repeated "What it supports:" colon-reveal pattern (Voices.ColonReveal), filler adverbs "actually" and "quickly" (AiTells.Adverb), some passive voice ("be quoted", "was allowed", "were designed").
- **False positives or style choices:** Google.FirstPerson (first person is intended on Medium), Google.Contractions (formal wording is fine but contractions would sound warmer), Vale.Spelling on "Veracode", Google.Headings, Google.WordListCase ("application" vs "app"), Google.Parens.
- No em dashes found.

## Approval gate

**No changes have been made to the original draft.**

Which proposed changes do you approve? On approval I will create `articles/2026-11-25-read-ai-research-claims-revised.md` with a change log. Items marked "author confirms" need your answer first.
