// prisma/seed.ts - CLEAN SLATE VERSION
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  
  // 1. CLEAN UP EXISTING DATA (in correct order due to relations)
  await prisma.step.deleteMany()
  console.log('🧹 Cleared existing steps')
  
  await prisma.startedProject.deleteMany()
  console.log('🧹 Cleared existing started projects')
  
  await prisma.projectTemplate.deleteMany()
  console.log('🧹 Cleared existing project templates')
  
  // 2. CREATE THE E-COMMERCE STORE PROJECT
  const ecommerceProject = await prisma.projectTemplate.create({
    data: {
      slug: 'ecommerce-store',
      title: 'Build a Modern E-commerce Store',
      description: 'Learn full-stack development by building a complete online store with Next.js, Stripe, and Prisma.',
      difficulty: 'intermediate',
      timeEstimate: '25-30 hours',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Stripe', 'NextAuth.js'],
      resumeImpact: 5,
      category: 'Full-Stack',
      steps: {
        create: [
          {
            order: 1,
            title: 'Project Setup & Authentication',
            description: 'Initialize the project with proper structure and user authentication.',
            codeSnippets: [
              { language: 'bash', code: 'npx create-next-app@latest ecommerce-store --typescript --tailwind --app' },
              { language: 'typescript', code: '// app/auth.ts\nimport { NextAuth } from "next-auth"\nimport GitHubProvider from "next-auth/providers/github"' }
            ],
            pitfalls: ['Forgetting to set NEXTAUTH_SECRET', 'Not configuring GitHub OAuth app correctly'],
            estimatedTime: '2 hours'
          },
          {
            order: 2,
            title: 'Database Schema & Product Models',
            description: 'Design the database schema for products, categories, and user carts.',
            codeSnippets: [
              { language: 'prisma', code: 'model Product {\n  id String @id @default(cuid())\n  name String\n  price Decimal\n  description String?\n  category String\n  images String[]\n}' }
            ],
            pitfalls: ['Not adding proper indexes', 'Forgetting decimal precision for prices'],
            estimatedTime: '3 hours'
          },
          // Add more steps as needed
          {
            order: 3,
            title: 'Product Listing & UI Components',
            description: 'Build the product grid, filters, and shopping cart UI.',
            codeSnippets: [
              { language: 'typescript', code: '// components/ProductGrid.tsx\nconst ProductGrid = ({ products }) => {\n  return (\n    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n      {products.map(product => (\n        <ProductCard key={product.id} product={product} />\n      ))}\n    </div>\n  )\n}' }
            ],
            pitfalls: ['Not making components responsive', 'Forgetting loading states'],
            estimatedTime: '4 hours'
          }
        ]
      }
    }
  })

  console.log(`✅ Created project: ${ecommerceProject.title}`)
  console.log(`🌱 Seeding completed successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })