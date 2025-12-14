# FINAL DEPLOYMENT - CERTIFICATE SYSTEM
Write-Host "FINAL DEPLOYMENT: Certificate System Integration" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check status first
Write-Host "`nChecking git status..." -ForegroundColor Cyan
git status

# Stage all changes
Write-Host "`nStaging all changes..." -ForegroundColor Cyan
git add .

# Commit with descriptive message
Write-Host "`nCommitting changes..." -ForegroundColor Cyan
git commit -m "feat: Complete certificate system integration

- Add ProjectCompletionSection to project pages
- Fix 'slug is not defined' error
- Add certificates navigation link
- Certificate validation flow ready"

# Push to deploy on Vercel
Write-Host "`nPushing to Vercel..." -ForegroundColor Cyan
git push origin main

Write-Host "`n🎉 DEPLOYMENT STARTED!" -ForegroundColor Green
Write-Host "⏱️  Vercel build starting... (2-3 minutes)" -ForegroundColor Yellow

Write-Host "`n🔍 Monitor build at: https://vercel.com/Apolloat2022/Buildfolio/deployments" -ForegroundColor Cyan

Write-Host "`n🎯 TEST AFTER SUCCESSFUL DEPLOYMENT:" -ForegroundColor Cyan
Write-Host "1. Visit: https://buildfolio.tech/projects/ecommerce-store" -ForegroundColor Gray
Write-Host "2. Complete all 7 steps with quizzes" -ForegroundColor Gray
Write-Host "3. Verify GitHub form appears at 100%" -ForegroundColor Gray
Write-Host "4. Test certificates navigation link" -ForegroundColor Gray
Write-Host "5. Download certificate from /certificates page" -ForegroundColor Gray

Write-Host "`n📞 If build fails, check error in Vercel logs" -ForegroundColor Gray
