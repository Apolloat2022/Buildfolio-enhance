// scripts/create-templates.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Creating ProjectTemplates (for /projects/[slug] pages)...')
  
  // Clear existing templates
  await prisma.projectTemplate.deleteMany()
  console.log('🧹 Cleared old templates')
  
  // Create E-commerce Store Template
  const ecommerce = await prisma.projectTemplate.create({
    data: {
      slug: 'ecommerce-store',
      title: 'Build a Modern E-commerce Store',
      description: 'Learn to build a full-stack e-commerce application with Next.js, Stripe, and Prisma.',
      difficulty: 'intermediate',
      timeEstimate: '40 hours',
      technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'Stripe'],
      resumeImpact: 5,
      category: 'e-commerce',
      steps: {
        create: [
          {
            order: 1,
            title: 'Project Setup & Database',
            description: 'Set up Next.js project, configure Prisma with PostgreSQL.',
            estimatedMinutes: 30,
            videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_1'
          },
          {
            order: 2,
            title: 'Product Listings & UI',
            description: 'Create product listing pages with Tailwind CSS.',
            estimatedMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_2'
          },
          {
            order: 3,
            title: 'Shopping Cart',
            description: 'Implement shopping cart with Zustand.',
            estimatedMinutes: 40,
            videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_3'
          },
          {
            order: 4,
            title: 'Stripe Checkout',
            description: 'Integrate Stripe payments.',
            estimatedMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_4'
          },
          {
            order: 5,
            title: 'Authentication',
            description: 'Add auth with NextAuth.js.',
            estimatedMinutes: 35,
            videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_5'
          },
          {
            order: 6,
            title: 'Search & Filters',
            description: 'Implement search functionality.',
            estimatedMinutes: 30,
            videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_6'
          },
          {
            order: 7,
            title: 'Deployment',
            description: 'Deploy to Vercel.',
            estimatedMinutes: 25,
            videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_7'
          }
        ]
      }
    }
  })
  
  console.log('✅ Created: ecommerce-store template with 7 steps')
  
  // Create other template projects
  const templates = [
    {
      slug: 'todo-app',
      title: 'React Todo Application',
      description: 'Build a modern todo app with React and TypeScript.',
      difficulty: 'beginner',
      timeEstimate: '10 hours',
      technologies: ['React', 'TypeScript', 'Tailwind'],
      resumeImpact: 3,
      category: 'web'
    },
    {
      slug: 'weather-app',
      title: 'Weather Dashboard',
      description: 'Create a weather app with API integration.',
      difficulty: 'beginner',
      timeEstimate: '12 hours',
      technologies: ['React', 'API', 'Charts'],
      resumeImpact: 3,
      category: 'web'
    },
    {
      slug: 'social-dashboard',
      title: 'Social Media Dashboard',
      description: 'Build analytics dashboard with real-time data.',
      difficulty: 'intermediate',
      timeEstimate: '25 hours',
      technologies: ['Next.js', 'D3', 'Analytics'],
      resumeImpact: 4,
      category: 'dashboard'
    },
    {
      slug: 'recipe-finder',
      title: 'Recipe Finder App',
      description: 'Create a recipe search engine with filtering.',
      difficulty: 'intermediate',
      timeEstimate: '18 hours',
      technologies: ['React', 'API', 'Search'],
      resumeImpact: 4,
      category: 'web'
    },
    {
      slug: 'portfolio-builder',
      title: 'Portfolio Builder',
      description: 'Build a customizable portfolio website.',
      difficulty: 'advanced',
      timeEstimate: '30 hours',
      technologies: ['Next.js', 'CMS', 'Tailwind'],
      resumeImpact: 5,
      category: 'portfolio'
    }
  ]
  
  for (const template of templates) {
    await prisma.projectTemplate.create({
      data: {
        ...template,
        steps: {
          create: [
            { order: 1, title: 'Setup', description: 'Project initialization', estimatedMinutes: 30 },
            { order: 2, title: 'Core Features', description: 'Main functionality', estimatedMinutes: 90 },
            { order: 3, title: 'Polish & Deploy', description: 'UI polish and deployment', estimatedMinutes: 60 }
          ]
        }
      }
    })
    console.log(\`✅ Created: \${template.slug}\`)
  }
  
  console.log('\\n🎉 Created 6 ProjectTemplates!')
  console.log('🌐 Your URLs should now work:')
  console.log('   • https://buildfolio.tech/projects/ecommerce-store')
  console.log('   • https://buildfolio.tech/projects/todo-app')
  console.log('   • etc...')
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
