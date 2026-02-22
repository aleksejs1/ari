#!/bin/bash
set -e

# Start messenger consumers in background
echo "Starting messenger workers..."
# Run from core directory, assume /app is the root mount
(cd /app/core && while true; do php bin/console messenger:consume async --memory-limit=128M --time-limit=3600; sleep 5; done) &
(cd /app/core && while true; do php bin/console messenger:consume ai_async --memory-limit=128M --time-limit=3600; sleep 5; done) &

exec "$@"
