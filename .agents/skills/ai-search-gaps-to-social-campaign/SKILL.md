---
name: ai-search-gaps-to-social-campaign
description: >
  Find the AI-search prompts and topics where a brand is invisible (or losing to competitors) in
  SE Ranking, then turn those gaps into a social campaign in Planable and set up before/after tracking.
  Use this skill whenever the user wants to improve how their brand shows up in AI answers (ChatGPT,
  Perplexity, Gemini, Google AI Overview, AI Mode) through content, or says things like "what should we
  post to get cited by AI", "where are competitors winning in AI answers and we're not", "create content
  for the prompts we're missing", "improve our AI visibility with social", "AEO/GEO content plan", or
  "turn our AI search gaps into posts". Always activate when AI-search visibility is the goal and Planable
  is where the content will be made.
---

# AI-search gaps → social campaign

Use SE Ranking's AI Search data to see which prompts and narratives a brand owns, which competitors own, and which are wide open — then build social content in Planable that stakes a claim in the missing narratives, and instrument it so impact is measurable.

> **Scope note (read this).** SE Ranking's AI Search MCP tools expose brand presence, link presence, share of voice, and the prompts behind them. They do **not** expose sentiment scoring. Do not report or imply sentiment from these tools. Social content is one lever on AI visibility — LLM citation is also driven by website content and authority, which is outside what these two MCPs publish.

## Prerequisites

- **SE Ranking MCP** connected (AI Search Data API; optionally a project for the AI Result Tracker, which enables ongoing prompt tracking).
- **Planable MCP** connected, with the destination workspace and pages.
- The user provides: target domain + brand name, country (default `us`), competitor domains + brand names (up to 10), and optionally which engines to focus on (default: all of `ai-overview`, `ai-mode`, `chatgpt`, `perplexity`, `gemini`).

## Connector health check

Before doing anything else, verify both MCPs are reachable:

- **SE Ranking:** call `DATA_getSubscription`. If it fails or returns an auth error, stop immediately and tell the user:
  > "The SE Ranking connector isn't responding — please reconnect it before we continue. Setup guide: https://seranking.com/api/integrations/mcp/"
- **Planable:** call `list_workspaces`. If it fails or returns an auth error, stop immediately and tell the user:
  > "The Planable connector isn't responding — please reconnect it before we continue. Setup guide: https://help.planable.io/hc/en-us/articles/27538577098780-How-to-connect-Planable-MCP-to-your-AI-tools"

Only continue to the process steps below once both calls return a successful response.

## Process

### 1. Resolve the brand and scope
If the user gives a domain but not the exact brand string, call `DATA_getAiSearchBrand(target, source)` to get the name SE Ranking attributes to it. Do the same for each competitor. Confirm the Planable workspace and target platforms.

### 2. Baseline AI visibility
- `DATA_getAiSearchOverview(target, source, brand?)` — baseline metrics.
- `DATA_getAiSearchLeaderboard(primary{target,brand}, competitors[{target,brand}], source, engines[])` — share of voice comparison per engine.

### 3. Find the prompt gaps
For the target and each competitor, pull the prompts behind the presence:
- `DATA_getAiSearchPromptsByBrand(brand, engine, source)` — prompts mentioning the brand by name.
- `DATA_getAiSearchPromptsByTarget(target, engine, source)` — prompts where the domain is cited as a source.

Compare: cluster prompts by topic, then mark each cluster as **owned**, **contested**, or **missing**.

### 4. Turn gaps into content hypotheses
For each target cluster, write a hypothesis: *"If we publish clear, citable content asserting [brand] in [narrative], we should start appearing for prompts like [examples]."*

### 5. Draft and create in Planable
Write platform-appropriate copy, then create drafts: `create_post` or `create_grouped_post`. Tag the batch with a label (e.g. "AI-visibility").

### 6. Instrument before/after measurement
- **Ongoing AI tracking (if a project exists):** create an AI Result Tracker engine with `PROJECT_createLlmEngine` and add the target prompts with `PROJECT_addPrompts(site_id, llm_id, prompts[])`.
- **Periodic re-checks:** re-run `DATA_getAiSearchOverview` and `DATA_getAiSearchLeaderboard`.
- **Social side:** check metrics using `get_post_metrics_summary(workspaceId, pageIds, startDate, endDate)`.
