#!/bin/bash
set -e # Exit on error

echo "🚀 Starting Data Refresh & Build Process..."
echo "----------------------------------------"

# 1. Fetch MPs
echo "📋 [1/3] Fetching MPs..."
python3 scripts/fetch_mps.py

# 2. Fetch Bills (List + Details)
# Note: This checks for 685+ items, so it takes time.
echo "📜 [2/3] Fetching Legislative Bills (Lists + Details)..."
echo "    (This may take a few minutes if fetching from scratch)"
python3 scripts/fetch_bills.py

# 3. Build Next.js App
echo "🏗️  [3/3] Building Application..."
cd jawny-sejm
npm run build

echo "----------------------------------------"
echo "✅ Success! Application data updated and build complete."
echo "   Run 'npm run start' in jawny-sejm/ to serve production build,"
echo "   or 'npm run dev' for development."
