---
name: content-pipeline
description: End to end workflow for turning one idea into a Medium story, LinkedIn post, X thread and YouTube script for the author. Use when he asks to write, plan or repurpose content, or says "write a story", "make a video script", "content plan".
---

# Content pipeline

1. **Load context**: skill `author-profile`. Check `author/stories-index.md` to avoid duplicates.
2. **Pick the idea**: from the pillars in `author/goals-and-strategy.md`. One idea, one reader problem.
3. **Interview the author**: ask for real details (what he did, what broke, what he learned, a snippet he can publish). Use the question list in `articles/*-outline.md` if present. Do not proceed to prose with placeholders unfilled.
4. **Research and verify**: check technical claims against primary docs. Record URLs.
5. **Draft the main piece**: skill `medium-writer`. Save to `drafts/YYYY-MM-DD-slug/medium.md`.
6. **Review**: run the `medium-editor` skill (root `SKILL.md`) and save a report in `reviews/`. Run the `check_draft` MCP tool or Vale.
7. **Repurpose** only after the Medium draft is approved:
   - `linkedin-post` -> `drafts/.../linkedin.md`
   - `x-thread` -> `drafts/.../x-thread.md`
   - `youtube-script` -> `drafts/.../youtube.md`
8. **Hand off**: tell the author where files are. He publishes manually. Move approved finals to `articles/`.

Folder per idea: `drafts/YYYY-MM-DD-slug/` with `brief.md`, platform files, and `sources.md`.
