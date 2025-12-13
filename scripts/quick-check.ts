import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const count = await prisma.projectTemplate.count()
  console.log(`\nProjects in database: ${count}`)
  
  if (count === 1) {
    console.log('\n❌ Only 1 project! Need to seed the rest.')
  }
}

check().then(() => process.exit(0))
