import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Creating projects with CORRECT schema...')
  
  // Clear old data
  await prisma.quizAttempt.deleteMany()
  await prisma.quizQuestion.deleteMany()
  await prisma.stepCompletion.deleteMany()
  await prisma.startedProject.deleteMany()
  await prisma.step.deleteMany()
  await prisma.project.deleteMany()
  
  console.log('🧹 Cleared existing data')
  
  // Create E-commerce Store
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
          {
            order: 1,
            title: 'Project Setup & Database',
            description: 'Set up Next.js project, configure Prisma with PostgreSQL, and create initial models.',
            estimatedMinutes: 30,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            requiresQuiz: true
          },
          {
            order: 2,
            title: 'Product Listings & UI',
            description: 'Create product listing pages, implement responsive UI with Tailwind CSS.',
            estimatedMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            requiresQuiz: true
          },
          {
            order: 3,
            title: 'Shopping Cart & State Management',
            description: 'Implement shopping cart functionality with Zustand for state management.',
            estimatedMinutes: 40,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            requiresQuiz: true
          },
          {
            order: 4,
            title: 'Stripe Integration & Checkout',
            description: 'Integrate Stripe for payments, create checkout flow and webhooks.',
            estimatedMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            requiresQuiz: true
          },
          {
            order: 5,
            title: 'Authentication & Middleware',
            description: 'Add user authentication with NextAuth.js and implement route protection.',
            estimatedMinutes: 35,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            requiresQuiz: true
          },
          {
            order: 6,
            title: 'Search & Filtering',
            description: 'Implement product search with debouncing and advanced filtering.',
            estimatedMinutes: 30,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            requiresQuiz: true
          },
          {
            order: 7,
            title: 'Deployment & Optimization',
            description: 'Deploy to Vercel, optimize performance, and add analytics.',
            estimatedMinutes: 25,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            requiresQuiz: true
          }
        ]
      }
    }
  })
  
  console.log("✅ Created: E-commerce Store (ecommerce-store)")
  
  // Create other projects
  const otherProjects = [
    { slug: 'todo-app', title: 'React Todo Application', difficulty: 'Beginner' },
    { slug: 'weather-app', title: 'Weather Dashboard', difficulty: 'Beginner' },
    { slug: 'social-dashboard', title: 'Social Media Dashboard', difficulty: 'Intermediate' },
    { slug: 'recipe-finder', title: 'Recipe Finder App', difficulty: 'Intermediate' },
    { slug: 'portfolio-builder', title: 'Portfolio Builder', difficulty: 'Advanced' }
  ]
  
  for (const proj of otherProjects) {
    await prisma.project.create({
      data: {
        title: proj.title,
        slug: proj.slug,
        description: `Build a ${proj.title.toLowerCase()} with modern technologies.`,
        difficulty: proj.difficulty,
        estimatedHours: 8,
        tags: ['react', 'javascript'],
        steps: {
          create: [
            { order: 1, title: 'Setup', description: 'Project initialization', estimatedMinutes: 20, requiresQuiz: false },
            { order: 2, title: 'Core Features', description: 'Main functionality', estimatedMinutes: 60, requiresQuiz: false },
            { order: 3, title: 'Polish', description: 'UI and deployment', estimatedMinutes: 40, requiresQuiz: false }
          ]
        }
      }
    })
    console.log(`✅ Created: ${proj.title} (${proj.slug})`)
  }
  
  console.log('🎉 All 6 projects created successfully!')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
