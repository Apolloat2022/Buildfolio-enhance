# DEPLOY WORKING VERSION
Write-Host "DEPLOYING WORKING VERSION..." -ForegroundColor Green

# Show changes
Write-Host "`nGit status:" -ForegroundColor Cyan
git status

# Add the fixed file
Write-Host "`nAdding fixed file..." -ForegroundColor Cyan
git add "app/projects/[slug]/page.tsx"

# Commit
Write-Host "`nCommitting..." -ForegroundColor Cyan
git commit -m "fix: Remove ProjectCompletionSection temporarily to fix build"

# Push to deploy
Write-Host "`nPushing to Vercel..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ DEPLOYMENT STARTED!" -ForegroundColor Green
Write-Host "Build should now succeed..." -ForegroundColor Yellow

Write-Host "`n🎯 Next steps after successful build:" -ForegroundColor Cyan
Write-Host "1. We'll debug ProjectCompletionSection component" -ForegroundColor Gray
Write-Host "2. Fix any issues in that component" -ForegroundColor Gray
Write-Host "3. Re-enable it" -ForegroundColor Gray
