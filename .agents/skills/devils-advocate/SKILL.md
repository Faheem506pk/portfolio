---
name: devils-advocate
description: Adversarial end-of-task review. Use after finishing a task (and after each fix loop) to try to prove the work is wrong, incomplete, insecure, or fragile before reporting it done.
---

# Devil's Advocate Review

Your job is to **break** the work, not to approve it. Assume there is at least one real problem and look for it. Do not be polite at the cost of accuracy, and do not invent issues without evidence.

## Inputs
- The original goal and acceptance criteria
- The list of changed files / `git diff`
- Results of typecheck, lint, tests, and the security review

## Procedure
1. **Re-read the requirement** and compare it to what was actually built. List anything missed, misread, or over-built.
2. **Attack the code** through each lens:
   - Correctness: edge cases (null, empty, huge, duplicate, unicode), off-by-one, race conditions, double submit, retries, partial failure, timezone/locale.
   - Security: act as a malicious authenticated user, an anonymous user, and a user from another tenant. Try to read, write, escalate, or enumerate (see `security-review`).
   - Data integrity: missing constraints/indexes, migration rollback, destructive changes, existing rows that violate new rules.
   - Failure modes: network errors, Supabase errors ignored, unhandled promise rejections, error states and loading states in the UI.
   - Performance: N+1 queries, missing indexes, unbounded selects (no pagination/limit), unnecessary client JS, re-render storms.
   - Maintainability: duplicated logic, unclear naming, dead code, missing types, undocumented assumptions.
   - UX / accessibility: keyboard use, labels, focus, contrast, empty/error/loading states.
   - Tests: do tests assert behavior or just run? What important path is untested?
3. **Challenge the assumptions** listed at the start. Which ones were never verified?
4. **Check the claims** in the work log: re-run the key command if a claim of "passes" has no evidence.
5. **Ask "what would a senior reviewer reject this PR for?"** and answer honestly.

## Severity
- **Critical**: security hole, data loss/corruption, broken core feature.
- **High**: likely bug or auth gap in normal use.
- **Medium**: real bug in edge cases, missing validation, missing test for a risky path.
- **Low**: maintainability, naming, minor UX.
- **Info**: suggestion.

## Output format
```
## Devil's Advocate Review (round N)
Verdict: PASS | PASS WITH CAVEATS | FAIL

### Findings
| # | Severity | Location | Problem | Evidence / attack scenario | Suggested fix |

### Unverified assumptions
- ...

### What I could not check
- ...
```

## Verdict rules
- Any Critical/High/Medium finding -> **FAIL**: the implementer must redo the affected subtasks, then re-run security-review and this review.
- Only Low/Info -> PASS WITH CAVEATS (list them in the report).
- No findings -> PASS, but state which lenses you actually applied. "No issues found" without listing what was checked is not acceptable.
- Max 3 rounds; after that, report remaining issues honestly.
