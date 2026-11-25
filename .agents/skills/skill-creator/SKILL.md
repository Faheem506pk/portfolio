---
name: skill-creator
description: Guides the agent on how to create, structure, and document new skills within the workspace customization root under .agents/skills/. Use when the user requests to create or register a new agent skill.
---

# Skill Creator

This skill defines the canonical guidelines and standards for creating and organizing new skills inside the workspace customization root.

## When to use this skill

- When the user asks to create a new skill or behavior template.
- When saving a repeatable pattern, architectural style, or design guideline as a reusable agent instruction.

## How to use it

### 1. Skill Directory Structure
Create a dedicated subdirectory for the skill inside the `.agents/skills/` directory.

```
.agents/skills/
└─── <new-skill-name>/
    ├─── SKILL.md       # Primary instructions (required)
    ├─── scripts/       # Helper scripts and automation utilities (optional)
    ├─── examples/      # Reference code blocks and implementations (optional)
    └─── resources/     # Page configurations, database schemas, and templates (optional)
```

### 2. Main Instruction File (`SKILL.md`)
Every skill must have a `SKILL.md` file at its root containing YAML frontmatter:

```markdown
---
name: <new-skill-name>
description: A clear, third-person description of what the skill does, specifying when it should be applied (e.g., "Generates unit tests for React components using Vitest.")
---

# <Skill Title>

Detailed instructions, coding conventions, or optimization rules for the agent.

## When to use this skill

- Specific conditions, file paths, or triggers when this skill is applicable.

## How to use it

Step-by-step guidance, code blocks, reference architectures, or constraints the agent must follow.
```

### 3. File Creation Protocol
Use the `write_to_file` tool to create the skill structure. Do NOT pass the `ArtifactMetadata` parameter to this tool unless explicitly writing markdown reports to the conversation's artifacts directory.
