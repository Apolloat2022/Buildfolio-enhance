// scripts/check-quiz-questions.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 CHECKING QUIZ QUESTIONS");
  console.log("==========================");
  
  // Count total questions
  const totalQuestions = await prisma.quizQuestion.count();
  console.log(`Total QuizQuestions: ${totalQuestions}`);
  
  if (totalQuestions === 0) {
    console.log("❌ NO QUIZ QUESTIONS FOUND!");
    console.log("Run: npx tsx prisma/seed-quiz.ts");
    return;
  }
  
  // Count by step
  const steps = await prisma.step.findMany({
    where: { projectTemplate: { slug: 'ecommerce-store' } },
    include: { 
      projectTemplate: true,
      quizQuestions: true 
    },
    orderBy: { order: 'asc' }
  });
  
  console.log("\n📊 Questions by step:");
  steps.forEach(step => {
    console.log(`  Step ${step.order}: ${step.quizQuestions.length} questions`);
  });
  
  // Show sample question
  const sample = await prisma.quizQuestion.findFirst({
    include: { step: true }
  });
  
  if (sample) {
    console.log("\n🎯 Sample question:");
    console.log(`  Step: ${sample.step?.order}`);
    console.log(`  Q: ${sample.question.substring(0, 50)}...`);
    console.log(`  Options: ${sample.options.length}`);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
