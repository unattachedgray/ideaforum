#!/usr/bin/env bash
set -euxo pipefail

# Install Claude CLI if missing
if ! command -v claude &> /dev/null; then
  echo "Installing Claude CLI via npm…"
  npm install -g @anthropic-ai/claude-code
fi

# Verify installation/auth
claude whoami || echo "⚠️ Claude CLI not yet authenticated."
