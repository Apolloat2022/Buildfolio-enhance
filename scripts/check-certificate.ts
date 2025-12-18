import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkCertificate() {
  // Check your user's progress
  const user = await prisma.user.findFirst({
    include: {
      startedProjects: {
        where: { 
          projectTemplate: { slug: 'ecommerce-store' }
        },
        include: {
          projectTemplate: { include: { steps: true } }
        }
      }
    }
  })
  
  if (!user || user.startedProjects.length === 0) {
    console.log('❌ No started projects found')
    return
  }
  
  const project = user.startedProjects[0]
  
  console.log(`\n👤 User: ${user.email}`)
  console.log(`📦 Project: ${project.projectTemplate.title}`)
  console.log(`📊 Progress: ${project.progress}%`)
  console.log(`✅ Completed Steps: ${project.completedSteps.length}/${project.projectTemplate.steps.length}`)
  console.log(`🎓 Certificate Eligible: ${project.certificateEligible ? 'YES' : 'NO'}`)
  console.log(`📜 Certificate Issued: ${project.certificateIssuedAt || 'Not issued'}`)
  
  if (project.progress >= 100) {
    console.log(`\n✅ USER SHOULD GET CERTIFICATE!`)
    if (!project.certificateEligible) {
      console.log(`❌ BUG: certificateEligible is false despite 100% progress`)
    }
  }
}

checkCertificate().then(() => process.exit(0))
