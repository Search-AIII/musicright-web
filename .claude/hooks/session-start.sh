#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-/home/user/musicright-web}"

# Install dependencies (uses cache if node_modules already present)
npm install

# Ensure dev server watchdog is running
WATCHDOG=/root/.claude/keep-server-alive.sh
if [ -f "$WATCHDOG" ]; then
  pkill -f keep-server-alive 2>/dev/null || true
  nohup bash "$WATCHDOG" >> /tmp/watchdog.log 2>&1 &
fi
