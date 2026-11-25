---
name: task-workflow
description: Use for EVERY coding task. Decomposes the task into verifiable subtasks, executes them one at a time with checks, runs security and devil's-advocate reviews, redoes work that fails review, and ends with a written report.
---

# Task Workflow

## Phase 1 - Understand
- Restate the goal in 1-3 sentences, list assumptions, and write acceptance criteria.
- Read the relevant existing code first (routes, components, migrations, policies). Match existing conventions.
- Ask the user only when a wrong assumption would be expensive or irreversible (data loss, auth model, public API shape). Otherwise state the assumption and continue.

## Phase 2 - Decompose
Create a task list. Each subtask must:
- Have one concern (e.g. "add migration + RLS policy", "write server action", "build form UI", "add tests").
- Be independently verifiable (a command, a test, or a concrete check).
- Be ordered by dependency; put database/security-critical work first.

Always include these final subtasks: **Security pass**, **Devil's advocate review**, **Report**.

## Phase 3 - Execute (loop per subtask)
For each subtask:
1. Mark it in progress.
2. Implement the smallest change that satisfies it.
3. Verify: typecheck, lint, relevant tests. Run them, do not assume.
4. Self-challenge in writing (2-4 bullets): inputs that break it, who could abuse it, what happens on failure/empty/huge/concurrent input, what it does to existing behavior.
5. Fix anything found, then mark complete.
Do not start the next subtask with a failing check.

## Phase 4 - Security pass
Run the `security-review` skill on every file touched. Record findings with severity.

## Phase 5 - Devil's advocate review
Run the `devils-advocate` skill. Preferably delegate to the `devils-advocate-reviewer` subagent so the review is done by a context that did not write the code. Give it: the goal, acceptance criteria, and the list of changed files (or `git diff`).

## Phase 6 - Fix loop
- Findings of severity Critical/High/Medium: redo the affected subtasks, then re-run Phase 4 and 5.
- Low/Info: fix if cheap, otherwise list in the report.
- Maximum 3 loops. If still failing, stop and report what remains and why. Never silently drop a finding.

## Phase 7 - Report
Write the final report using `REPORT_TEMPLATE.md` in this folder. It must be honest: list what was NOT verified and any residual risks.

## Rules of conduct
- Evidence over claims: quote command names and results.
- If a subtask turns out larger than expected, split it again.
- Do not widen scope; note out-of-scope problems in the report instead.
- If you discover your earlier work was wrong, say so and fix it.
