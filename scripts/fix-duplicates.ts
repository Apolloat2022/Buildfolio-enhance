import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function fix() {
  const userId = 'cmj35wqyk000041uchedxvsm3'
  
  const project = await prisma.startedProject.findFirst({
    where: { 
      userId,
      projectTemplate: { slug: 'ecommerce-store' }
    },
    include: { projectTemplate: { include: { steps: true } } }
  })
  
  if (!project) {
    console.log('❌ Project not found')
    return
  }
  
  console.log('Current completedSteps:', project.completedSteps.length)
  
  // Remove duplicates
  const uniqueSteps = [...new Set(project.completedSteps)]
  
  console.log('Unique steps:', uniqueSteps.length)
  
  // Calculate correct progress
  const totalSteps = project.projectTemplate.steps.length
  const progress = Math.round((uniqueSteps.length / totalSteps) * 100)
  
  console.log(`Updating to ${progress}% (${uniqueSteps.length}/${totalSteps} steps)`)
  
  await prisma.startedProject.update({
    where: { id: project.id },
    data: {
      completedSteps: uniqueSteps,
      progress: progress
    }
  })
  
  console.log('✅ Fixed!')
}

fix().then(() => process.exit(0))
