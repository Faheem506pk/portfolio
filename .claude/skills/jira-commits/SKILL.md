---
name: jira-commits
description: Find the git commit IDs related to a Jira ticket. Use when the user gives a Jira key (for example KAN-396) or pastes or screenshots a ticket's title, description or checklist and asks for its commit IDs, commits, or "what was committed for this ticket".
---

# Jira ticket to commit IDs

Input: a Jira key and/or the ticket's title, description and checklist (pasted text or a screenshot).

## Steps

1. **Commits that mention the key** (exact match first):
   `git log --all --format='%h|%ad|%an|%s' --date=short -i --grep='<KEY>'`
   Also check branch names: `git branch -a --list '*<KEY>*'`.
2. **If none, or if the key is missing, match by content.** Take 3 to 8 keywords from the title and checklist (feature words, file or area names, for example "printing", "kitchen ticket", "paper width", "logo").
   - Messages: `git log --format='%h|%ad|%s' --date=short -i --grep='<word>'` for each keyword. Add `--all-match` to narrow the results.
   - Changed files: `git log --format='%h|%ad|%s' --date=short -- <paths the ticket is about>`.
   - Limit the search to recent history (`--since`) when the ticket is recent, to keep it fast.
3. **Check each candidate** with `git show --stat --format='%h %s' <id>`. Keep only commits whose message or changed files match a checklist line. Leave out merge commits unless asked.
4. **Map commits to checklist lines.** One commit can cover several lines.

## Output (keep it short)

- A table with these columns: Commit | Date | What it covers (which checklist lines).
- A line for each checklist item that has no matching commit ("not found in git").
- Say if the commits are only local (`git branch -r --contains <id>` is empty), because then they are not visible on GitHub or in Jira yet.
- A paste-ready block for the ticket:
  ```
  Commits:
  - <id> - <short summary>
  ```

## Rules

- Never invent IDs. Every ID must come from a git command you ran.
- Short IDs (8 characters) are fine. Give full IDs only when asked.
- Don't write branch or infrastructure details into the paste-ready block unless the user asks.
- Tip for the user: start future commit messages with the key (`KAN-396 feat: ...`). Jira then links them by itself.
- No em dashes.
