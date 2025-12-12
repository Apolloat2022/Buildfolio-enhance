import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function fix() {
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
  
  // Get the current valid step IDs
  const validStepIds = project.projectTemplate.steps.map(s => s.id)
  
  console.log('Marking all 7 steps as complete with new IDs...')
  
  await prisma.startedProject.update({
    where: { id: project.id },
    data: {
      completedSteps: validStepIds,
      progress: 100,
      status: 'completed'
    }
  })
  
  console.log('✅ Fixed! Project now at 100% with correct step IDs')
}

fix().then(() => process.exit(0))
