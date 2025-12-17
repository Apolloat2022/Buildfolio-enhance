// scripts/fix-quizzes-final.js  
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Adding quiz questions...");
  
  // Clear existing questions first
  await prisma.quizQuestion.deleteMany();
  console.log("Cleared old questions");
  
  // Get all steps
  const steps = await prisma.step.findMany({
    include: { projectTemplate: true }
  });
  
  console.log("Found " + steps.length + " steps to add quizzes to");
  
  let totalQuestions = 0;
  
  // Add 5 questions per step
  for (const step of steps) {
    for (let i = 1; i <= 5; i++) {
      await prisma.quizQuestion.create({
        data: {
          stepId: step.id,
          question: "Question " + i + " for Step " + step.order + " of " + step.projectTemplate.title,
          options: ["Choice A", "Choice B", "Choice C", "Choice D"],
          correctIndex: 0, // Always first choice for simplicity
          explanation: "This is the correct answer.",
          order: i,
          difficulty: "medium"
        }
      });
      totalQuestions++;
    }
    
    if (step.order === 1 || step.order === 7) {
      console.log("  " + step.projectTemplate.slug + " - Step " + step.order + ": 5 questions added");
    }
  }
  
  console.log("SUCCESS! Added " + totalQuestions + " quiz questions total.");
  console.log("Expected: " + (steps.length * 5) + " questions");
}

main().catch(console.error).finally(() => prisma.$disconnect());
