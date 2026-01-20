#!/bin/bash
set -e # Exit on error

echo "🚀 Starting Data Refresh & Build Process..."
echo "----------------------------------------"

# 1. Fetch MPs
echo "📋 [1/7] Fetching MPs..."
python3 backend/fetch_mps.py

# 2. Fetch Bills (List + Details)
echo "📜 [2/7] Fetching Legislative Bills (Lists + Details)..."
python3 backend/fetch_bills.py

# 3. Fetch Votings
echo "🗳️  [3/7] Fetching Votings (Sejm)..."
python3 backend/fetch_votings.py

# 4. Fetch Interpellations
echo "❓ [4/7] Fetching Interpellations..."
python3 backend/fetch_interpellations.py

# 5. Fetch Senate Data
echo "🏛️  [5/7] Fetching Senate Data (Slow)..."
python3 backend/fetch_senate.py

# 6. Fetch RCL Data
echo "⚖️  [6/7] Fetching Government Bills (RCL)..."
python3 backend/fetch_rcl.py

# 7. Build Next.js App
echo "🏗️  [7/7] Building Application..."
cd frontend
npm run build

echo "----------------------------------------"
echo "✅ Success! Application data updated and build complete."
echo "   Run 'npm run start' in frontend/ to serve production build,"
echo "   or 'npm run dev' for development."
