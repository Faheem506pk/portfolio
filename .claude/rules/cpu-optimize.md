# Optimize CPU (STRICT — non-negotiable)

**MUST** keep machine CPU load low. Lean sequential work only. This rule overrides convenience parallelization.

## Agents & subprocesses

- **NEVER** spawn parallel background/sibling agents unless the user explicitly asks.
- **MUST** run at most **ONE** subagent/task at a time by default.
- **NEVER** spawn multiple index/reindex jobs (codebase-memory, project-mind, or similar).
- **MUST** stop heavy work immediately if CPU is pegged (slow responses, fan noise, high load) and ask before continuing.

## Discovery (one path only)

- **NEVER** call both codebase-memory MCP **and** project-mind MCP (or duplicate MCP indexers) against the same repo/discovery.
- **MUST** pick one tool path and stick to it.
- **NEVER** full-repo recursive scans/greps/directory walks when graph/snippet tools (`search_graph`, `get_code_snippet`, etc.) can locate the symbol.

## Builds, typechecks, installs

- **NEVER** run concurrent `tsc` / build / yarn / bun across apps (root Vite, `landing-page/`, `storefront-next/`).
- **MUST** skip verify typechecks/builds/full test suites unless the user asks or the change is high-risk.
- **NEVER** re-run install/translate/typecheck redundantly when nothing relevant changed.

## Default posture

Lean first. Escalate to heavy verify **only** when correctness demands it or the user requests it.

Mirrored: `.cursor/rules/cpu-optimize.mdc`, root `AGENTS.md` hard rule 23.
