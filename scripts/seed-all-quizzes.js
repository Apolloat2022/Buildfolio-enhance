// scripts/seed-all-quizzes.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🎯 Seeding quiz questions for ALL projects...");
  
  // Get all project templates with their steps
  const templates = await prisma.projectTemplate.findMany({
    include: {
      steps: {
        orderBy: { order: "asc" }
      }
    }
  });
  
  console.log("Found " + templates.length + " project templates");
  
  // Clear existing quiz questions
  await prisma.quizQuestion.deleteMany();
  console.log("Cleared old quiz questions");
  
  let totalQuestions = 0;
  
  // Create quiz questions for each template
  for (const template of templates) {
    console.log("\n📝 Adding quizzes for: " + template.title);
    
    for (const step of template.steps) {
      // Create 2-3 quiz questions per step
      const questions = [];
      
      if (template.slug === "ecommerce-store") {
        // E-commerce specific questions
        if (step.order === 1) {
          questions.push({
            question: "What command creates a new Next.js project?",
            options: ["npm create next-app", "npx create-next-app", "npm install next", "next init"],
            correctIndex: 1,
            explanation: "npx runs packages without installing globally.",
            order: 1,
            difficulty: "easy"
          });
          questions.push({
            question: "Which ORM is recommended for Next.js with TypeScript?",
            options: ["Sequelize", "TypeORM", "Prisma", "Mongoose"],
            correctIndex: 2,
            explanation: "Prisma provides type-safe database access.",
            order: 2,
            difficulty: "medium"
          });
        } else if (step.order === 2) {
          questions.push({
            question: "What does Tailwind CSS use for responsive design?",
            options: ["Media queries", "Breakpoint prefixes", "CSS Grid", "Flexbox"],
            correctIndex: 1,
            explanation: "Tailwind uses prefixes like md:, lg: for responsive design.",
            order: 1,
            difficulty: "easy"
          });
        }
      } else {
        // Generic questions for other projects
        questions.push({
          question: "What is React primarily used for?",
          options: ["Backend development", "Building user interfaces", "Database management", "DevOps"],
          correctIndex: 1,
          explanation: "React is a JavaScript library for building UI components.",
          order: 1,
          difficulty: "easy"
        });
      }
      
      // Create the questions in database
      for (const qData of questions) {
        await prisma.quizQuestion.create({
          data: {
            stepId: step.id,
            question: qData.question,
            options: qData.options,
            correctIndex: qData.correctIndex,
            explanation: qData.explanation,
            order: qData.order,
            difficulty: qData.difficulty
          }
        });
        totalQuestions++;
      }
      
      if (questions.length > 0) {
        console.log("  Step " + step.order + ": Added " + questions.length + " quiz questions");
      }
    }
  }
  
  console.log("\n🎉 SUCCESS!");
  console.log("Created " + totalQuestions + " quiz questions total");
  console.log("Projects should now have quizzes!");
}

main()
  .catch(e => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
