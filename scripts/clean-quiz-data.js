// scripts/clean-quiz-data.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 CLEANING CORRUPTED QUIZ DATA");
  console.log("===============================");
  
  const user = await prisma.user.findFirst({
    where: { email: 'revanaglobal@gmail.com' }
  });
  
  if (!user) {
    console.log("❌ User not found");
    return;
  }
  
  console.log(`👤 Cleaning data for: ${user.email}`);
  
  // Find all quiz attempts with impossible passed=true when score < 80
  const corruptedAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId: user.id,
      passed: true,
      score: { lt: 80 }  // Less than 80%
    }
  });
  
  console.log(`🔍 Found ${corruptedAttempts.length} corrupted quiz attempts`);
  
  // Fix them: set passed=false for scores < 80
  if (corruptedAttempts.length > 0) {
    console.log("🔄 Fixing corrupted data...");
    
    for (const attempt of corruptedAttempts) {
      console.log(`   Step ${attempt.stepId}: ${attempt.score}% → setting passed=false`);
      
      await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { passed: false }
      });
    }
    
    console.log("✅ Corrupted data fixed!");
  }
  
  // Also delete all StartedProject records to start fresh
  console.log("\n🔄 Resetting StartedProject...");
  await prisma.startedProject.deleteMany({
    where: { userId: user.id }
  });
  
  console.log("✅ StartedProject reset complete");
  
  // Show current state after cleanup
  const validAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: { step: true }
  });
  
  console.log(`\n📊 After cleanup - Quiz Attempts: ${validAttempts.length}`);
  validAttempts.forEach(a => {
    console.log(`   Step ${a.step?.order || '?'}: ${a.score}% - ${a.passed ? '✅ Passed' : '❌ Failed'}`);
  });
  
  console.log("\n🎯 NOW TEST:");
  console.log("1. Deployment should be ready now");
  console.log("2. Take Step 1 quiz (≥80%)");
  console.log("3. Should show: '[QUIZ API] Progress: 1/7 = 14%'");
  
  await prisma.$disconnect();
}

main().catch(console.error);
