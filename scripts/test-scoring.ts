import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testScoring() {
  // Get first step with questions
  const step = await prisma.step.findFirst({
    where: { 
      projectTemplate: { slug: 'ecommerce-store' },
      order: 1
    },
    include: { quizQuestions: true }
  })
  
  if (!step || step.quizQuestions.length === 0) {
    console.log('❌ No questions found for step 1')
    return
  }
  
  console.log(`\n🎯 Testing scoring for Step 1: ${step.title}`)
  console.log(`📝 Questions: ${step.quizQuestions.length}`)
  
  // Simulate perfect answers
  const perfectAnswers = step.quizQuestions.map(q => ({
    questionId: q.id,
    selectedIndex: q.correctIndex
  }))
  
  let correct = 0
  perfectAnswers.forEach((answer, i) => {
    const question = step.quizQuestions[i]
    if (answer.selectedIndex === question.correctIndex) {
      correct++
      console.log(`  ✅ Q${i+1}: Correct (selected ${answer.selectedIndex}, correct is ${question.correctIndex})`)
    } else {
      console.log(`  ❌ Q${i+1}: Wrong (selected ${answer.selectedIndex}, correct is ${question.correctIndex})`)
    }
  })
  
  const score = (correct / step.quizQuestions.length) * 100
  const passed = score >= 80
  
  console.log(`\n📊 SCORING RESULT:`)
  console.log(`  Correct: ${correct}/${step.quizQuestions.length}`)
  console.log(`  Score: ${score.toFixed(1)}%`)
  console.log(`  Passed: ${passed ? '✅ YES' : '❌ NO'}`)
  console.log(`  Threshold: 80%`)
}

testScoring().then(() => process.exit(0))
