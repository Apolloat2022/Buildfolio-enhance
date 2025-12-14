// scripts/fix-all-issues.ts - FIXED with correct types
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Quiz question bank
const QUIZ_BANK = [
  {
    question: 'Which React hook is used for side effects like API calls?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctIndex: 1,
    explanation: 'useEffect handles side effects such as data fetching, subscriptions, or manually changing the DOM.'
  },
  // ... keep other quiz questions
]

// Project categories (resumeImpact removed since it's Int?)
const PROJECT_CATEGORIES: Record<string, string> = {
  'weather-app': 'api-integration',
  'todo-app': 'productivity', 
  'social-dashboard': 'full-stack',
  'recipe-finder': 'search-ui',
  'portfolio-builder': 'design'
}

async function fixProject(slug: string) {
  console.log('\n🔧 Fixing: ' + slug)
  
  const category = PROJECT_CATEGORIES[slug]
  
  if (category) {
    // Only update category (resumeImpact is Int? - leave it null for now)
    await prisma.projectTemplate.update({
      where: { slug },
      data: {
        category: category
        // resumeImpact is Int? - can't assign string to it
        // You might want to change your schema to String?
      }
    })
    console.log('✅ Added category: ' + category)
  }
  
  // Get all steps for this project
  const project = await prisma.projectTemplate.findUnique({
    where: { slug },
    include: {
      steps: {
        include: {
          _count: {
            select: { quizQuestions: true }
          }
        }
      }
    }
  })
  
  if (!project) return
  
  let totalQuizzesAdded = 0
  
  // Add missing quizzes to each step
  for (const step of project.steps) {
    const currentCount = step._count.quizQuestions
    
    if (currentCount < 5) {
      const quizzesNeeded = 5 - currentCount
      
      for (let i = 1; i <= quizzesNeeded; i++) {
        const quiz = QUIZ_BANK[(currentCount + i - 1) % QUIZ_BANK.length]
        await prisma.quizQuestion.create({
          data: {
            stepId: step.id,
            question: quiz.question + ' (Step ' + step.order + ')',
            options: quiz.options,
            correctIndex: quiz.correctIndex,
            explanation: quiz.explanation,
            order: currentCount + i
          }
        })
        totalQuizzesAdded++
      }
      console.log('   Step ' + step.order + ': Added ' + quizzesNeeded + ' quizzes')
    }
  }
  
  if (totalQuizzesAdded > 0) {
    console.log('   Total quizzes added: ' + totalQuizzesAdded)
  } else {
    console.log('   ✅ Already has 5 quizzes per step')
  }
}

async function main() {
  console.log('🚀 Fixing all projects: Adding categories and missing quizzes')
  console.log('='.repeat(70))
  
  const projectsToFix = [
    'weather-app',
    'todo-app', 
    'social-dashboard',
    'recipe-finder',
    'portfolio-builder'
  ]
  
  for (const slug of projectsToFix) {
    await fixProject(slug)
  }
  
  console.log('\n🎉 All fixes completed!')
  console.log('\n✅ Verify with: npx tsx scripts/check-status.ts')
  
  await prisma.$disconnect()
}

main().catch(async (e: any) => {
  console.error('❌ Error:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
