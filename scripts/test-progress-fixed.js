// scripts/test-progress-fixed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Testing Progress & Certificate System...');
  
  // Get first user with CORRECT schema
  const user = await prisma.user.findFirst({
    include: {
      startedProjects: {
        include: { projectTemplate: true }  // Changed from 'project' to 'projectTemplate'
      },
      stepCompletions: {
        include: { step: true }
      }
    }
  });
  
  if (!user) {
    console.log('❌ No user found in database');
    return;
  }
  
  console.log('User:', user.email);
  console.log('User ID:', user.id);
  
  console.log('\n📊 Step Completions:', user.stepCompletions.length);
  if (user.stepCompletions.length > 0) {
    user.stepCompletions.forEach(completion => {
      console.log('  - Step:', completion.step?.order || 'Unknown', completion.step?.title || '');
    });
  }
  
  console.log('\n🏗️ Started Projects:', user.startedProjects.length);
  if (user.startedProjects.length > 0) {
    user.startedProjects.forEach(sp => {
      const projectTitle = sp.projectTemplate ? sp.projectTemplate.title : 'Unknown Project';
      console.log('\nProject:', projectTitle);
      console.log('  Progress:', sp.progress + '%');
      console.log('  Certificate Eligible:', sp.certificateEligible);
      console.log('  Project ID:', sp.projectId);
    });
  } else {
    console.log('⚠️  User has no started projects');
  }
  
  // Check e-commerce project specifically
  console.log('\n🎯 Checking e-commerce project specifically...');
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: {
      steps: {
        orderBy: { order: 'asc' }
      }
    }
  });
  
  if (ecommerce) {
    console.log('E-commerce project found:', ecommerce.title);
    console.log('Total steps:', ecommerce.steps.length);
    
    // Check if user has started this project
    const userEcommerce = await prisma.startedProject.findFirst({
      where: {
        userId: user.id,
        projectId: ecommerce.id
      }
    });
    
    if (userEcommerce) {
      console.log('User has started this project');
      console.log('Progress:', userEcommerce.progress + '%');
      console.log('Certificate Eligible:', userEcommerce.certificateEligible);
    } else {
      console.log('User has NOT started e-commerce project');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
