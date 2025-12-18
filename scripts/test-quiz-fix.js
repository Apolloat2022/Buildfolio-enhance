// scripts/test-quiz-fix.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🧪 TESTING QUIZ FIX");
  console.log("===================");
  
  // 1. Get a test user
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  
  if (!user) {
    console.log("❌ No user found - create one first");
    return;
  }
  
  console.log(`👤 Test user: ${user.email}`);
  console.log(`📊 Current points: ${user.totalPoints}`);
  
  // 2. Check current state
  const existingCompletions = await prisma.stepCompletion.count({
    where: { userId: user.id }
  });
  console.log(`📝 Existing StepCompletions: ${existingCompletions}`);
  
  // 3. Find e-commerce project steps
  const project = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: { steps: { orderBy: { order: 'asc' }, take: 1 } }
  });
  
  if (!project || !project.steps.length) {
    console.log("❌ E-commerce project or steps not found");
    return;
  }
  
  const firstStep = project.steps[0];
  console.log(`\n🎯 Ready to test Step 1: ${firstStep.title}`);
  console.log(`   Step ID: ${firstStep.id}`);
  console.log(`   Project: ${project.title}`);
  
  // 4. Reset if already completed
  if (existingCompletions > 0) {
    console.log("\n🔄 Resetting progress...");
    await prisma.stepCompletion.deleteMany({
      where: { userId: user.id }
    });
    console.log("✅ Reset complete");
  }
  
  console.log("\n✅ Test setup complete!");
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Visit: https://buildfolio.tech/projects/ecommerce-store");
  console.log("2. Click 'Mark Complete' on Step 1");
  console.log("3. Pass the quiz (score ≥ 80%)");
  console.log("4. Run: node scripts/verify-progress.js");
  
  await prisma.$disconnect();
}

main().catch(console.error);
