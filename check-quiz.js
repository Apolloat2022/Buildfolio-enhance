// Create a file: check-quiz.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkQuiz() {
  try {
    // 1. Count total quiz questions
    const count = await prisma.quizQuestion.count()
    console.log(`Total quiz questions: ${count}`)
    
    // 2. Get first step with questions
    const stepWithQuestions = await prisma.step.findFirst({
      include: { quizQuestions: true },
      where: { quizQuestions: { some: {} } }
    })
    
    if (stepWithQuestions) {
      console.log(`Step with questions: ${stepWithQuestions.title}`)
      console.log(`Questions: ${stepWithQuestions.quizQuestions.length}`)
      console.log(`Step ID: ${stepWithQuestions.id}`)
    } else {
      console.log('No steps have quiz questions!')
    }
    
    // 3. Check if seed data exists
    const allQuestions = await prisma.quizQuestion.findMany({
      take: 3,
      select: { question: true, stepId: true }
    })
    
    console.log('\nSample questions:')
    allQuestions.forEach((q, i) => {
      console.log(`${i+1}. ${q.question.substring(0, 50)}...`)
    })
    
  } catch (error) {
    console.error('Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkQuiz()
