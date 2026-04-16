#!/usr/bin/env bash
set -euo pipefail
JITSU_OS="${JITSU_OS:-$HOME/jitsu-os}"
SRC="$JITSU_OS/skills/jitsu-shaders"
DEST="$(cd "$(dirname "$0")/.." && pwd)/skills/jitsu-shaders"

if [[ ! -d "$SRC" ]]; then
  echo "error: jitsu-os not found at $JITSU_OS" >&2
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST"

# Copy only distributable files
cp "$SRC/SKILL.md" "$DEST/"
cp -R "$SRC/references" "$DEST/"
cp -R "$SRC/components" "$DEST/"
cp -R "$SRC/presets" "$DEST/"

# Remove non-distributable files from presets copy
find "$DEST" -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find "$DEST" -name "*.test.ts" -delete 2>/dev/null || true

echo "synced from $SRC → $DEST"
