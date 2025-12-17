// scripts/add-missing-steps.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Finding projects missing steps...')
  
  // 1. Get all project templates
  const templates = await prisma.projectTemplate.findMany({
    include: {
      steps: {
        orderBy: { order: 'asc' }
      }
    }
  })
  
  for (const template of templates) {
    console.log(`\n📋 ${template.title} (${template.slug}):`)
    console.log(`   Currently has ${template.steps.length} steps`)
    
    // 2. Define target steps based on slug
    let targetStepCount = 3 // Default for simple projects
    if (template.slug === 'ecommerce-store') {
      targetStepCount = 7
    }
    // Add other conditions here if needed
    
    // 3. Add missing steps if needed
    if (template.steps.length < targetStepCount) {
      const stepsToAdd = targetStepCount - template.steps.length
      console.log(`   Adding ${stepsToAdd} missing steps...`)
      
      for (let i = 1; i <= stepsToAdd; i++) {
        const newOrder = template.steps.length + i
        await prisma.step.create({
          data: {
            order: newOrder,
            title: `Step ${newOrder}`,
            description: `Description for step ${newOrder}`,
            estimatedMinutes: 30,
            projectTemplateId: template.id
          }
        })
        console.log(`     ✅ Added Step ${newOrder}`)
      }
    } else {
      console.log(`   ✅ Already has target ${targetStepCount} steps`)
    }
  }
  
  console.log('\n🎉 All projects should now have correct step counts!')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })