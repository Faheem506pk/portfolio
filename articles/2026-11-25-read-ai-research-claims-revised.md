<!--
REVISED DRAFT 2 (must-fix changes only). Original: drafts/2026-11-25-read-ai-research-claims/medium.md (unchanged).
Review: reviews/2026-11-25-review-read-ai-research-claims.md
Title options:
1. Before You Repeat That AI Statistic: 7 Questions to Ask First
2. The Lab That Said AI Slows Developers Down Later Told Us Not to Trust Its Follow-Up
3. How to Read AI Research Claims Without Fooling Yourself
Subtitle: Four well-known AI coding studies, what they measured, and a two-minute checklist.
Tags: AI, Software Development, Programming, Research, Developer Productivity
Author must confirm before publishing:
- The sentence in section 3 saying he recommended AGENTS.md in an earlier story (true per his story 1 text).
- Whether to add an AI-assistance disclosure line, for example: "I used AI tools to help research and structure this article. I checked every source link myself." Only add it if true.
Still open (should-fix, not applied): Q6 vague example, repeated section pattern, no first-hand test, sentence length, ending.
Sources accessed 2026-11-25, listed at the end.
-->

# Before You Repeat That AI Statistic: 7 Questions to Ask First

*Four well-known AI coding studies, what they measured, and a two-minute checklist.*

Every week a new number about AI and developers goes viral. AI makes you much faster. AI makes you slower. Nearly half of AI code is insecure. Junior jobs are collapsing.

Some of these numbers are solid. Some are true but narrow. Some I could not trace to a primary source at all. All of them travel the same way: screenshot, headline, repost.

If you write about AI, teach it, or make decisions about it, people will quote you. So it is worth learning to read a claim before you repeat it. Here are four well-known examples, then a checklist.

## 1. The METR study: "developers were 19% slower"

In 2025, METR ran a randomized trial with 16 experienced developers who completed 246 tasks in large open-source repositories they had contributed to for years. For each task, AI use was either allowed or banned. When AI was allowed, tasks took 19% longer, with a confidence interval from +2% to +39%. Before starting, the developers expected a 24% speedup, and afterward they still believed AI had made them about 20% faster.

What it supports: a feeling of speed is not the same as measured speed, even for skilled people.

What it does not support: "AI makes every developer slower." The authors warned against broad generalizations. The sample was 16 people, the tools were early-2025 versions (mostly Cursor Pro with Claude 3.5 and 3.7 Sonnet), and the repositories were ones the developers knew deeply.

The most useful part came later. In February 2026, METR published an update saying its newer experiment, which used the latest tools, gave an unreliable signal. Many developers refused to take part because they did not want to work without AI, and some chose not to submit tasks they did not want to do without it. METR said these selection effects probably bias its estimate against AI. It also said developers are likely more sped up in early 2026 than in early 2025, and that its new data is only very weak evidence for how much.

So the lab behind the most quoted "AI is slower" number later told readers not to rely on its own follow-up. If you only saw the first headline, you missed that.

## 2. The Veracode report: "45% of AI code is insecure"

Veracode tested more than 100 language models on 80 curated tasks. In each task the model could pick a secure or an insecure way to write the code, and the models chose the insecure option 45% of the time. For JavaScript, failure rates were between 38% and 45%. Models failed to defend against cross-site scripting in 86% of the relevant cases.

What it supports: when you do not ask for security, models often do not provide it, and security performance did not keep up with gains in syntax.

What to watch: Veracode sells application security products, and the tasks were built so that a secure and an insecure option both existed. "Failed a check" is not the same as "shipped a vulnerability to production."

## 3. The AGENTS.md paper: "context files do not help"

A 2026 paper tested whether repository context files such as AGENTS.md help coding agents. Its authors found that context files do not generally improve task success, while raising inference cost by more than 20% on average (20% and 23% in the two settings they tested).

The details matter. Developer-written files improved performance by 2.4% on average, but that difference was not statistically significant (p = 21%). LLM-generated files lowered the resolution rate by 0.5% on SWE-bench and 2% on the authors' own benchmark, and those differences were also not significant. The authors also found that agents follow the instructions in these files well, that repository overviews were not helpful, and that context files can be useful for specifying non-standard coding practices. Their conclusion is that any attempt to improve performance with such files should be rigorously evaluated before deployment.

What to watch: the authors' new benchmark has 138 issues from 12 Python repositories. That says little about a large Next.js and TypeScript codebase. It also measures whether an agent solves an issue, not whether a file helps a human team stay consistent over months.

This one matters to me personally, because I recommended AGENTS.md files in an earlier story. The honest reading is not "I was wrong" and not "the paper is wrong." It is "test these files on your own repository, and remove rules that do not change behavior."

## 4. The Stack Overflow survey: "84% use AI, 46% distrust it"

The 2025 survey covered more than 49,000 developers in 177 countries. It found that 84% use or plan to use AI tools, that 46% distrust the accuracy of AI output while 33% trust it, and that only 3% highly trust it. Positive sentiment fell from over 70% in earlier years to about 60%.

What it supports: adoption is high and confidence is falling, at the same time.

What to watch: a survey measures what people say, from people who chose to answer. It is a good mood indicator and a poor productivity measurement. Compare it with the METR result: people's feelings and measured outcomes can differ.

## The 7 questions

Before you repeat a number, ask:

1. **Who measured it, and who paid?** A vendor study is not automatically wrong, but it has an incentive. Say who ran it.
2. **How many, and who?** 16 experts, 49,000 volunteers and 80 tasks are three very different kinds of evidence.
3. **What exactly was measured?** Time to finish, tests passed, a forced choice between two snippets, or an opinion? The headline often swaps one for another.
4. **Which tools and which date?** AI tools change every few months. METR's own follow-up shows how fast a result can age.
5. **Does it match your situation?** Python repositories, open-source maintainers and benchmark tasks are not your React app.
6. **Can you find the primary source?** If a statistic appears on ten blogs and none link to a paper or report, treat it as a rumor. Some widely repeated figures about technical debt and developer time that I looked for fall in this group.
7. **What would change your mind?** If you cannot say, you are repeating a slogan, not weighing evidence.

## A short template for quoting a statistic

You can keep your writing honest in one sentence:

> "In a 2025 METR trial of 16 experienced developers on 246 tasks, AI use made tasks 19% longer (confidence interval +2% to +39%), though METR later said its follow-up data was too biased to confirm how much newer tools change that."

That sentence has the who, how many, what, when, the uncertainty and the update. It is longer than a headline, and it is the version readers can trust.

## What to do with this in practice

- Link the primary source, not a summary of a summary.
- Write the sample size and date next to the number.
- Label anything you could not trace as unverified, or leave it out.
- Check for updates from the original authors before you quote an old result.
- Run the claim against your own repository when you can, and report what you found, including when it contradicts the study.

AI and software development move fast, and the fastest thing that moves is a number without context. The most useful habit you can build is a short pause before you pass it on.

Which AI statistic have you seen repeated that you could not trace to a source?

## Sources (accessed 2026-11-25)
- METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity": https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ and paper https://arxiv.org/pdf/2507.09089
- METR, "We are Changing our Developer Productivity Experiment Design" (2026-02-24): https://metr.org/blog/2026-02-24-uplift-update/
- Veracode, 2025 GenAI Code Security Report press release: https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/
- Gloaguen et al., "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?" (arXiv 2602.11988, v3): https://arxiv.org/abs/2602.11988
- Stack Overflow 2025 Developer Survey, AI section: https://survey.stackoverflow.co/2025/ai
