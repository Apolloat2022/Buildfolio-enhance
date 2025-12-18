// scripts/test-progress.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📊 Checking user progress...');
  
  const user = await prisma.user.findFirst({
    include: { 
      startedProjects: { 
        include: { 
          projectTemplate: true 
        } 
      } 
    }
  });
  
  if (!user) {
    console.log('❌ No user found');
    return;
  }
  
  console.log('User:', user.email);
  console.log('Total points:', user.totalPoints);
  console.log('');
  
  for (const sp of user.startedProjects) {
    const title = sp.projectTemplate ? sp.projectTemplate.title : 'Unknown';
    console.log('📁 Project:', title);
    console.log('   Progress:', sp.progress + '%');
    console.log('   Certificate Eligible:', sp.certificateEligible);
    console.log('   Certificate Issued:', sp.certificateIssuedAt ? sp.certificateIssuedAt.toLocaleDateString() : 'No');
    console.log('');
  }
  
  // Also check quiz attempts
  console.log('🎓 Quiz Attempts:');
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: { step: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  attempts.forEach(attempt => {
    console.log(`   Step: ${attempt.step?.order || 'Unknown'} - Score: ${attempt.score}% - ${attempt.passed ? '✅ Passed' : '❌ Failed'}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
