---
name: seo-google
description: Connects to Google APIs (Search Console, Analytics 4, PageSpeed Insights, Chrome UX Report, Indexing API, and NLP) to generate performance reports, audit core web vitals, check URL indexation status, and track organic traffic trends.
---

# Google SEO Integration

Integrate directly with Google APIs to retrieve real-world organic traffic, search visibility, indexation status, and page speed field performance.

## When to use this skill

- To run Core Web Vitals audits using Chrome UX Report (CrUX) and PageSpeed Insights (PSI).
- To inspect page indexation status using the Google Search Console (GSC) URL Inspection API.
- To retrieve click, impression, CTR, and keyword rankings from Google Search Console.
- To inspect organic user sessions and traffic metrics via GA4.
- To notify Google of content updates using the Indexing API.

## How to use it

### 1. Verification of Credentials
Before running any Google integration, check the credential tier:
```bash
python scripts/google_auth.py --check
```
Verify which services are marked `[OK]`.

### 2. Core Web Vitals Audit
Run audits to generate reports matching the `assets/templates/cwv-audit-report.md` template:
```bash
python scripts/pagespeed_check.py "https://example.com" --crux-only --json
```

### 3. GSC Performance & Indexation Checks
Generate search console performance snapshots or check URL indexing:
```bash
python scripts/gsc_query.py --property "sc-domain:example.com" --days 28 --json
python scripts/gsc_inspect.py "https://example.com/page" --site-url "sc-domain:example.com" --json
```

### 4. Code Integration Pattern
Refer to `references/cross-skill-integration.md` to see how other skills (like `seo-technical-audit`, `seo-page`, and `seo-drift`) query these scripts and parse the resulting JSON data to enrich their final markdown reports.
