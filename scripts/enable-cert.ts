import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function enable() {
  const userId = 'cmj35wqyk000041uchedxvsm3'
  
  await prisma.startedProject.updateMany({
    where: { 
      userId,
      progress: 100
    },
    data: {
      certificateEligible: true,
      certificateIssuedAt: new Date()
    }
  })
  
  console.log('✅ Certificate enabled! Refresh the page.')
}

enable().then(() => process.exit(0))
