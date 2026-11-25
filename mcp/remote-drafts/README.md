# Remote MCP: Medium drafts

A small MCP server hosted by this site at `https://faheem506pk.vercel.app/api/mcp` (Streamable HTTP, stateless). Any MCP client can connect with a bearer token and **save a draft story**. It can do two things only:

| Tool | What it does |
|---|---|
| `create_medium_draft` | Saves one story as a **private draft** (never published, `noindex`) in the admin Posts list, ready to copy into Medium. Rejects anything that breaks Medium's rules. |
| `get_draft_quota` | Read-only. Drafts used today and remaining out of 100. |

It cannot publish, read, edit or delete anything, and it has no other tools.

## Safety and security

- **Fail-closed bearer auth.** `MCP_API_TOKEN` (at least 32 characters) is compared in constant time against a SHA-256 digest. No token configured means nobody gets in. `MCP_API_TOKEN_NEXT` allows rotation without downtime.
- **Not for browsers.** Any request with an `Origin` header is refused (no CORS, protects against DNS rebinding). Only `POST` is accepted.
- **Limits enforced in the database**, so parallel requests cannot bypass them: 100 drafts per day (UTC) and 10 per minute. A failed save gives its slot back.
- **Strict input validation:** only the five documented fields, title 10 to 120 characters, body 300 words to 60,000 characters, 1 to 5 plain tags, no raw HTML such as script or iframe, 200 KB request cap.
- **Medium policy gate before saving:** AI-assisted text needs the disclosure sentence in the first two paragraphs, no `[FILL]` or `[AUTHOR]` notes, no secrets, phone numbers or personal emails, and no employer or client project names (extend the list with `MCP_FORBIDDEN_TERMS`). Duplicate titles are refused.
- **Drafts only.** `status` is always `draft`, `paywall` is always `false`, and the story still has to be reviewed and published by you on Medium.
- **Audit log.** Every saved draft is logged (time, post, short token fingerprint, never the token) in `mcp_draft_log`. The tables and functions are not readable from the browser.
- **Server-side secrets only.** The service key stays in Vercel environment variables. Errors never include internal details.

## Set up (once)

1. Apply the database update: `npm run db:push` (migration `0005_remote_mcp_drafts.sql`).
2. Create a token and keep it private: `openssl rand -hex 32`.
3. In Vercel, Project Settings, Environment Variables, add `MCP_API_TOKEN` (Production and Preview). Do not commit it or paste it in chat. Redeploy.
4. Recommended: add a Vercel Firewall rate-limit rule for `/api/mcp` (for example 30 requests per minute per IP). The app limits drafts, and the firewall limits guessing.
5. To revoke access at any time, delete `MCP_API_TOKEN` (and `MCP_API_TOKEN_NEXT`) and redeploy. The endpoint then refuses everyone.

## Connect a client

Keep the token in an environment variable, for example `MEDIUM_DRAFTS_TOKEN`.

Claude Code:

```bash
claude mcp add --transport http medium-drafts https://faheem506pk.vercel.app/api/mcp \
  --header "Authorization: Bearer $MEDIUM_DRAFTS_TOKEN"
```

Codex (`~/.codex/config.toml`), check the option names against your Codex version:

```toml
[mcp_servers.medium-drafts]
url = "https://faheem506pk.vercel.app/api/mcp"
bearer_token_env_var = "MEDIUM_DRAFTS_TOKEN"
```

Other clients (Antigravity and similar) need the URL and an `Authorization: Bearer <token>` header; see that client's MCP documentation for the exact field names.

## Rules for the agent calling it

- Write the story from the author's real details. Never invent anecdotes, numbers or quotes.
- If any text was written by AI, set `ai_assisted` to `true` and include the disclosure sentence near the top. AI-written text cannot be paywalled on Medium.
- Never mention employer or client projects.
- One story per call. The author reviews and publishes on Medium himself.
