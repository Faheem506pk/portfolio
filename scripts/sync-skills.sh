#!/usr/bin/env bash
# Copy skills/ (source of truth) into agent-specific folders.
set -euo pipefail
cd "$(dirname "$0")/.."
for dir in skills/*/; do
  name=$(basename "$dir")
  for target in .claude/skills .agents/skills; do
    mkdir -p "$target/$name"
    cp "$dir/SKILL.md" "$target/$name/SKILL.md"
  done
done
# medium-editor stubs (.claude/skills/medium-editor, .agents/skills/medium-editor) point to the root SKILL.md and are not overwritten.
echo "Skills synced."
