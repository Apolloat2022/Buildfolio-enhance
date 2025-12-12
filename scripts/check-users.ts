import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  })
  
  console.log(`Total users: ${users.length}\n`)
  users.forEach((u, i) => {
    console.log(`${i+1}. ${u.email || u.name || 'No email/name'}`)
    console.log(`   ID: ${u.id}`)
  })
}

check().then(() => process.exit(0))
