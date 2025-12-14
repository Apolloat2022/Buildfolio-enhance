# DEPLOY QUIZ ERROR FIX
Write-Host "Deploying Quiz Error Fix..." -ForegroundColor Green

# 1. Update MarkCompleteButton usage
Write-Host "`n1. Updating MarkCompleteButton..." -ForegroundColor Cyan
.\update-markcomplete.ps1

# 2. Check changes
Write-Host "`n2. Checking git status..." -ForegroundColor Cyan
git status

# 3. Stage changes
Write-Host "`n3. Staging changes..." -ForegroundColor Cyan
git add components/MarkCompleteButton_Fixed.tsx
git add "app/projects/[slug]/page.tsx"
git add update-markcomplete.ps1

# 4. Commit
Write-Host "`n4. Committing..." -ForegroundColor Cyan
git commit -m "fix: Improve quiz error handling in MarkCompleteButton"

# 5. Deploy
Write-Host "`n5. Pushing to Vercel..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ DEPLOYMENT STARTED!" -ForegroundColor Green
Write-Host "The 'quiz data error' should now have better handling" -ForegroundColor Yellow
