---
name: lessons-learned
description: Learning loop for this project. Read the lessons and study queue before starting work, and record what was learned (corrections, verified facts, mistakes, new things to study) when finishing. Use at the start and end of every session or task.
---

# Lessons learned and study loop

Files: `author/lessons.md` (what we learned) and `author/study-queue.md` (what to study next). MCP tools: `get_lessons`, `add_lesson`.

## At the start of every task
1. Read `author/lessons.md`. Apply every relevant lesson. Do not repeat a recorded mistake.
2. Read `author/study-queue.md`. If the task touches a queued item, study it first and note the result.

## During the task
- When a source corrects you, a fact changes, a tool fails, or the author corrects you, note it immediately.

## At the end of every task (required)
1. Add 1 to 5 short lessons to `author/lessons.md`: date, area, lesson, and why. Only lessons that will change future behavior. No duplicates, merge with existing ones.
2. Add what is worth studying next to `author/study-queue.md` (one line each: topic, why, where to start).
3. Move studied items to Done with a one-line takeaway.
4. If a lesson changes a rule, update `AGENTS.md` (keep it short) and the relevant skill, then run `scripts/sync-skills.sh`.
5. Tell the author the lessons you recorded in one short list.

## Quality rules for lessons
- Specific and testable ("check arXiv for the latest version before quoting numbers"), not vague ("be careful").
- Record sources and dates. Mark anything unverified.
- Never store secrets, `.env` contents, phone numbers, or personal email.
- No em dashes.
