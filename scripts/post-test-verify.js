// scripts/post-test-verify.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🧪 POST-TEST VERIFICATION");
  console.log("=========================");
  
  const user = await prisma.user.findFirst({
    where: { email: 'revanaglobal@gmail.com' }
  });
  
  if (!user) {
    console.log("❌ User not found");
    return;
  }
  
  console.log(`👤 User: ${user.email}`);
  console.log(`🏆 Points BEFORE test: 850`);
  console.log(`🏆 Points AFTER test should be: 900 (+50)`);
  console.log(`🏆 Actual points: ${user.totalPoints}`);
  
  // Check StartedProject progress
  const startedProject = await prisma.startedProject.findFirst({
    where: { userId: user.id },
    include: { projectTemplate: true }
  });
  
  console.log("\n📊 StartedProject status:");
  if (startedProject) {
    console.log(`   Project: ${startedProject.projectTemplate?.title}`);
    console.log(`   Progress: ${startedProject.progress}% (should be 14% after Step 1)`);
    console.log(`   Certificate Eligible: ${startedProject.certificateEligible}`);
  } else {
    console.log("   No StartedProject yet - quiz not taken or failed");
  }
  
  // Check latest quiz attempts
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: { step: { select: { order: true, title: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log(`\n🎓 Latest Quiz Attempts: ${attempts.length}`);
  attempts.forEach((a, i) => {
    const date = a.createdAt.toLocaleTimeString();
    console.log(`   ${i+1}. Step ${a.step?.order}: ${a.score}% - ${a.passed ? '✅ Passed' : '❌ Failed'} (${date})`);
  });
  
  // Calculate expected progress
  if (attempts.length > 0) {
    const passedSteps = new Set();
    attempts.forEach(a => {
      if (a.passed && a.step) {
        passedSteps.add(a.step.order);
      }
    });
    
    console.log(`\n📈 Unique passed steps: ${passedSteps.size}/7`);
    console.log(`   Expected progress: ${Math.round((passedSteps.size / 7) * 100)}%`);
  }
  
  console.log("\n🎯 NEXT STEPS:");
  console.log("   1. If progress is 14% → SYSTEM WORKS!");
  console.log("   2. Complete all 7 steps → Certificate awarded at 100%");
  console.log("   3. Visit /certificates to download");
  
  await prisma.$disconnect();
}

main().catch(console.error);
