import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkQuizzes() {
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
    console.log('❌ E-commerce project not found!')
    return
  }
  
  console.log('✅ E-commerce project found')
  console.log(`📚 Steps: ${ecommerce.steps.length}`)
  
  ecommerce.steps.forEach(step => {
    console.log(`\n  Step ${step.order}: ${step.title}`)
    console.log(`    Quiz questions: ${step.quizQuestions.length}`)
    if (step.quizQuestions.length > 0) {
      console.log(`    First question: "${step.quizQuestions[0].question.substring(0, 50)}..."`)
      console.log(`    Correct index: ${step.quizQuestions[0].correctIndex}`)
    }
  })
  
  const totalQuestions = ecommerce.steps.reduce((sum, s) => sum + s.quizQuestions.length, 0)
  console.log(`\n📊 Total quiz questions: ${totalQuestions}`)
}

checkQuizzes().then(() => process.exit(0))
