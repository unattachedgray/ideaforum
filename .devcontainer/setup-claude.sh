#!/bin/bash
# .devcontainer/setup-claude.sh

# Exit on error
set -e

# Configure npm to use the persisted global directory
npm config set prefix ~/.npm-global

# Add to PATH
export PATH=$PATH:~/.npm-global/bin

# Check if claude is already installed
if command -v claude &> /dev/null; then
    echo "✅ Claude CLI already installed at: $(which claude)"
else
    echo "📦 Installing Claude CLI..."
    npm install -g @anthropic-ai/claude-cli
    echo "✅ Claude CLI installed at: $(which claude)"
fi

# Check authentication
if [ -f "$HOME/.claude/.credentials.json" ]; then
    echo "✅ Claude authentication file found"
else
    echo "⚠️ Claude not authenticated. Please run 'claude login' in the terminal"
fi