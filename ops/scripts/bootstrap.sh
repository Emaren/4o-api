#!/usr/bin/env bash
set -euo pipefail

npm install
cp .env.example .env || true
cp 4o-api/.env.example 4o-api/.env || true
cp 4o-web/.env.example 4o-web/.env || true

echo "Bootstrap complete. Run: npm run dev"
