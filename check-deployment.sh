#!/bin/bash

echo "🔍 Checking Finishi Waitlist Deployment Status"
echo "=============================================="
echo ""

echo "📋 GitHub Actions:"
echo "   Visit: https://github.com/finishi042/finishi-waitlist/actions"
echo ""

echo "🌐 Testing live site..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://finishi-waitlist.vercel.app)

if [ "$response" = "200" ]; then
    echo "   ✅ Site is UP! (HTTP $response)"
    echo "   🎉 https://finishi-waitlist.vercel.app"
elif [ "$response" = "500" ]; then
    echo "   ❌ Site returned error (HTTP $response)"
    echo "   Check logs: vercel logs --project finishi-waitlist --limit=5 --expand"
else
    echo "   ⚠️  Site returned: HTTP $response"
fi

echo ""
echo "📊 Recent logs:"
vercel logs --project finishi-waitlist --limit=3 2>/dev/null || echo "   (Run 'vercel logs --project finishi-waitlist' to see logs)"
