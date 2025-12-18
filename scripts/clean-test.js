// scripts/clean-test.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Simple Database Check");
  
  // Count records
  const userCount = await prisma.user.count();
  const stepCount = await prisma.step.count();
  const startedCount = await prisma.startedProject.count();
  
  console.log("User count: " + userCount);
  console.log("Step count: " + stepCount);
  console.log("StartedProject count: " + startedCount);
  
  // Get first user
  const user = await prisma.user.findFirst({
    include: { startedProjects: true }
  });
  
  if (user) {
    console.log("\nUser: " + user.email);
    console.log("Started Projects: " + user.startedProjects.length);
    
    for (const sp of user.startedProjects) {
      console.log("  Project ID: " + sp.projectId + ", Progress: " + sp.progress + "%");
    }
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
