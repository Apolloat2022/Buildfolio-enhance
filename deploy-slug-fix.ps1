# DEPLOY SLUG FIX
Write-Host "🚀 Deploying slug variable fix..." -ForegroundColor Green

Write-Host "`n🔍 Checking changes..." -ForegroundColor Yellow
git diff app/projects/\[slug\]/page.tsx

Write-Host "`n📦 Staging fix..." -ForegroundColor Cyan
git add app/projects/\[slug\]/page.tsx

Write-Host "`n💾 Committing..." -ForegroundColor Cyan
git commit -m "fix: Correct slug variable reference in ProjectCompletionSection"

Write-Host "`n🚀 Pushing to deploy..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Deployment started!" -ForegroundColor Green
Write-Host "⏱️  Wait 2-3 minutes for Vercel" -ForegroundColor Yellow

Write-Host "`n🎯 Test after deploy:" -ForegroundColor Cyan
Write-Host "1. Visit: https://buildfolio.tech/projects/ecommerce-store" -ForegroundColor Gray
Write-Host "2. Complete steps to 100%" -ForegroundColor Gray
Write-Host "3. Check if certificate flow appears" -ForegroundColor Gray
Write-Host "4. Test navigation certificates link" -ForegroundColor Gray
