import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const project = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: { steps: true }
  })
  
  console.log('Project:', project?.title)
  console.log('Steps count:', project?.steps?.length || 0)
  
  if (project?.steps) {
    project.steps.forEach(s => {
      console.log(`  Step ${s.order}: ${s.title}`)
    })
  }
}

check().then(() => process.exit(0))
