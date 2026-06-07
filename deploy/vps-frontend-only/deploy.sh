#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROJECT="coffeemart-frontend"

cd "$REPO_ROOT"

echo "=== Pulling latest code ==="
git pull origin main || git pull origin master

echo "=== Building Docker image ==="
docker build -f deploy/vps-frontend-only/Dockerfile -t "$PROJECT:latest" .

echo "=== Stopping old container ==="
docker stop "$PROJECT" 2>/dev/null || true
docker rm "$PROJECT" 2>/dev/null || true

echo "=== Starting new container ==="
docker run -d --name "$PROJECT" --restart unless-stopped -p 80:80 "$PROJECT:latest"

echo "=== Cleaning up old images ==="
docker image prune -af --filter "until=24h" || true

echo "=== Deploy complete ==="
