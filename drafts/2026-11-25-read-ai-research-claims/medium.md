<!--
DRAFT 1, topic 19 (score 15). Written from public sources only. No personal anecdotes were invented.
Title options:
1. Before You Repeat That AI Statistic: 7 Questions I Ask First
2. "AI Makes Developers 19% Slower" and Other Numbers You Should Not Repeat Yet
3. How to Read AI Research Claims Without Fooling Yourself
Subtitle: Four famous AI coding studies, what they actually measured, and a 7-question checklist.
Tags: AI, Software Development, Programming, Research, Developer Productivity
Disclosure line to keep: "I used AI tools to help research and structure this article. I checked every source link myself." [AUTHOR TO CONFIRM this is true before publishing]
Open items: [FILL] one real example where the author repeated or nearly repeated a statistic. Optional, delete the marked paragraph if none.
Unverified in this draft: none quoted as fact. Viral numbers are named only as examples of claims without a primary source.
Sources checked 2026-11-25: see the Sources section at the end.
-->

# Before You Repeat That AI Statistic: 7 Questions I Ask First

*Four famous AI coding studies, what they actually measured, and a checklist you can use in two minutes.*

Every week a new number about AI and developers goes viral. AI makes you much faster. AI makes you slower. Nearly half of AI code is insecure. Junior jobs are collapsing.

Some of these numbers are solid. Some are true but narrow. Some I could not trace to a primary source at all. The problem is that all of them travel the same way: screenshot, headline, repost.

If you write about AI, teach it, or make decisions about it, you will be quoted. So it is worth learning how to read a claim before you repeat it. Here are four well-known examples, then a checklist.

## 1. The METR study: "developers were 19% slower"

METR ran a randomized trial with 16 experienced open-source developers who completed 246 tasks in mature repositories they already knew. For each task, AI use was either allowed or banned. When AI was allowed, tasks took 19% longer. Before starting, the developers expected a 24% speedup, and afterward they still believed they had been about 20% faster.

What it supports: a feeling of speed is not the same as measured speed, even for skilled people.

What it does not support: "AI makes all developers slower." The authors say so themselves. The sample was 16 people, the tools were early-2025 versions (mostly Cursor with Claude 3.5 and 3.7 Sonnet), and the repositories were large ones the developers knew deeply. Other results suggest junior developers may benefit more. The authors also note the tools improve fast enough that the findings could age quickly.

## 2. The Veracode report: "45% of AI code is insecure"

Veracode tested more than 100 language models on 80 curated tasks. In each task the model could pick a secure or an insecure way to write the code, and the models chose the insecure option 45% of the time. For JavaScript, failure rates were between 38% and 45%. Models failed to defend against cross-site scripting in 86% of the relevant cases.

What it supports: when you do not ask for security, models often do not provide it, and this has not improved much as models got better at syntax.

What to watch: Veracode sells application security products, the tasks were designed so a secure and an insecure option both existed, and "failed a check" is not the same as "shipped a vulnerability to production." Veracode's 2026 follow-up reports a 56% pass rate, but I only found that figure on Veracode's own site, so treat it as unconfirmed.

## 3. The AGENTS.md paper: "context files do not help"

A 2026 paper tested whether repository context files such as AGENTS.md help coding agents. It found no meaningful improvement in task success and an increase in inference cost of more than 20%. Developer-written files gave about a 4% gain on average, while LLM-generated files slightly hurt. The authors recommend keeping human-written files minimal.

What it supports: long, auto-generated context files are not free, and they may not pay for themselves.

What to watch: the new benchmark used 138 real issues from 12 smaller Python repositories. That says little about a large Next.js and TypeScript codebase. It also measured task success on issues, not whether a file helps a human team stay consistent over months.

This one matters to me personally, because I recommended AGENTS.md files in an earlier story. The honest reading is not "I was wrong" and not "the paper is wrong." It is "keep these files short, test them on your own repository, and remove rules that do not change behavior."

## 4. The Stack Overflow survey: "84% use AI, 46% distrust it"

The 2025 survey covered more than 49,000 developers in 177 countries. It found that 84% use or plan to use AI tools, that 46% distrust the accuracy of AI output while 33% trust it, and that only 3% highly trust it. Positive sentiment fell from over 70% in earlier years to about 60%.

What it supports: adoption is high and confidence is falling, at the same time.

What to watch: a survey measures what people say, from people who chose to answer. It is a good mood indicator and a poor productivity measurement. Compare it with the METR result: people's feelings and measured outcomes can differ.

## The 7 questions

Before I repeat a number, I ask:

1. **Who measured it, and who paid?** A vendor study is not automatically wrong, but it has an incentive. Say who ran it.
2. **How many, and who?** 16 experts, 49,000 volunteers and 80 tasks are three very different kinds of evidence.
3. **What exactly was measured?** Time to finish, tests passed, a forced choice between two snippets, or an opinion? The headline often swaps one for another.
4. **Which tools and which date?** AI tools change every few months. A result from early 2025 is a snapshot, not a law.
5. **Does it match my situation?** Python repositories, open-source maintainers and benchmark tasks are not your React app.
6. **Can I find the primary source?** If a statistic appears on ten blogs and none link to a paper or report, treat it as a rumor. Some widely repeated figures about technical debt and developer time that I looked for fall in this group.
7. **What would change my mind?** If I cannot say, I am repeating a slogan, not weighing evidence.

## A short template for quoting a statistic

You can keep your writing honest in one sentence:

> "In a 2025 METR trial of 16 experienced developers on 246 tasks, AI use made tasks 19% slower, though the authors warn the result may not generalize."

That sentence has the who, how many, what, when and the limit. It is longer than a headline, and it is the version readers can trust.

## What I do with this in practice

- I link the primary source, not a summary of a summary.
- I write the sample size and date next to the number.
- I label anything I could not trace as unverified, or I leave it out.
- I run the claim against my own repository when I can, and report what I found, including when it contradicts the study.

<!-- [FILL optional] One real moment where the author nearly repeated an unverified statistic and what he did instead. Delete if none. -->

AI and software development move fast, and the fastest thing that moves is a number without context. The most useful habit you can build is a short pause before you pass it on.

Which AI statistic have you seen repeated that you could not trace to a source?

## Sources (checked 2026-11-25)
- METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity": https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ and paper https://arxiv.org/pdf/2507.09089
- Veracode, 2025 GenAI Code Security Report: https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/ and coverage https://www.helpnetsecurity.com/2025/08/07/create-ai-code-security-risks/
- "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?": https://arxiv.org/html/2602.11988
- Stack Overflow 2025 Developer Survey: https://stackoverflow.blog/2025/07/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/
