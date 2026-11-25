# Commit messages must start with a Jira key (STRICT)

Every commit message starts with the Jira ticket key, a colon and a space:

```
KAN-396: fix logo size on Native receipts
```

- Format: `KAN-<number>: <short summary in plain words>`. One line, under about 72 characters. A body can follow after a blank line.
- **Which key to use**, in this order:
  1. The key the user gave for this work.
  2. The key in the branch name (for example `KAN-396-printing`).
  3. The key of the most recent commit on this branch (`git log -20 --format=%s | grep -oE '^KAN-[0-9]+' | head -1`), when the work is a continuation of it.
  4. If none of these exists, **ask the user for the ticket key**. Never invent one and never use `KAN-XXXX` as a placeholder.
- Enforced by `.githooks/commit-msg` (commit refused without a key) and `.githooks/pre-push` (push refused for new commits without a key). `bun install` turns the hooks on (`core.hooksPath .githooks`), and Claude Code runs `.githooks/ensure-hooks.sh` at every session start (`.claude/settings.json`). If an AI agent finds `git config core.hooksPath` is not `.githooks`, it runs `bash .githooks/ensure-hooks.sh` before committing and tells the developer.
- Allowed without a key: Git's own `Merge ...` and `Revert "..."` messages, and `fixup!` / `squash!` commits.
- No em dashes in commit messages.

Mirrored: `.cursor/rules/commit-messages.mdc`, `.vscode/settings.json` (Copilot commit message instructions), `AGENTS.md`.
