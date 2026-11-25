---
name: seo-ai-social-report
description: >
  Generate one unified performance report that brings together SEO rankings, AI-search visibility
  (SE Ranking) and social engagement (Planable) — delivered as a short text summary in chat plus a
  self-contained interactive HTML report. Use this skill whenever the user wants a combined cross-channel
  report, or says things like "give me a full report across SEO and social", "how did we do this month
  across search and social", "combined SEO + AI + social report for [client]", "build a cross-channel
  dashboard", or "one report that covers rankings, AI visibility and social". Always activate when the
  request spans both search (SE Ranking) and social (Planable) in a single report.
---

# Unified SEO + AI + social report

Most reporting forces clients to read three tools separately. This produces one view: search rankings and AI-search visibility from SE Ranking, social engagement from Planable, with quick text conclusions for the inbox and an interactive HTML report for the detail.

## Prerequisites

- **SE Ranking MCP** connected (a project gives the cleanest ranking trend; Data API history works without one).
- **Planable MCP** connected, with the workspace and connected pages.
- The user provides: domain + brand, market/country (default `us`), the Planable workspace, the reporting period (default: previous calendar month), and optionally competitors for share-of-service.

## Connector health check

Before doing anything else, verify both MCPs are reachable:
- **SE Ranking:** call `DATA_getSubscription`.
- **Planable:** call `list_workspaces`.

## Process

### 1. Scope
Confirm domain, Planable workspace, period, and competitors. Resolve the period to explicit start/end dates.

### 2. Pull SEO (SE Ranking)
- **With a project:** `PROJECT_getSummary` and `PROJECT_getPositionHistory`.
- **Without a project:** `DATA_getDomainOverviewWorldwide`.

### 3. Pull AI search (SE Ranking)
- `DATA_getAiSearchOverview` with the default time-series view.
- `DATA_getAiSearchLeaderboard` — share of voice vs competitors.

### 4. Pull social (Planable)
- `list_pages(workspaceId)` → page IDs.
- `get_page_metrics_summary(workspaceId, pageIds, startDate, endDate)` — account-level audience/impressions/engagement-rate.
- `get_post_metrics_summary(workspaceId, pageIds, startDate, endDate)` — published-post totals.
- `get_post_metrics` — top posts.
- `list_posts` — posts published in the period.

### 5. Write the quick conclusions (chat)
A ~10–15 line plain-text summary highlighting search, AI, and social changes.

### 6. Build the interactive HTML report
Use Chart.js (CDN) to render dual-axis trend charts, KPI cards, share-of-voice bar charts, and top social posts. Save to output folder as `{client}-{period}-cross-channel-report.html`.
