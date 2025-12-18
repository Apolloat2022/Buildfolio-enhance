import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: { 
      steps: { 
        include: { quizQuestions: true },
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (!ecommerce) {
    console.log('❌ E-commerce not found')
    return
  }
  
  console.log('\n📊 QUIZ QUESTIONS BY STEP:\n')
  
  ecommerce.steps.forEach(step => {
    console.log(`Step ${step.order}: ${step.title}`)
    console.log(`  ID: ${step.id}`)
    console.log(`  Quiz Questions: ${step.quizQuestions.length}`)
    
    if (step.quizQuestions.length > 0) {
      console.log(`  First Q: "${step.quizQuestions[0].question.substring(0, 40)}..."`)
    } else {
      console.log(`  ❌ NO QUESTIONS!`)
    }
    console.log()
  })
  
  console.log(`\n📋 TOTAL: ${ecommerce.steps.reduce((sum, s) => sum + s.quizQuestions.length, 0)} questions across ${ecommerce.steps.length} steps`)
}

debug().then(() => process.exit(0))
