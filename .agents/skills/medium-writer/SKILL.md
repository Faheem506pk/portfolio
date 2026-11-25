---
name: medium-writer
description: Draft a Medium story in the author's voice from his real details. Use for any new Medium article, series part, or rewrite proposal. Not for reviewing (use medium-editor).
---

# Medium writer

Prerequisite: skill `author-profile`. Real details from the author, not invention.

## Format
- Length 6 to 9 minutes (1,300 to 2,000 words) unless a series part. Over 2,500 words: split into a series.
- Title: specific, promises only what the body delivers, 6 to 12 words. Give 3 options.
- Subtitle: one sentence, the reader's gain.
- Hook in the first 3 lines: a real moment, a number, or a sharp question. No "In today's world".
- Context in 1 to 2 sentences: who he is, what he builds. No confidential detail.
- Body: 4 to 7 H2 sections, each with one idea, one real example, short paragraphs (2 to 4 sentences, not a stack of one-liners).
- Code: only code he supplied or that was verified to run. Label language. Explain what it does.
- Ending: 3 lines max takeaway plus one question to readers. No recap list.
- Links: official docs for technical claims, his portfolio, a previous story where relevant.
- Tags: exactly 5, e.g. JavaScript, TypeScript, AI, Software Development, Programming.
- Disclose AI assistance or AI-generated images when used.

## Process
1. Confirm the brief (idea, reader, real details) in `drafts/<slug>/brief.md`.
2. Write outline, get a nod if details are thin.
3. Write draft to `drafts/<slug>/medium.md` with a header block: title options, subtitle, tags, sources, open [FILL] items.
4. Self-check: no em dashes, no invented facts, every claim sourced or from the author, voice matches `author/voice.md`.
5. Stop. Offer review via `medium-editor`.
