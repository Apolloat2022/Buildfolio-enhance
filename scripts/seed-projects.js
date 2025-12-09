// scripts/seed-projects.js - FIXED VERSION
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const projectTemplates = [
  {
    title: "E-Commerce Store",
    description: "Build a full-stack e-commerce platform with cart, checkout, and payment integration",
    difficulty: "intermediate",
    timeEstimate: "40 hours",
    technologies: ["Next.js", "TypeScript", "Tailwind", "Prisma", "Stripe"],
    resumeImpact: 5,
    steps: [
      "Setup project structure and authentication",
      "Create product catalog with filters",
      "Implement shopping cart functionality",
      "Integrate Stripe payment processing",
      "Add order management dashboard"
    ],
    slug: "e-commerce-store",
    category: "e-commerce"
  },
  {
    title: "Social Media Dashboard",
    description: "Create a Twitter-like social platform with real-time updates",
    difficulty: "advanced",
    timeEstimate: "60 hours",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Redis"],
    resumeImpact: 5,
    steps: [
      "Setup real-time messaging with Socket.io",
      "Implement user authentication and profiles",
      "Create post/tweet functionality",
      "Add follow/unfollow system",
      "Build news feed algorithm"
    ],
    slug: "social-media-dashboard",
    category: "social-media"
  },
  {
    title: "Task Management App",
    description: "A Trello-like task manager with drag & drop functionality",
    difficulty: "beginner",
    timeEstimate: "20 hours",
    technologies: ["React", "CSS", "LocalStorage", "Drag & Drop API"],
    resumeImpact: 4,
    steps: [
      "Create board and column components",
      "Implement drag & drop functionality",
      "Add task creation and editing",
      "Persist data to LocalStorage",
      "Add filtering and search"
    ],
    slug: "task-management-app",
    category: "productivity"
  },
  // Add more templates with slug and category...
]

async function seedProjects() {
  console.log('🌱 Seeding project templates...')

  try {
    // Clear existing template projects
    await prisma.projectTemplate.deleteMany({})

    // Create template projects
    for (const template of projectTemplates) {
      await prisma.projectTemplate.create({
        data: template
      })
      console.log(`✅ Created: ${template.title}`)
    }

    console.log(`✅ Successfully seeded ${projectTemplates.length} project templates!`)
  } catch (error) {
    console.error('❌ Error seeding projects:', error.message)
    console.log('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedProjects()