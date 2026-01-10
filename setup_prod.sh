#!/bin/bash
set -e

if [ -f .env ]; then
    echo "Control file '.env' already exists. Skipping generation to avoid overwriting secrets."
    echo "If you want to regenerate it, please delete '.env' first."
    exit 0
fi

echo "Generating .env file from .env.prod.example..."

# Generate random secrets
APP_SECRET=$(openssl rand -hex 32)
JWT_PASSPHRASE=$(openssl rand -hex 32)
MARIADB_PASSWORD=$(openssl rand -hex 16)
MARIADB_ROOT_PASSWORD=$(openssl rand -hex 16)

# Read example file and replace placeholders
sed "s/APP_SECRET=.*/APP_SECRET=$APP_SECRET/" .env.prod.example | \
sed "s/JWT_PASSPHRASE=.*/JWT_PASSPHRASE=$JWT_PASSPHRASE/" | \
sed "s/MARIADB_PASSWORD=.*/MARIADB_PASSWORD=$MARIADB_PASSWORD/" | \
sed "s/MARIADB_ROOT_PASSWORD=.*/MARIADB_ROOT_PASSWORD=$MARIADB_ROOT_PASSWORD/" > .env

echo "✅ .env file created with secure random passwords!"
echo "You can now run: docker compose -f compose.prod.yaml up -d --build"
