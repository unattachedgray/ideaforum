default:
    @echo "Available: dev, test, build, lint, shell"

dev:
    python3 forum/main.py

test:
    pytest tests/

build:
    docker build -t forum .

shell:
    bash
