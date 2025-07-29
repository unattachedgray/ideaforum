# syntax=docker/dockerfile:1.5

# Use the official VS Code devcontainer base with Python 3.10 and Debian Bullseye
FROM mcr.microsoft.com/devcontainers/python:1-3.10-bullseye

# Install essential system packages (many are included, but this ensures they exist)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    make \
    build-essential \
    nodejs \
    npm \
    coreutils \
    procps \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Set up a global Python virtual environment
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip wheel

# Set up directories for the 'vscode' user and set ownership
# The 'vscode' user (UID 1000) is created in the base image.
RUN mkdir -p /home/vscode/.npm-global /home/vscode/.npm && \
    chown -R vscode:vscode /home/vscode/.npm-global /home/vscode/.npm

# Add Python venv and npm global to the PATH for all users in the container
ENV PATH="/opt/venv/bin:/home/vscode/.npm-global/bin:${PATH}"

# Now switch to the vscode user
USER vscode

# Configure npm to use the new global directory
RUN npm config set prefix '/home/vscode/.npm-global'

# Install global npm tools (with caching)
# Fix any permission issues with the npm cache first
RUN --mount=type=cache,target=/home/vscode/.npm \
    sudo chown -R vscode:vscode /home/vscode/.npm && \
    npm install -g yarn

# Switch back to root so VS Code can manage the container as expected.
USER root
