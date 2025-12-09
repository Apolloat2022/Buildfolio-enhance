console.log('Checking database...') 
const {PrismaClient} = require('@prisma/client') 
const prisma = new PrismaClient() 
async function main() { 
  const count = await prisma.projectTemplate.count() 
  console.log('Total templates:', count) 
  const templates = await prisma.projectTemplate.findMany() 
  templates.forEach(t = ' + t.title)) 
  await prisma.$disconnect() 
} 
main() 
