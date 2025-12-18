// scripts/find-step-model.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function main() {
  console.log("🔍 FINDING STEP COMPLETION MODEL");
  console.log("================================");
  
  const prisma = new PrismaClient();
  
  try {
    // Read schema file to see all models
    const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
    const modelMatches = schema.match(/model\s+(\w+)\s*\{/g);
    
    console.log("\n📋 ALL MODELS IN SCHEMA:");
    const allModels = [];
    modelMatches?.forEach(match => {
      const modelName = match.replace('model ', '').replace(' {', '');
      allModels.push(modelName);
      console.log(`  • ${modelName}`);
    });
    
    // Check which ones might be for step completion
    console.log("\n🎯 LIKELY COMPLETION MODELS:");
    const likelyModels = allModels.filter(name => 
      name.toLowerCase().includes('completion') || 
      name.toLowerCase().includes('progress') ||
      name.toLowerCase().includes('step') && name.toLowerCase().includes('complete')
    );
    
    if (likelyModels.length === 0) {
      console.log("  No obvious completion models found");
      console.log("\n💡 Checking for step tracking in other models...");
      
      // Check StartedProject model
      const startedProject = await prisma.startedProject.findFirst({
        include: { projectTemplate: true }
      });
      
      if (startedProject) {
        console.log(`\nFound StartedProject for user: ${startedProject.id}`);
        console.log(`Progress field exists: ${'progress' in startedProject}`);
        console.log(`Progress value: ${startedProject.progress}%`);
      }
      
      // Check if StepCompletion exists as a relation
      console.log("\nChecking Step model for completions relation...");
      const step = await prisma.step.findFirst({
        include: { completions: true }
      }).catch(() => null);
      
      if (step?.completions !== undefined) {
        console.log("✅ Step has 'completions' relation!");
      }
      
    } else {
      likelyModels.forEach(model => {
        console.log(`  • ${model}`);
      });
      
      // Try to access each likely model
      console.log("\n🧪 TESTING EACH MODEL:");
      for (const modelName of likelyModels) {
        try {
          // Try lowercase first (Prisma usually lowercase)
          const lowercaseModel = modelName.charAt(0).toLowerCase() + modelName.slice(1);
          const count = await prisma[lowercaseModel]?.count?.();
          console.log(`  ✅ ${lowercaseModel}: Accessible (${count} records)`);
        } catch (error) {
          console.log(`  ❌ ${modelName}: ${error.message}`);
        }
      }
    }
    
    // List all accessible properties on prisma
    console.log("\n🔧 AVAILABLE PRISMA MODELS:");
    const prismaKeys = Object.keys(prisma);
    const modelKeys = prismaKeys.filter(key => 
      !key.startsWith('_') && 
      !key.startsWith('$') && 
      typeof prisma[key] === 'object' &&
      prisma[key]?.count !== undefined
    );
    
    modelKeys.forEach(key => {
      console.log(`  • ${key}`);
    });
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
