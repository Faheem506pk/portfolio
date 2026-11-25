# author-studio MCP server

Gives any MCP-capable agent (Claude Code, Codex, Antigravity) the author's profile, voice, platform guides, and draft tools. It can only read project files and create new files under `drafts/`. It cannot publish anywhere.

## Build
```bash
cd mcp/author-studio && npm install && npm run build
```

## Tools
get_author_profile, get_voice_guide, get_strategy, list_published_stories, list_open_questions, list_skills, get_platform_guide, list_drafts, read_draft, create_draft, check_draft.

## Connect
- Claude Code: `.mcp.json` already has `author-studio`.
- Antigravity: `.agents/mcp_config.json` already has it.
- Codex (`~/.codex/config.toml`):
```toml
[mcp_servers.author-studio]
command = "node"
args = ["/home/faheem506pk/medium-editor-system/mcp/author-studio/dist/index.js"]
env = { AUTHOR_STUDIO_ROOT = "/home/faheem506pk/medium-editor-system" }
```
Paths point to the main checkout. After merging this branch, rebuild there.
