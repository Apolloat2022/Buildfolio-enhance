// scripts/test-after-deploy.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("📊 POST-DEPLOYMENT VERIFICATION");
  console.log("===============================");
  
  const user = await prisma.user.findFirst({
    where: { email: 'revanaglobal@gmail.com' }
  });
  
  if (!user) {
    console.log("❌ User not found");
    return;
  }
  
  console.log(`👤 User: ${user.email}`);
  console.log(`🏆 Current points: ${user.totalPoints}`);
  
  // Check current progress
  const startedProject = await prisma.startedProject.findFirst({
    where: { userId: user.id },
    include: { projectTemplate: true }
  });
  
  if (startedProject) {
    console.log(`\n📊 Current progress for ${startedProject.projectTemplate?.title}:`);
    console.log(`   Progress: ${startedProject.progress}%`);
    console.log(`   Certificate Eligible: ${startedProject.certificateEligible}`);
  } else {
    console.log("\n📊 No StartedProject found (will be created on first quiz)");
  }
  
  // Check existing quiz attempts
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: { step: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  
  console.log(`\n🎓 Recent Quiz Attempts: ${attempts.length}`);
  attempts.forEach(a => {
    console.log(`   Step ${a.step?.order}: ${a.score}% - ${a.passed ? '✅ Passed' : '❌ Failed'}`);
  });
  
  console.log("\n🧪 TEST INSTRUCTIONS:");
  console.log("1. Wait for Vercel deployment to complete (✅ Ready)");
  console.log("2. Visit: https://buildfolio.tech/projects/ecommerce-store");
  console.log("3. Open DevTools (F12 → Console tab)");
  console.log("4. Click 'Mark Complete' on Step 1");
  console.log("5. Pass quiz (≥80%)");
  console.log("\n📈 EXPECTED:");
  console.log("   - Console shows '[QUIZ API] Progress: 1/7 = 14%'");
  console.log("   - StartedProject.progress updates to 14%");
  console.log("   - User gets +50 points");
  
  await prisma.$disconnect();
}

main().catch(console.error);
