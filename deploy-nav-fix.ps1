# SIMPLE DEPLOY WITH NAVIGATION FIX
Write-Host "DEPLOYING NAVIGATION FIX..." -ForegroundColor Green

# Check current status
git status

# Stage changes
git add components/Navigation.tsx
git add app/projects/\[slug\]/page.tsx

# Commit
git commit -m "fix: Repair Navigation.tsx syntax (duplicate imports, broken JSX) and add certificate integration"

# Push to deploy
git push origin main

Write-Host "`n✅ Deployment started!" -ForegroundColor Green
Write-Host "⏱️  Wait 2-3 minutes for Vercel" -ForegroundColor Yellow
Write-Host "`n🎯 Test after deploy:" -ForegroundColor Cyan
Write-Host "1. Visit homepage - navigation should work" -ForegroundColor Gray
Write-Host "2. Check certificates link in nav" -ForegroundColor Gray
Write-Host "3. Test project page completion flow" -ForegroundColor Gray
