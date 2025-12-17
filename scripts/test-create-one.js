// scripts/test-create-one.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Testing project creation...')
  
  try {
    // Try to create just ONE project
    const project = await prisma.project.create({
      data: {
        title: 'E-commerce Store',
        slug: 'ecommerce-store',
        description: 'Test project',
        difficulty: 'Intermediate',
        estimatedHours: 10,
        tags: ['test']
      }
    })
    
    console.log('SUCCESS! Created project with ID:', project.id)
    console.log('Slug:', project.slug)
    
  } catch (error) {
    console.error('ERROR creating project:')
    console.error('Message:', error.message)
    console.error('Code:', error.code)
    console.error('Meta:', error.meta)
    
    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('Available tables:', tables)
  } finally {
    await prisma.$disconnect()
  }
}

main()
