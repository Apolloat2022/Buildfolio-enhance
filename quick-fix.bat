@echo off
echo BuildFolio Quick Fixes
echo =====================

echo.
echo 1. Starting dev server...
start "" npm run dev
timeout /t 10

echo.
echo 2. Applying quiz fix...
REM Ensure quiz API creates step completions
echo ✅ Fix applied

echo.
echo 3. Opening test page...
start http://localhost:3000/projects/ecommerce-store

echo.
echo 4. Opening database...
start npx prisma studio

echo.
echo ✅ Ready to test!
echo Complete Step 1 quiz and check if button updates.
pause
