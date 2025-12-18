// scripts/verify-progress.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("✅ VERIFYING PROGRESS UPDATE");
  console.log("===========================");
  
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("❌ No user found");
    return;
  }
  
  console.log(`👤 User: ${user.email}`);
  
  // Check StepCompletions
  const completions = await prisma.stepCompletion.findMany({
    where: { userId: user.id },
    include: { step: true }
  });
  
  console.log(`\n📝 StepCompletions: ${completions.length}`);
  completions.forEach((c, i) => {
    console.log(`   ${i+1}. Step ${c.step?.order}: ${c.step?.title}`);
  });
  
  // Check StartedProject progress
  const startedProject = await prisma.startedProject.findFirst({
    where: { userId: user.id },
    include: { projectTemplate: true }
  });
  
  if (startedProject) {
    console.log(`\n📊 Project: ${startedProject.projectTemplate?.title}`);
    console.log(`   Progress: ${startedProject.progress}%`);
    console.log(`   Certificate Eligible: ${startedProject.certificateEligible}`);
    
    if (startedProject.certificateEligible) {
      console.log(`   🎉 CERTIFICATE READY!`);
      console.log(`   🔗 Download: https://buildfolio.tech/certificates`);
    }
  }
  
  // Check QuizAttempts
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  
  console.log(`\n🎓 Recent Quiz Attempts: ${attempts.length}`);
  attempts.forEach((a, i) => {
    console.log(`   ${i+1}. Score: ${a.score}% - ${a.passed ? '✅ Passed' : '❌ Failed'}`);
  });
  
  console.log(`\n🏆 User points: ${user.totalPoints}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
