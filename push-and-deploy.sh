#!/bin/bash
# MusicRight Web — Push to GitHub + Deploy to Vercel
# Usage: bash push-and-deploy.sh ghp_YOUR_TOKEN_HERE

TOKEN=$1

if [ -z "$TOKEN" ]; then
  echo "Usage: bash push-and-deploy.sh ghp_YOUR_TOKEN_HERE"
  exit 1
fi

echo "🔗 Pushing web app to GitHub..."
git remote add origin "https://${TOKEN}@github.com/Search-AIII/musicright-web.git" 2>/dev/null || \
git remote set-url origin "https://${TOKEN}@github.com/Search-AIII/musicright-web.git"

git push -u origin master

if [ $? -eq 0 ]; then
  echo "✅ Pushed to GitHub!"
  echo ""
  echo "📦 Now deploy to Vercel:"
  echo "  1. Go to vercel.com/new"
  echo "  2. Import Search-AIII/musicright-web"
  echo "  3. Click Deploy"
  echo "  4. Add musicright.ai in Settings → Domains"
  echo ""
  echo "OR run: npx vercel --prod"
else
  echo "❌ Push failed. Make sure repo 'musicright-web' exists on GitHub first."
  echo "   Create it at: github.com/new"
fi
