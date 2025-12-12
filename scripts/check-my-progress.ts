import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const userId = 'cmj35wqyk000041uchedxvsm3'
  
  const started = await prisma.startedProject.findMany({
    where: { userId },
    include: { projectTemplate: true }
  })
  
  console.log(`Started Projects: ${started.length}\n`)
  
  if (started.length === 0) {
    console.log('❌ No started projects found!')
    console.log('You need to click "Start Project" button first')
    return
  }
  
  started.forEach(p => {
    console.log(`Project: ${p.projectTemplate.title}`)
    console.log(`Progress: ${p.progress}%`)
    console.log(`Completed Steps: ${p.completedSteps.length}`)
    console.log(`Status: ${p.status}`)
    console.log(`GitHub: ${p.githubRepoUrl || 'Not submitted'}`)
    console.log(`Showcase: ${p.showcaseSubmitted ? 'Yes' : 'No'}`)
    console.log(`Certificate Eligible: ${p.certificateEligible ? 'Yes' : 'No'}`)
    console.log('---')
  })
}

check().then(() => process.exit(0))
