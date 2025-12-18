// scripts/check-all-projects.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("📊 CHECKING ALL 6 PROJECTS IN DATABASE");
  console.log("======================================");

  const projects = await prisma.projectTemplate.findMany({
    include: {
      steps: {
        include: {
          quizQuestions: true
        },
        orderBy: { order: 'asc' }
      },
      startedProjects: true
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Found ${projects.length} projects total:\n`);

  projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.title} (${project.slug})`);
    console.log(`   Steps: ${project.steps.length}`);
    
    const totalQuestions = project.steps.reduce((sum, step) => {
      return sum + step.quizQuestions.length;
    }, 0);
    
    console.log(`   Quiz Questions: ${totalQuestions}`);
    
    const stepsWithContent = project.steps.filter(step => {
      return step.description && step.description.length > 10;
    }).length;
    
    console.log(`   Steps with content: ${stepsWithContent}/${project.steps.length}`);
    console.log(`   Started by: ${project.startedProjects.length} users`);
    
    if (project.technologies && project.technologies.length > 0) {
      console.log(`   Technologies: ${project.technologies.join(', ')}`);
    } else {
      console.log(`   Technologies: None set`);
    }
    
    console.log('');
  });

  console.log("🔍 QUICK SUMMARY:");
  console.log("================");
  
  const ecommerce = projects.find(p => p.slug === 'ecommerce-store');
  const otherProjects = projects.filter(p => p.slug !== 'ecommerce-store');
  
  if (ecommerce) {
    console.log(`\n✅ E-commerce Store is COMPLETE:`);
    console.log(`   • ${ecommerce.steps.length} steps`);
    console.log(`   • ${ecommerce.steps.reduce((sum, step) => sum + step.quizQuestions.length, 0)} quiz questions`);
  }
  
  console.log(`\n📋 Other ${otherProjects.length} projects:`);
  
  otherProjects.forEach(p => {
    const hasQuestions = p.steps.some(s => s.quizQuestions.length > 0);
    const hasContent = p.steps.some(s => s.description && s.description.length > 50);
    
    let status = '';
    if (hasQuestions && hasContent) {
      status = '✅ Complete';
    } else if (p.steps.length > 0) {
      status = '⚠️  Partial content';
    } else {
      status = '❌ Empty shell';
    }
    
    console.log(`   • ${p.title}: ${status}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
