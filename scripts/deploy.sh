#!/usr/bin/env bash
# deploy.sh — Idempotent production deployment script for Commercio on AWS EC2
# Usage: bash scripts/deploy.sh
# Safe to run multiple times — each step checks state before acting.

set -euo pipefail

APP_DIR="$HOME/Commercio"
REPO_URL="https://github.com/MannVaswani4/Commercio.git"
PM2_APP_NAME="commercio"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Commercio — Deployment Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Clone or pull repo ─────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
    echo "[1/5] Pulling latest code..."
    git -C "$APP_DIR" pull origin main
else
    echo "[1/5] Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
fi

# ── 2. Install server dependencies ───────────────────────
echo "[2/5] Installing server dependencies..."
cd "$APP_DIR/server"
npm ci --omit=dev

# ── 3. Build client ───────────────────────────────────────
echo "[3/5] Building client..."
cd "$APP_DIR/client"
npm ci
npm run build

# ── 4. Copy built client into server/public (optional) ───
# Uncomment if you serve client from Express in production
# echo "Copying client build to server/public..."
# mkdir -p "$APP_DIR/server/public"
# cp -r "$APP_DIR/client/dist/." "$APP_DIR/server/public/"

# ── 5. Start or restart PM2 ──────────────────────────────
echo "[4/5] Starting/restarting PM2 process..."
cd "$APP_DIR/server"

if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
    echo "  → Process exists, restarting..."
    pm2 restart "$PM2_APP_NAME"
else
    echo "  → No existing process, starting fresh..."
    pm2 start server.js --name "$PM2_APP_NAME"
fi

# ── 6. Save PM2 process list ─────────────────────────────
echo "[5/5] Saving PM2 config for auto-restart on reboot..."
pm2 save

echo ""
echo "✅ Deployment complete!"
echo "   App running as PM2 process: $PM2_APP_NAME"
echo "   Run 'pm2 logs $PM2_APP_NAME' to view logs."
