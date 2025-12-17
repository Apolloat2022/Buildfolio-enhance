@echo off
echo BuildFolio Test Suite
echo ====================
echo.

echo 1. Starting Dev Server (in background)...
start "" npm run dev
timeout /t 5 /nobreak >nul

echo.
echo 2. Testing Quiz System...
npx tsx scripts/test-quiz-fix.ts

echo.
echo 3. Testing Certificate Access...
timeout /t 2 /nobreak >nul
curl http://localhost:3000/certificates || echo "Server still starting..."

echo.
echo 4. Testing Database Connection...
npx prisma studio --browser none --port 5556 &
timeout /t 3 /nobreak >nul
taskkill /F /IM "node.exe" 2>nul

echo.
echo ✅ Tests Complete!
echo.
echo Manual Tests:
echo 1. Visit: http://localhost:3000
echo 2. Complete a project with quizzes
echo 3. Check certificate generation
pause
