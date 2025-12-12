import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  // Get your user
  const user = await prisma.user.findFirst({
    where: { email: { contains: 'apollo' } }
  })
  
  if (!user) {
    console.log('❌ User not found')
    return
  }
  
  console.log('✅ User:', user.email)
  console.log('User ID:', user.id)
  
  // Get started projects
  const started = await prisma.startedProject.findMany({
    where: { userId: user.id },
    include: { projectTemplate: true }
  })
  
  console.log('\nStarted Projects:', started.length)
  started.forEach(p => {
    console.log(`  - ${p.projectTemplate.title}: ${p.progress}% (${p.completedSteps.length} steps)`)
  })
}

check().then(() => process.exit(0))
