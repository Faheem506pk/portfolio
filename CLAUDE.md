@AGENTS.md

## Claude Code specifics
- Skills are in `.claude/skills/` (copied from `skills/` by `scripts/sync-skills.sh`). Invoke `topic-research` before `medium-writer`.
- The `author-studio` MCP server is declared in `.mcp.json`. Rebuild with `cd mcp/author-studio && npm install && npm run build` after pulling.
- Plan mode is fine for choosing topics. Draft only: never publish, post or edit external accounts.
- Respect the CPU rules in the user's global CLAUDE.md: one subagent at a time, no concurrent builds.
