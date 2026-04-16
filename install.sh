#!/usr/bin/env bash
# claude-shaders standalone installer
# Usage: curl -fsSL https://raw.githubusercontent.com/0xjitsu/claude-shaders/main/install.sh | bash
set -euo pipefail

DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
REPO="${CLAUDE_SHADERS_REPO:-https://github.com/0xjitsu/claude-shaders}"
BRANCH="${CLAUDE_SHADERS_BRANCH:-main}"

echo "Installing claude-shaders..."
mkdir -p "$DEST"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 --branch "$BRANCH" "$REPO" "$TMP" 2>/dev/null
rm -rf "$DEST/jitsu-shaders"
cp -R "$TMP/skills/jitsu-shaders" "$DEST/jitsu-shaders"
echo "✓ claude-shaders installed to $DEST/jitsu-shaders"
echo "  Restart Claude Code to pick up the new skill."
