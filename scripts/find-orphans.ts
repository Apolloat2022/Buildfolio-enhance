import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function findOrphans() {
  console.log('\n🔍 Finding orphaned quiz questions...\n')
  
  const allQuestions = await prisma.quizQuestion.findMany({
    take: 10,
    include: { step: { include: { projectTemplate: true } } }
  })
  
  console.log(`📊 Total questions in DB: ${await prisma.quizQuestion.count()}`)
  console.log(`\nFirst 10 questions are linked to:`)
  
  allQuestions.forEach(q => {
    if (q.step) {
      console.log(`  - "${q.question.substring(0, 40)}..."`)
      console.log(`    Step: ${q.step.title}`)
      console.log(`    Project: ${q.step.projectTemplate?.title || 'Unknown'}`)
      console.log(`    StepID: ${q.stepId}`)
    } else {
      console.log(`  - ORPHANED: "${q.question.substring(0, 40)}..."`)
      console.log(`    StepID: ${q.stepId} (DOESN'T EXIST!)`)
    }
  })
}

findOrphans().then(() => process.exit(0))
