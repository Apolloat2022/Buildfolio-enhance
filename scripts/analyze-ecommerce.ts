// scripts/analyze-ecommerce.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function analyzeEcommerce() {
  console.log('🔍 Analyzing E-commerce vs Other Projects')
  console.log('='.repeat(80))
  
  // Get ecommerce project
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: {
      steps: {
        include: {
          _count: {
            select: { quizQuestions: true }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  })
  
  // Get a non-ecommerce project for comparison
  const weather = await prisma.projectTemplate.findUnique({
    where: { slug: 'weather-app' },
    include: {
      steps: {
        include: {
          _count: {
            select: { quizQuestions: true }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (!ecommerce || !weather) {
    console.log('❌ Projects not found')
    return
  }
  
  console.log('\n📊 E-COMMERCE PROJECT')
  console.log('Title:', ecommerce.title)
  console.log('Steps:', ecommerce.steps.length)
  console.log('Category:', ecommerce.category)
  
  console.log('\n📊 WEATHER APP PROJECT')
  console.log('Title:', weather.title)
  console.log('Steps:', weather.steps.length)
  console.log('Category:', weather.category)
  
  // Compare first step of each
  console.log('\n🔬 COMPARING STEP 1')
  console.log('-'.repeat(40))
  
  const ecommerceStep1 = ecommerce.steps[0]
  const weatherStep1 = weather.steps[0]
  
  console.log('\nE-commerce Step 1:')
  console.log('Title:', ecommerceStep1.title)
  console.log('Video URL:', ecommerceStep1.videoUrl?.substring(0, 50) + '...')
  console.log('Code Snippets:', JSON.stringify(ecommerceStep1.codeSnippets))
  console.log('Hints:', ecommerceStep1.hints)
  console.log('Pitfalls:', ecommerceStep1.pitfalls)
  console.log('Quiz Count:', ecommerceStep1._count.quizQuestions)
  
  console.log('\nWeather App Step 1:')
  console.log('Title:', weatherStep1.title)
  console.log('Video URL:', weatherStep1.videoUrl?.substring(0, 50) + '...')
  console.log('Code Snippets:', JSON.stringify(weatherStep1.codeSnippets))
  console.log('Hints:', weatherStep1.hints)
  console.log('Pitfalls:', weatherStep1.pitfalls)
  console.log('Quiz Count:', weatherStep1._count.quizQuestions)
  
  // Check all steps for issues
  console.log('\n🔍 CHECKING ALL E-COMMERCE STEPS')
  console.log('-'.repeat(40))
  
  for (const step of ecommerce.steps) {
    console.log(`\nStep ${step.order}: ${step.title}`)
    console.log(`  Video: ${step.videoUrl ? '✅' : '❌'} ${step.videoUrl}`)
    console.log(`  Code: ${Array.isArray(step.codeSnippets) && step.codeSnippets.length > 0 ? '✅' : '❌'} ${JSON.stringify(step.codeSnippets)}`)
    console.log(`  Hints: ${Array.isArray(step.hints) && step.hints.length > 0 ? '✅' : '❌'} ${step.hints?.length} hints`)
    console.log(`  Pitfalls: ${Array.isArray(step.pitfalls) && step.pitfalls.length > 0 ? '✅' : '❌'} ${step.pitfalls?.length} pitfalls`)
  }
  
  console.log('\n🔍 CHECKING ALL WEATHER APP STEPS')
  console.log('-'.repeat(40))
  
  for (const step of weather.steps) {
    console.log(`\nStep ${step.order}: ${step.title}`)
    console.log(`  Video: ${step.videoUrl ? '✅' : '❌'} ${step.videoUrl}`)
    console.log(`  Code: ${Array.isArray(step.codeSnippets) && step.codeSnippets.length > 0 ? '✅' : '❌'} ${JSON.stringify(step.codeSnippets)}`)
    console.log(`  Hints: ${Array.isArray(step.hints) && step.hints.length > 0 ? '✅' : '❌'} ${step.hints?.length} hints`)
    console.log(`  Pitfalls: ${Array.isArray(step.pitfalls) && step.pitfalls.length > 0 ? '✅' : '❌'} ${step.pitfalls?.length} pitfalls`)
  }
  
  await prisma.$disconnect()
}

analyzeEcommerce().catch(async (e) => {
  console.error('❌ Error:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
