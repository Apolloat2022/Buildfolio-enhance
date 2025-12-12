import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const userId = 'cmj35wqyk000041uchedxvsm3'
  
  const project = await prisma.startedProject.findFirst({
    where: { 
      userId,
      projectTemplate: { slug: 'ecommerce-store' }
    },
    include: { 
      projectTemplate: { 
        include: { steps: { orderBy: { order: 'asc' } } } 
      } 
    }
  })
  
  if (!project) return
  
  console.log('Valid step IDs (should have):')
  project.projectTemplate.steps.forEach(s => {
    console.log(`  ${s.id} - Step ${s.order}: ${s.title}`)
  })
  
  console.log('\nCompleted step IDs in database:')
  project.completedSteps.forEach((id, i) => {
    console.log(`  ${i+1}. ${id}`)
  })
  
  // Find invalid IDs
  const validIds = project.projectTemplate.steps.map(s => s.id)
  const invalidIds = project.completedSteps.filter(id => !validIds.includes(id))
  
  if (invalidIds.length > 0) {
    console.log('\n❌ Invalid step IDs found:', invalidIds.length)
    invalidIds.forEach(id => console.log(`  - ${id}`))
  }
}

check().then(() => process.exit(0))
