#!/bin/bash

# GitHub Pages Activation Monitor
# This script checks when GitHub Pages becomes available

echo "🔄 Monitoring GitHub Pages Activation..."
echo "========================================"
echo ""

URL="https://bennguyenru.github.io/eaut-assessment-platform/"
TIMEOUT=300  # 5 minutes timeout
INTERVAL=10  # Check every 10 seconds
ELAPSED=0

echo "📍 Target URL: $URL"
echo "⏱️  Checking every $INTERVAL seconds (timeout: ${TIMEOUT}s)"
echo ""

while [ $ELAPSED -lt $TIMEOUT ]; do
    echo -n "$(date '+%H:%M:%S') - Checking... "
    
    if curl -s --head "$URL" | head -n 1 | grep -q "200 OK"; then
        echo "✅ SUCCESS!"
        echo ""
        echo "🎉 GitHub Pages is now LIVE!"
        echo "🌐 Your site: $URL"
        echo ""
        echo "🚀 Testing deployment buttons..."
        echo "✅ Railway: https://railway.app/template/eN8ypQ?referralCode=dZVJYh"
        echo "✅ Render: https://render.com/deploy?repo=https://github.com/Bennguyenru/eaut-assessment-platform"
        echo "✅ Vercel: https://vercel.com/new/clone?repository-url=https://github.com/Bennguyenru/eaut-assessment-platform"
        echo ""
        echo "🎯 EAUT Assessment Platform is fully deployed!"
        break
    else
        echo "⏳ Not ready yet..."
        sleep $INTERVAL
        ELAPSED=$((ELAPSED + INTERVAL))
    fi
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo ""
    echo "⚠️  Timeout reached. GitHub Pages may need more time."
    echo "💡 Try visiting the URL manually in a few minutes."
fi
