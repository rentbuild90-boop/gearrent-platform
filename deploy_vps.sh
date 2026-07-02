#!/bin/bash

# ==============================================================================
# VPS Deployment Script for GearRent Platform
# Run this script on your VPS as root or with sudo privileges.
# ==============================================================================

DOMAIN="gearrent.cloud"
REPO_URL="https://github.com/rentbuild90-boop/gearrent-platform.git"
WEB_DIR="/var/www/$DOMAIN"
BACKUP_DIR="/var/www/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "================================================="
echo "🚀 Starting Deployment for $DOMAIN"
echo "================================================="

# 1. Create backup directory if it doesn't exist
echo "[1/7] Preparing backup directory..."
mkdir -p "$BACKUP_DIR"

# 2. Backup existing directory if it exists and is not empty
if [ -d "$WEB_DIR" ] && [ "$(ls -A $WEB_DIR)" ]; then
    echo "[2/7] Backing up existing files..."
    cd /var/www
    tar -czf "$BACKUP_DIR/${DOMAIN}_backup_${TIMESTAMP}.tar.gz" "$DOMAIN"
    echo "      ✅ Backup saved to $BACKUP_DIR/${DOMAIN}_backup_${TIMESTAMP}.tar.gz"
else
    echo "[2/7] No existing files found to backup. Skipping..."
fi

# 3. Prepare the web directory
echo "[3/7] Preparing primary directory: $WEB_DIR..."
mkdir -p "$WEB_DIR"
cd "$WEB_DIR"

# 4. Fetch the latest code from GitHub
echo "[4/7] Fetching code from GitHub..."
if [ -d ".git" ]; then
    echo "      Repository already exists. Pulling latest changes..."
    git fetch origin main
    git reset --hard origin/main
else
    echo "      Cloning repository for the first time..."
    # Clone into a temporary folder to avoid errors if directory isn't strictly empty
    git clone "$REPO_URL" temp_repo
    cp -r temp_repo/. .
    rm -rf temp_repo
fi

# 5. Auto-edit backend CORS settings in main.py
echo "[5/7] Updating backend CORS settings to allow $DOMAIN..."
if [ -f "backend/app/main.py" ]; then
    # Check if domain is already added to avoid duplicates
    if ! grep -q "$DOMAIN" backend/app/main.py; then
        # Use sed to add the domain into the allow_origins array
        sed -i "s|\"http://localhost:3000\",|\"http://localhost:3000\",\n        \"http://$DOMAIN\",\n        \"https://$DOMAIN\",|g" backend/app/main.py
    fi
    echo "      ✅ CORS updated in backend/app/main.py"
fi

# 6. Setup Environment Variables
echo "[6/7] Setting up environment variables..."
if [ ! -f "backend/.env" ] && [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    echo "      Created backend/.env from example template."
fi

if [ -f "backend/.env" ]; then
    sed -i "s/ENVIRONMENT=development/ENVIRONMENT=production/g" backend/.env
    sed -i "s/DEBUG=True/DEBUG=False/g" backend/.env
    echo "      ✅ Set ENVIRONMENT=production and DEBUG=False in backend/.env"
fi

# 7. Handle Nginx Configuration
echo "[7/7] Updating Nginx configuration..."
if [ -f "nginx/nginx.conf" ]; then
    sed -i "s/server_name localhost;/server_name $DOMAIN www.$DOMAIN;/g" nginx/nginx.conf
    echo "      ✅ Updated Docker Nginx config to use $DOMAIN"
fi

echo "================================================="
echo "✅ Code update and auto-edits complete!"
echo "================================================="
echo "If your VPS already has Nginx running on port 80/443 natively,"
echo "you may need to either:"
echo "  1. Stop the native Nginx: sudo systemctl stop nginx"
echo "  2. OR change the docker-compose.yml to not expose the 'nginx' service on 80/443"
echo "     and let your native Nginx reverse-proxy to localhost:3000 and localhost:8000."
echo ""
echo "To start the application, run:"
echo "cd $WEB_DIR && docker-compose up -d --build"
