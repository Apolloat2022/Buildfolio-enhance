// scripts/complete-quizzes.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🎯 Adding comprehensive quiz questions...");
  
  // Get all steps across all projects
  const steps = await prisma.step.findMany({
    include: {
      projectTemplate: true
    },
    orderBy: [
      { projectTemplateId: "asc" },
      { order: "asc" }
    ]
  });
  
  console.log(`Found ${steps.length} total steps`);
  
  let totalQuestionsAdded = 0;
  
  // Add 3-5 questions per step
  for (const step of steps) {
    const questionsToAdd = 5; // Add 5 questions per step
    let questionsAdded = 0;
    
    for (let i = 1; i <= questionsToAdd; i++) {
      const questionNum = (step.order - 1) * questionsToAdd + i;
      
      await prisma.quizQuestion.create({
        data: {
          stepId: step.id,
          question: `Question ${questionNum} for ${step.projectTemplate.title} - Step ${step.order}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: Math.floor(Math.random() * 4),
          explanation: "This is the correct answer because...",
          order: i,
          difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy"
        }
      });
      
      questionsAdded++;
      totalQuestionsAdded++;
    }
    
    if (questionsAdded > 0) {
      console.log(`  ${step.projectTemplate.slug} - Step ${step.order}: Added ${questionsAdded} questions`);
    }
  }
  
  console.log(`\n🎉 Added ${totalQuestionsAdded} new quiz questions!`);
  console.log(`Total should now be: ${steps.length * 5} questions`);
}

main()
  .catch(e => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\$disconnect();
  });
