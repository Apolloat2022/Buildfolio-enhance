// scripts/fix-steps-final.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Adding missing steps to reach 7 per project...");
  
  const templates = await prisma.projectTemplate.findMany({
    include: { steps: true }
  });
  
  for (const template of templates) {
    console.log(template.title + " (" + template.slug + "): " + template.steps.length + " steps");
    
    // Add until we have 7
    while (template.steps.length < 7) {
      const newOrder = template.steps.length + 1;
      const stepTitles = [
        "Project Setup",
        "Core Implementation", 
        "UI Development",
        "Backend Logic",
        "Advanced Features",
        "Testing",
        "Deployment"
      ];
      
      await prisma.step.create({
        data: {
          order: newOrder,
          title: stepTitles[newOrder-1] || "Step " + newOrder,
          description: "Complete this step to progress.",
          estimatedMinutes: 30,
          projectTemplateId: template.id,
          videoUrl: "https://www.youtube.com/embed/sample"
        }
      });
      
      console.log("  Added step " + newOrder);
      template.steps.push({}); // Simulate adding
    }
  }
  
  console.log("Done! All projects have 7 steps.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
