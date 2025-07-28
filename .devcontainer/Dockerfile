# syntax=docker/dockerfile:1.5
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install base packages
RUN apt-get update && apt-get install -y \
    curl git make build-essential python3 python3-pip python3-venv \
    nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Optional: global Python tools
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip wheel

ENV PATH="/opt/venv/bin:$PATH"

# Optional: global npm tools
RUN --mount=type=cache,target=/root/.npm \
    npm install -g yarn
