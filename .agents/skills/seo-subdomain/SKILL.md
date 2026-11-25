---
name: seo-subdomain
description: Subdomain ownership map for a domain. Lists subdomains, queries overview/keywords/competitors/backlinks per subdomain, surfaces which subdomains own which topic clusters, where there's fragmentation, and whether consolidation is warranted. Use when the user asks "subdomain analysis", "subdomain ownership", "subdomain SEO", "blog vs main domain", "support vs docs subdomain", or "should I consolidate subdomains".
---

# Subdomain Analysis

Map a domain's subdomain ecosystem. Which subdomains exist, what each ranks for, where they overlap, and whether the structure is healthy or fragmented. Output: an ownership map (which topic is owned by which subdomain), a fragmentation report, and recommendations to consolidate / split / leave alone.

## Prerequisites

- SE Ranking MCP server connected.
- User provides: a target root domain (e.g. `example.com`). The skill discovers subdomains automatically.
- Optional: `--limit N` to cap the number of subdomains analysed (default: top 10 by ranked keyword count).

## Process

1. **Validate & preflight**
   - Normalise root domain.
   - `DATA_getCreditBalance` — check credits.

2. **Discover subdomains** `DATA_getDomainSubdomains`
   - Discover and list all subdomains. Top N (default 10) sorted by ranked-keyword count.

3. **Per-subdomain overview** `DATA_getDomainOverviewWorldwide`
   - Pull Domain Authority (DA), organic/paid keyword counts, and traffic estimates.

4. **Per-subdomain top keywords** `DATA_getDomainKeywords`
   - Retrieve top 100 organic keywords with positions, intent, and traffic to build an ownership map.

5. **Per-subdomain competitors** `DATA_getDomainCompetitors`
   - Map common competitors and determine redundancy.

6. **Per-subdomain backlinks** `DATA_getBacklinksSummary` and `DATA_getBacklinksRefDomains`
   - Evaluate backlink profile splits.

7. **Authority distribution** `DATA_getDistributionOfDomainAuthority`
   - Pull DA distribution of referring domains.

8. **Detect fragmentation**
   - Identify cannibalization where multiple subdomains target similar keyword groupings.

9. **Make recommendations**
   - **Consolidate:** Merge redundant/overlapping subdomains.
   - **Split:** Preserve healthy subdomains with distinct topical focuses.
   - **Leave alone:** Retain balanced domain setups.

10. **Synthesise** `SUBDOMAINS.md`

## Output format

Create a folder `seo-subdomain-{target-slug}-{YYYYMMDD}/` with:

```
seo-subdomain-{target-slug}-{YYYYMMDD}/
├── SUBDOMAINS.md                       (synthesised report + recommendations — primary deliverable)
├── 06-topic-ownership-map.md           (cluster × subdomain matrix)
├── 07-fragmentation-flags.md           (cannibalization detected)
└── evidence/
    ├── 01-subdomains-list.md
    ├── 02-overview-by-subdomain.md
    ├── 03-keywords-by-subdomain/
    ├── 04-competitors-by-subdomain.md
    └── 05-backlinks-by-subdomain.md
```

## Tips

- Set `--limit` to 10 by default to prevent rate limits or excessive credit costs.
- Do not consolidate subdomains hosted on different platforms unless the engineering effort justifies the conversion.
