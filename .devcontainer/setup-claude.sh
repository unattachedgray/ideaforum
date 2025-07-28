#!/bin/bash
set -e

# Install Claude CLI if missing
if [ ! -f "$HOME/claude-code/claude" ]; then
  echo "Installing Claude CLI..."
  git clone https://github.com/anthropics/claude.git "$HOME/claude-code"
  chmod +x "$HOME/claude-code/claude"
  ln -sf "$HOME/claude-code/claude" /usr/local/bin/claude
fi

# Test that it's available
claude whoami || echo "⚠️ Claude CLI not yet authenticated."
