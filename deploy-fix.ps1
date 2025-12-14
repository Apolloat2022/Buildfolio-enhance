# DEPLOYMENT SCRIPT
Write-Host "DEPLOYING FIX FOR 'slug is not defined' ERROR" -ForegroundColor Green

# Show changes
Write-Host "`nChecking git status..." -ForegroundColor Cyan
git status

# Add the fixed file
Write-Host "`nAdding changes to git..." -ForegroundColor Cyan
git add "app/projects/[slug]/page.tsx"

# Commit
Write-Host "`nCommitting changes..." -ForegroundColor Cyan
git commit -m "fix: Resolve 'slug is not defined' error in ProjectCompletionSection"

# Push to deploy
Write-Host "`nPushing to Vercel..." -ForegroundColor Cyan
git push origin main

Write-Host "`nDEPLOYMENT STARTED!" -ForegroundColor Green
Write-Host "Vercel will build in 2-3 minutes..." -ForegroundColor Yellow

Write-Host "`nTEST AFTER DEPLOYMENT:" -ForegroundColor Cyan
Write-Host "1. Go to: https://buildfolio.tech/projects/ecommerce-store" -ForegroundColor Gray
Write-Host "2. Complete steps with quizzes" -ForegroundColor Gray
Write-Host "3. Check certificate flow at 100%" -ForegroundColor Gray
