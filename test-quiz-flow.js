// test-quiz-flow.js - Simple JavaScript test
console.log('🧪 Testing BuildFolio Quiz Flow...\n');

console.log('Step 1: Check if dev server is running');
console.log('   Run: npm run dev (in separate terminal)');
console.log('   Then visit: http://localhost:3000');
console.log('');

console.log('Step 2: Test quiz completion');
console.log('   1. Go to: http://localhost:3000/projects/ecommerce-store');
console.log('   2. Click "Mark Complete" on Step 1');
console.log('   3. Answer quiz questions (need 80%+)');
console.log('   4. Check if button changes to "Completed"');
console.log('');

console.log('Step 3: Debug if quiz fails');
console.log('   Open browser DevTools (F12)');
console.log('   Go to Network tab');
console.log('   Take quiz and check response from /api/quiz/submit');
console.log('   Should see: { success: true, passed: true }');
console.log('');

console.log('Step 4: Check database');
console.log('   Run: npx prisma studio');
console.log('   Visit: http://localhost:5555');
console.log('   Check tables:');
console.log('     - QuizAttempt (should have your attempt)');
console.log('     - StepCompletion (should have step marked complete)');
console.log('     - StartedProject (progress should update)');
console.log('');

console.log('Common Issues & Fixes:');
console.log('   1. Quiz API not creating StepCompletion:');
console.log('      Check app/api/quiz/submit/route.ts');
console.log('   2. Button not updating:');
console.log('      Check components/MarkCompleteButton.tsx');
console.log('   3. Progress not updating:');
console.log('      Check app/api/progress/route.ts');
console.log('');

console.log('✅ Test script complete!');
