# DEPLOY CERTIFICATE SYSTEM FIX
Write-Host "DEPLOYING CERTIFICATE SYSTEM FIX" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Show current status
Write-Host "`nChecking git status..." -ForegroundColor Cyan
git status

# Add the fixed file
Write-Host "`nAdding [slug]/page.tsx to git..." -ForegroundColor Cyan
git add "app/projects/[slug]/page.tsx"

# Commit the fix
Write-Host "`nCommitting changes..." -ForegroundColor Cyan
git commit -m "fix: Resolve 'slug is not defined' error - Certificate system integration"

# Push to deploy on Vercel
Write-Host "`nPushing to Vercel for deployment..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ DEPLOYMENT STARTED!" -ForegroundColor Green
Write-Host "⏱️  Vercel will build in 2-3 minutes..." -ForegroundColor Yellow

Write-Host "`n🎯 TEST AFTER DEPLOYMENT:" -ForegroundColor Cyan
Write-Host "1. Visit: https://buildfolio.tech/projects/ecommerce-store" -ForegroundColor Gray
Write-Host "2. Complete all 7 steps with quizzes" -ForegroundColor Gray
Write-Host "3. Check if GitHub form appears at 100%" -ForegroundColor Gray
Write-Host "4. Test certificates navigation link" -ForegroundColor Gray

Write-Host "`n📊 If build fails, check Vercel logs for exact error" -ForegroundColor Gray
