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

# Ask for Database Preference
echo ""
echo "Choose database:"
echo "1) SQLite (Default, simplest)"
echo "2) MySQL (MariaDB container)"
read -p "Enter choice [1]: " db_choice

if [ "$db_choice" = "2" ]; then
    echo "Configuring for MariaDB..."
    # Uncomment lines in .env if they are commented out, or append if missing.
    # But .env.prod.example usually has them. Let's just append/replace.
    
    # We surely need to set DB_CONNECTION=mysql and COMPOSE_PROFILES=mysql
    if grep -q "DB_CONNECTION=" .env; then
        sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env
    else
        echo "DB_CONNECTION=mysql" >> .env
    fi

    if grep -q "COMPOSE_PROFILES=" .env; then
        sed -i 's/COMPOSE_PROFILES=.*/COMPOSE_PROFILES=mysql/' .env
    else
        echo "COMPOSE_PROFILES=mysql" >> .env
    fi
else
    echo "Configuring for SQLite..."
    # Ensure default is sqlite
     if grep -q "DB_CONNECTION=" .env; then
        sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
    else
        echo "DB_CONNECTION=sqlite" >> .env
    fi
    # No profiles needed
fi

echo "✅ .env file created with secure random passwords!"
echo "You can now run: docker compose -f compose.prod.yaml up -d --build"
