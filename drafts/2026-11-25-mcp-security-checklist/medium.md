<!--
DRAFT 1, topic 4 (MCP security checklist), free track. Written with AI assistance from verified sources and from the real code of mcp/author-studio.
Medium policy: this text was AI-written, so it needs the disclosure sentence (included below), must NOT be paywalled, and the author should rewrite it in his own words before publishing. To paywall it, the author must write the story himself.
Title options:
1. I Audited My Own MCP Server Before Trusting It: An 8-Point Security Checklist
2. 8 Questions to Ask Before You Run Any MCP Server on Your Machine
3. What the Research Says About MCP Security, Tested on a Real Server
Subtitle: Tool poisoning, prompt injection and plain old code bugs, checked against a 16-tool server I built.
Tags: MCP, AI Security, Software Development, TypeScript, AI Agents
Author must confirm: (a) the first-person claims marked [AUTHOR], (b) that he built and uses the server, (c) the disclosure line, (d) that he is comfortable describing his repo structure publicly.
Sources accessed 2026-11-25, listed at the end. Unverified items are named in the text.
-->

# I Audited My Own MCP Server Before Trusting It: An 8-Point Security Checklist

*Tool poisoning, prompt injection and plain old code bugs, checked against a 16-tool server I built.*

A local MCP server is a program that an AI agent can call, and it runs with your permissions. Before I let mine near my files, I wanted to know what could go wrong.

*This story was written with the assistance of an AI writing program. I checked the sources and the code facts myself.* [AUTHOR: keep only if true, and rewrite in your own words.]

Here is what the security research says to check, and how I applied it to a small server I built for my own writing workflow. It is a self-audit, not a penetration test, and I will say where it stops.

## Why local MCP servers deserve a second look

Elastic Security Labs notes that MCP servers can run locally, where they execute code directly on your machine and carry higher system risk, or remotely, where the main concern is data access. It also points out that every MCP server is still code, so it inherits ordinary software flaws. In the research Elastic cites, 43% of tested server implementations had command injection flaws and 30% allowed unrestricted URL fetching. That figure comes from an earlier March 2025 analysis by other researchers, so treat it as secondhand.

A 2026 paper, "Are AI-assisted Development Tools Immune to Prompt Injection?", tested tool-poisoning attacks against seven MCP clients: Claude Desktop, Claude Code, Cursor, Cline, Continue, Gemini CLI and Langflow. The authors found large differences. Some clients had strong guardrails, while others, such as Cursor, were highly susceptible to cross-tool poisoning, hidden parameter exploitation and unauthorized tool calls. Clients change quickly, so check current versions before you rely on that comparison.

Elastic groups the risks into four classes:

| Class | What it means |
|---|---|
| Traditional vulnerabilities | The server is code and can have command injection, SQL injection or unsafe fetching |
| Tool poisoning | Malicious instructions hidden in a tool's description or parameters |
| Rug pulls, name collision, passive influence | A tool changes after you approved it, or tricks the model into picking a bad tool |
| Orchestration injection | Attacks that combine several tools or servers |

## The server I audited

My server, `author-studio`, gives an AI agent my writing profile, my voice rules, a Medium policy guide and a few draft tools. It is written in TypeScript, talks over stdio, and exposes 16 tools. Most only read project files. Two write: `create_draft` and `add_lesson`.

I used the Elastic recommendations as an audit list and checked each one against the code.

## The 8-point checklist

**1. Does any tool run shell commands or fetch URLs?** This is the first thing to grep for. In my server there is no `child_process` use and no network call, so the two classic flaws behind the 43% and 30% figures have no entry point. If a tool needs a shell or a fetch, that is the code to review hardest.

**2. How does it limit file access?** Every read tool builds its path from a fixed folder plus a validated name. The draft folder name must match `^[a-z0-9-]+$`, so dots, slashes and `..` are rejected. The skill name in `get_platform_guide` uses the same rule, so it can only open `skills/<name>/SKILL.md`.

**3. What can it write, and can it overwrite?** `create_draft` writes only under `drafts/`, validates the slug and date, and opens files with the `wx` flag, which fails if the file already exists. An agent cannot silently replace a draft. `add_lesson` only appends to two files.

```ts
const slugSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{1,60}$/);
await fs.writeFile(file, content, { encoding: "utf8", flag: "wx" });
```

**4. Is every input validated?** Each tool declares a Zod schema with types, enums and length limits, for example a 200,000 character cap on draft content. Validation does not make a tool safe by itself, but it removes the easy mistakes.

**5. Could the tool descriptions be poisoned or changed?** Tool poisoning hides instructions in descriptions or parameters. My descriptions are short, static strings in the source, and I read them as if they were prompts. The rug-pull risk is different: it applies when you update a server you do not control. My server lives in my own repository, so the control is reading the git diff before I rebuild it. If you install a third-party server, pin the version and re-read its tool descriptions after every update.

**6. What text does it hand back to the model?** This is where I found something real. Anything a tool returns becomes model input, so a file can carry instructions. Elastic puts it plainly: any text fed to the LLM can rewrite instructions on the client side. My `get_lessons` tool returns a file that `add_lesson` writes to. That is a memory-poisoning path: a manipulated agent could store an instruction today that a different agent follows next week.

I changed `add_lesson` to reject URLs and obvious instruction phrases such as "ignore previous instructions". That is a weak heuristic, and a determined attacker can phrase around it. The real control is human review, so I read changes to `author/lessons.md` in git before committing. [AUTHOR: confirm you do this, or describe what you actually do.]

**7. Is it sandboxed and least-privilege?** Elastic recommends sandboxing, for example running clients and servers in Docker so credentials are not exposed, and limiting what data an agent can reach. My server runs as my user with access to the project folder it was pointed at through one environment variable. That is better than a whole-disk server, but it is not a sandbox. Gap noted.

**8. Is there human approval and logging?** Elastic advises against "always allow" settings for sensitive tools and recommends logging all tool calls and reviewing them. My server has no audit log of its own, so it relies on the client's approval prompts. Gap noted.

## A checklist you can copy

Before you run any MCP server:

1. Search the code for shell execution, `eval`, and outbound network calls.
2. Check that paths are built from fixed roots and validated names.
3. List every write tool and confirm it cannot overwrite or escape its folder.
4. Confirm inputs have schemas and size limits.
5. Read every tool description like a prompt. Pin versions and re-read after updates.
6. Ask what returned text could contain instructions, especially stored text.
7. Run it with the least access you can, ideally in a container.
8. Keep approvals on for sensitive tools and review the logs.

## What this audit does not prove

I read my own code and ran a few probes. I did not run a fuzzer, a dependency audit or an independent review. A server can pass this list and still have a flaw, and the client matters as much as the server, as the seven-client study shows. The checklist lowers risk. It does not remove it.

If you run MCP servers, which of these eight have you actually checked?

## Sources (accessed 2026-11-25)
- Elastic Security Labs, "MCP Tools: Attack Vectors and Defense Recommendations for Autonomous Agents" (2025-09-19): https://www.elastic.co/security-labs/mcp-tools-attack-defense-recommendations
- Huang, Huang, Milani Fard, "Are AI-assisted Development Tools Immune to Prompt Injection?" (arXiv 2603.21642, 2026-03-23): https://arxiv.org/abs/2603.21642
- Model Context Protocol: https://modelcontextprotocol.io
