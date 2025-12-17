// scripts/create-templates-fixed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Creating ProjectTemplates...");
  
  try {
    // Clear existing templates
    await prisma.projectTemplate.deleteMany();
    console.log("Cleared old templates");
    
    // Create E-commerce Store Template
    const ecommerce = await prisma.projectTemplate.create({
      data: {
        slug: "ecommerce-store",
        title: "Build a Modern E-commerce Store",
        description: "Learn to build a full-stack e-commerce application with Next.js, Stripe, and Prisma.",
        difficulty: "intermediate",
        timeEstimate: "40 hours",
        technologies: ["Next.js", "TypeScript", "Tailwind", "Prisma", "Stripe"],
        resumeImpact: 5,
        category: "e-commerce",
        steps: {
          create: [
            { order: 1, title: "Project Setup", description: "Set up Next.js project", estimatedMinutes: 30 },
            { order: 2, title: "Database", description: "Configure Prisma", estimatedMinutes: 45 },
            { order: 3, title: "UI", description: "Create product pages", estimatedMinutes: 40 },
            { order: 4, title: "Cart", description: "Shopping cart", estimatedMinutes: 50 },
            { order: 5, title: "Checkout", description: "Stripe payments", estimatedMinutes: 35 },
            { order: 6, title: "Auth", description: "Authentication", estimatedMinutes: 30 },
            { order: 7, title: "Deploy", description: "Deployment", estimatedMinutes: 25 }
          ]
        }
      }
    });
    
    console.log("Created: ecommerce-store template");
    
    // Create other templates
    const templates = [
      { slug: "todo-app", title: "Todo App", difficulty: "beginner" },
      { slug: "weather-app", title: "Weather App", difficulty: "beginner" },
      { slug: "social-dashboard", title: "Social Dashboard", difficulty: "intermediate" },
      { slug: "recipe-finder", title: "Recipe Finder", difficulty: "intermediate" },
      { slug: "portfolio-builder", title: "Portfolio Builder", difficulty: "advanced" }
    ];
    
    for (const template of templates) {
      await prisma.projectTemplate.create({
        data: {
          slug: template.slug,
          title: template.title,
          description: "Build a " + template.title,
          difficulty: template.difficulty,
          timeEstimate: "10 hours",
          technologies: ["React", "JavaScript"],
          resumeImpact: 3,
          category: "web",
          steps: {
            create: [
              { order: 1, title: "Setup", description: "Setup", estimatedMinutes: 30 },
              { order: 2, title: "Build", description: "Build", estimatedMinutes: 60 },
              { order: 3, title: "Deploy", description: "Deploy", estimatedMinutes: 30 }
            ]
          }
        }
      });
      console.log("Created: " + template.slug);
    }
    
    console.log("");
    console.log("SUCCESS! Created 6 ProjectTemplates");
    console.log("Your URLs should now work:");
    console.log("  http://localhost:3000/projects/ecommerce-store");
    console.log("  http://localhost:3000/projects/todo-app");
    console.log("  etc...");
    
  } catch (error) {
    console.error("ERROR:", error.message);
    console.error("Code:", error.code);
  } finally {
    await prisma.$disconnect();
  }
}

main();
