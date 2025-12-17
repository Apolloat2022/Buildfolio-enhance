// scripts/create-basic-projects.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Creating basic projects...')
  
  // Create E-commerce Store (MOST IMPORTANT)
  const ecommerce = await prisma.project.create({
    data: {
      title: 'Build a Modern E-commerce Store',
      slug: 'ecommerce-store',
      description: 'Learn to build a full-stack e-commerce application with Next.js, Stripe, and Prisma.',
      difficulty: 'Intermediate',
      estimatedHours: 15,
      tags: ['nextjs', 'react', 'typescript', 'stripe', 'prisma'],
      steps: {
        create: [
          { order: 1, title: 'Setup', description: 'Project setup', estimatedMinutes: 30 },
          { order: 2, title: 'Database', description: 'Database setup', estimatedMinutes: 45 },
          { order: 3, title: 'UI', description: 'User interface', estimatedMinutes: 40 },
          { order: 4, title: 'Cart', description: 'Shopping cart', estimatedMinutes: 50 },
          { order: 5, title: 'Checkout', description: 'Checkout system', estimatedMinutes: 35 },
          { order: 6, title: 'Auth', description: 'Authentication', estimatedMinutes: 30 },
          { order: 7, title: 'Deploy', description: 'Deployment', estimatedMinutes: 25 }
        ]
      }
    }
  })
  
  console.log(\`✅ Created: \${ecommerce.title} (\${ecommerce.slug})\`)
  
  // Create other basic projects
  const projects = [
    { slug: 'todo-app', title: 'React Todo Application', difficulty: 'Beginner' },
    { slug: 'weather-app', title: 'Weather Dashboard', difficulty: 'Beginner' },
    { slug: 'social-dashboard', title: 'Social Media Dashboard', difficulty: 'Intermediate' },
    { slug: 'recipe-finder', title: 'Recipe Finder App', difficulty: 'Intermediate' },
    { slug: 'portfolio-builder', title: 'Portfolio Builder', difficulty: 'Advanced' }
  ]
  
  for (const proj of projects) {
    await prisma.project.create({
      data: {
        title: proj.title,
        slug: proj.slug,
        description: \`Build a \${proj.title.toLowerCase()}\`,
        difficulty: proj.difficulty,
        estimatedHours: 8,
        tags: ['react', 'javascript'],
        steps: {
          create: [
            { order: 1, title: 'Setup', description: 'Setup', estimatedMinutes: 20 },
            { order: 2, title: 'Core', description: 'Core features', estimatedMinutes: 60 },
            { order: 3, title: 'Polish', description: 'Polish and deploy', estimatedMinutes: 40 }
          ]
        }
      }
    })
    console.log(\`✅ Created: \${proj.title} (\${proj.slug})\`)
  }
  
  console.log('🎉 Created 6 projects total!')
  console.log('👉 Now run: npx tsx prisma/seed-quiz.ts')
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message)
    console.error('Full error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
