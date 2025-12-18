// scripts/verify-seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 VERIFYING QUIZ SEED");
  console.log("======================");
  
  try {
    // Count questions
    const count = await prisma.quizQuestion.count();
    console.log(`Total quiz questions: ${count}`);
    
    if (count === 0) {
      console.log("❌ SEED FAILED - No questions created");
      console.log("\n💡 Try manual seed:");
      console.log("   npx tsx scripts/emergency-seed.js");
      return;
    }
    
    console.log("✅ Quiz questions seeded successfully!");
    
    // Show breakdown by step
    const steps = await prisma.step.findMany({
      where: { projectTemplate: { slug: 'ecommerce-store' } },
      include: { quizQuestions: true },
      orderBy: { order: 'asc' }
    });
    
    console.log("\n📊 Questions by step:");
    let total = 0;
    steps.forEach(step => {
      console.log(`  Step ${step.order}: ${step.quizQuestions.length} questions`);
      total += step.quizQuestions.length;
    });
    
    console.log(`\n🎯 Total: ${total} questions across ${steps.length} steps`);
    
    // Show a sample
    const sample = await prisma.quizQuestion.findFirst({
      include: { step: true }
    });
    
    if (sample) {
      console.log("\n📝 Sample question:");
      console.log(`  Step: ${sample.step?.order} - ${sample.step?.title}`);
      console.log(`  Question: ${sample.question.substring(0, 60)}...`);
      console.log(`  Options: ${sample.options.length}`);
      console.log(`  Correct index: ${sample.correctIndex}`);
    }
    
  } catch (error) {
    console.error("❌ Verification error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
