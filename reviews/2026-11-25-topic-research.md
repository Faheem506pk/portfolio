# Topic research: what is worth writing about AI and JavaScript (2026-11-25)

Method: web searches on developer surveys, peer-reviewed or preprint studies, industry reports and Medium distribution guidance. Medium does not publish per-topic reader demand, so "demand" below is inferred from signals (surveys, controversy, tool adoption), not measured read counts. Treat scores as judgment, not data.

## What the evidence says

### Developers use AI more and trust it less (strong signal for "how to use AI well" content)
- Stack Overflow 2025 survey (49,000+ developers): 84% use or plan to use AI tools, 46% distrust output accuracy vs 33% who trust it, positive sentiment fell from 70%+ to 60%. 44% use AI to learn coding. [Stack Overflow](https://stackoverflow.blog/2025/07/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/)
- Meaning: readers want verification habits, not hype. "How I check AI output" beats "AI is amazing".

### Perceived speed vs measured speed (strong hook, needs the author's own data)
- METR randomized trial, 16 experienced developers, 246 tasks: AI use made tasks 19% slower while developers believed they were about 20% faster. Small sample, early-2025 tools, authors warn against over-generalizing. [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/), [arXiv](https://arxiv.org/pdf/2507.09089)
- Gap: few developers publish their own measured numbers. A personal, honest measurement is differentiated.

### Context files like AGENTS.md may not help as much as people claim (directly relevant, and challenges the author's own story 1)
- "Evaluating AGENTS.md" (ICLR 2026 workshop, arXiv 2602.11988): context files gave no meaningful task-success gain and raised cost by over 20%. Developer-written files helped about 4%, LLM-generated files slightly hurt. Recommendation: keep human-written files minimal. [arXiv](https://arxiv.org/html/2602.11988)
- Opportunity: a follow-up "I tested my own AGENTS.md, here is what I cut" is credible and fresh. It also protects the author from claiming more than evidence supports.

### AI code security (strong, evergreen, practical)
- Veracode 2025: models picked the insecure option 45% of the time across 80 tasks; JavaScript failure rates 38 to 45%; XSS defenses failed in 86% of relevant cases. 2026 follow-up reports a stalled 56% pass rate (single source, verify before quoting). [Veracode](https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/), [Help Net Security](https://www.helpnetsecurity.com/2025/08/07/create-ai-code-security-risks/)
- Vendor study with a commercial interest. Quote carefully.

### MCP is hot and has real security problems (timely, technical, fits his new MCP server)
- Tool poisoning, rug pulls, tool shadowing; an Equixly study reported command injection in 43% of MCP servers (single vendor claim, verify). Mitigations: review tool descriptions, least privilege, scan with tools like mcp-scan. [Elastic Security Labs](https://www.elastic.co/security-labs/mcp-tools-attack-defense-recommendations), [The New Stack](https://thenewstack.io/building-with-mcp-mind-the-security-gaps/), [arXiv 2603.22489](https://arxiv.org/pdf/2603.22489)
- Skills vs MCP framing: skills give knowledge, MCP gives capabilities. [Smartscope](https://smartscope.blog/en/themes/skills-mcp-context/)

### Vibe coding aftermath (crowded, but a practical refactor story can stand out)
- Sonar: 88% of developers report at least one negative effect of AI on technical debt. JetBrains 2026: 28% more time on code review. Many viral numbers have no primary source. [Sonar](https://sonarsource.com/blog/how-ai-is-redefining-technical-debt), [TechRadar](https://www.techradar.com/pro/from-vibe-to-viable-the-hidden-cost-of-ai-tech-debt)

### Entry-level market (very crowded, already covered by two of his stories)
- Stanford Digital Economy Lab (Aug 2025): about 13% relative employment decline for early-career workers in AI-exposed jobs; about 20% for software developers aged 22 to 25 per the lab director. Hiring drops, not layoffs. [The Register](https://www.theregister.com/2025/08/26/ai_hurts_recent_college_grads_jobs/), [IEEE Spectrum](https://spectrum.ieee.org/ai-impact-on-job-market)
- Pakistan angle: Brookings found freelancers in AI-exposed work saw a 2% contract and 5% earnings drop since 2022 (as reported by Geo); Accountability Lab brief: about 70% of surveyed digital workers use AI, gains concentrated in higher-skilled workers. [Geo](https://www.geo.tv/latest/652449-ai-is-coming-for-pakistans-freelancers-we-need-to-talk-about-it), [Accountability Lab](https://pakistan.accountabilitylab.org/wp-content/uploads/2026/05/Digital-Work-Economy-Policy-Brief.pdf)
- Under-served: Pakistan-specific, practitioner voice. Generic "juniors are doomed" is saturated.

### Agent tool comparisons (saturated)
- Dozens of "Claude Code vs Codex vs Antigravity" posts exist with conflicting benchmark numbers. A generic comparison will be ignored. A same-task test on his own repo with logged results would stand out. [The New Stack](https://thenewstack.io/claude-code-vs-cursor-vs-codex-vs-antigravity-2026/)

### Medium distribution (what the platform rewards)
- Medium's help center describes Boost for high-quality stories. Third-party guides say curation favors depth, originality and expertise, and that Medium is demoting AI filler. Curation percentages quoted by Teract (8-12%) are unverified vendor claims. 1,500 to 2,500 words is the commonly cited sweet spot (older study). [Medium Help](https://help.medium.com/hc/en-us/articles/360006362473), [Teract](https://www.teract.ai/resources/medium-curation-guide-2026)
- Implication: first-hand experiments with real numbers and honest limits are the best bet. Opinion pieces without evidence are the most likely to be ignored.

## Scoring scale
Demand (D): reader interest signal, 1-5. Gap (G): how under-served, 1-5 (5 = few good posts). Fit (F): matches his real experience and repos, 1-5. Proof (P): evidence or his data available, 1-5. Score = D + G + F + P (max 20). Needs = real details only the author can supply.

## 20 topics ranked

| # | Topic | D | G | F | P | Score | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Does AGENTS.md actually help? I tested my own and cut half | 5 | 4 | 5 | 5 | 19 | Write first |
| 2 | I measured AI vs no AI on 10 real tasks (METR-style, small and honest) | 5 | 5 | 4 | 4 | 18 | Write after he logs tasks |
| 3 | I built an MCP server in TypeScript that knows me (and how I secured it) | 5 | 4 | 5 | 4 | 18 | Write: we built it |
| 4 | MCP security checklist for developers: tool poisoning, least privilege | 5 | 3 | 4 | 5 | 17 | Write, link to #3 |
| 5 | AI-generated React/Next.js security bugs I found in review (XSS, RLS, secrets) | 5 | 3 | 5 | 4 | 17 | Write with his real findings |
| 6 | Skills vs MCP vs AGENTS.md: which one to use for what | 5 | 3 | 5 | 4 | 17 | Write |
| 7 | My checklist for reviewing AI-written pull requests | 4 | 4 | 5 | 4 | 17 | Write |
| 8 | Supabase RLS mistakes AI makes in Next.js apps | 4 | 4 | 4 | 4 | 16 | Write with real cases |
| 9 | From vibe-coded mess to maintainable: refactoring an AI-built React app (before/after) | 4 | 3 | 5 | 4 | 16 | Write with real repo |
| 10 | Tests as the gate: Jest and Playwright for AI-written code | 4 | 3 | 4 | 4 | 15 | Write, follow-up to story 1 |
| 11 | Using AI on ESP32/IoT firmware: what works and what breaks (PlantPulse) | 3 | 5 | 5 | 3 | 16 | Write: low competition niche |
| 12 | AI for Frappe/ERPNext customization: a practical guide | 2 | 5 | 4 | 3 | 14 | Write if he has examples, small but loyal audience |
| 13 | Pakistan freelancers and AI: how I would price and position in 2026 | 4 | 4 | 3 | 4 | 15 | Write, needs his freelance numbers |
| 14 | Learning React with AI without losing fundamentals (a 30-day plan) | 4 | 2 | 4 | 3 | 13 | Maybe: crowded, needs a real plan he followed |
| 15 | Token and cost control with coding agents (context size, model choice) | 4 | 3 | 3 | 4 | 14 | Write if he has real cost numbers |
| 16 | Same task, three agents (Claude Code, Codex, Antigravity) with logged results | 4 | 2 | 4 | 3 | 13 | Only with a real same-task test |
| 17 | TypeScript patterns where AI fails (generics, discriminated unions, strict mode) | 3 | 3 | 4 | 3 | 13 | Needs real examples |
| 18 | Turning one Medium story into LinkedIn, X and YouTube with agents (content ops) | 3 | 3 | 5 | 3 | 14 | Write after pipeline proves itself |
| 19 | How to read AI research claims (Veracode, METR, vendor stats) before you repeat them | 4 | 3 | 3 | 5 | 15 | Write, a trust-building explainer |
| 20 | Spec-driven development vs prompting on a small Next.js feature | 3 | 2 | 3 | 3 | 11 | Low priority, saturated |

## Ignore list (low value for this author)
- "Will AI replace developers?" opinion pieces without data. Saturated, and he already has two.
- Generic tool comparisons without a real test.
- "10 ChatGPT prompts for developers" listicles.
- Re-telling the first-client story. It is already published.
- Any viral statistic without a primary source (for example "$1.5 trillion technical debt", "63% spent more time debugging").

## Recommended order for the first 6 weeks
1. #1 AGENTS.md test (also fixes the claims in story 1).
2. #3 MCP server build story.
3. #5 AI-generated security bugs in React and Next.js.
4. #7 PR review checklist.
5. #2 AI vs no AI measurement (start logging tasks now, publish after 2 weeks of data).
6. #4 MCP security checklist.

## What I still need from the author
Real tasks, real numbers and real repos for each chosen topic. See `skills/topic-research/SKILL.md` for the repeatable method.
