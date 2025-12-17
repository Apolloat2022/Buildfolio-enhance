// prisma/seed.ts - CORRECTED FOR YOUR ACTUAL SCHEMA
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedQuizQuestions() {
  console.log('📝 Seeding quiz questions...')
  
  try {
    // Clear existing quiz questions
    await prisma.quizQuestion.deleteMany()
    console.log('🧹 Cleared existing quiz questions')

    // Get all steps
    const steps = await prisma.step.findMany({
      orderBy: { order: 'asc' }
    })

    // Define quiz questions for each step
    const quizData = [
      // Step 1 questions
      {
        stepOrder: 1,
        questions: [
          {
            question: 'What command creates a new Next.js project?',
            options: [
              'npm create next-app',
              'npx create-next-app',
              'npm install next',
              'next init'
            ],
            correctIndex: 1,
            explanation: 'npx runs packages without installing globally and ensures you get the latest version.',
            order: 1
          },
          {
            question: 'Which authentication library is recommended for Next.js?',
            options: [
              'Firebase Auth',
              'NextAuth.js',
              'Auth0',
              'Passport.js'
            ],
            correctIndex: 1,
            explanation: 'NextAuth.js is specifically designed for Next.js and offers seamless integration.',
            order: 2
          },
          {
            question: 'What environment variable is required for NextAuth.js?',
            options: [
              'NEXT_PUBLIC_AUTH_SECRET',
              'NEXTAUTH_SECRET',
              'AUTH_SECRET_KEY',
              'NEXT_AUTH_TOKEN'
            ],
            correctIndex: 1,
            explanation: 'NEXTAUTH_SECRET is required to encrypt cookies and tokens in NextAuth.js.',
            order: 3
          }
        ]
      },
      // Step 2 questions
      {
        stepOrder: 2,
        questions: [
          {
            question: 'Which ORM works best with Next.js and TypeScript?',
            options: [
              'Sequelize',
              'TypeORM',
              'Prisma',
              'Mongoose'
            ],
            correctIndex: 2,
            explanation: 'Prisma offers excellent TypeScript support and integrates well with Next.js.',
            order: 1
          },
          {
            question: 'What data type should you use for prices in a database?',
            options: [
              'Integer',
              'Float',
              'Decimal',
              'String'
            ],
            correctIndex: 2,
            explanation: 'Decimal is preferred for prices to avoid floating-point precision errors.',
            order: 2
          }
        ]
      },
      // Step 3 questions  
      {
        stepOrder: 3,
        questions: [
          {
            question: 'What is the recommended way to manage cart state?',
            options: [
              'React Context',
              'Zustand',
              'Redux',
              'Local Storage'
            ],
            correctIndex: 1,
            explanation: 'Zustand is lightweight and works well for cart state in e-commerce applications.',
            order: 1
          },
          {
            question: 'How should you validate cart items on the server?',
            options: [
              'Client-side validation only',
              'Zod schema validation',
              'No validation needed',
              'Database constraints only'
            ],
            correctIndex: 1,
            explanation: 'Zod provides type-safe schema validation that works on both client and server.',
            order: 2
          }
        ]
      },
      // Step 4 questions
      {
        stepOrder: 4,
        questions: [
          {
            question: 'Which payment processor is integrated in this project?',
            options: [
              'PayPal',
              'Stripe',
              'Square',
              'Authorize.net'
            ],
            correctIndex: 1,
            explanation: 'Stripe is used for payment processing in this e-commerce store.',
            order: 1
          },
          {
            question: 'What is crucial for handling payment webhooks?',
            options: [
              'Using GET requests',
              'Validating Stripe signatures',
              'Storing raw request body',
              'Skipping validation for speed'
            ],
            correctIndex: 1,
            explanation: 'Always validate Stripe signatures to ensure webhook requests are legitimate.',
            order: 2
          }
        ]
      },
      // Step 5 questions
      {
        stepOrder: 5,
        questions: [
          {
            question: 'What middleware pattern is used in Next.js?',
            options: [
              'Custom middleware',
              'Next.js middleware',
              'Express middleware',
              'No middleware'
            ],
            correctIndex: 1,
            explanation: 'Next.js has built-in middleware that runs before requests are completed.',
            order: 1
          }
        ]
      },
      // Step 6 questions
      {
        stepOrder: 6,
        questions: [
          {
            question: 'What should you implement for admin routes?',
            options: [
              'No authentication needed',
              'Role-based access control',
              'Public access',
              'Client-side checks only'
            ],
            correctIndex: 1,
            explanation: 'Always implement server-side role-based access control for admin routes.',
            order: 1
          }
        ]
      },
      // Step 7 questions
      {
        stepOrder: 7,
        questions: [
          {
            question: 'What is a key deployment consideration?',
            options: [
              'Skipping environment variables',
              'Using production database in dev',
              'Setting proper environment variables',
              'Deploying without building'
            ],
            correctIndex: 2,
            explanation: 'Always set proper environment variables for production deployment.',
            order: 1
          }
        ]
      }
    ]

    // Create quiz questions
    let totalQuestions = 0
    
    for (const stepData of quizData) {
      const step = steps.find((s: any) => s.order === stepData.stepOrder)
      
      if (step) {
        for (const question of stepData.questions) {
          await prisma.quizQuestion.create({
            data: {
              stepId: step.id,
              question: question.question,
              options: question.options,
              correctIndex: question.correctIndex,
              explanation: question.explanation,
              order: question.order
            }
          })
          totalQuestions++
        }
      }
    }

    console.log(`✅ Created ${totalQuestions} quiz questions across ${steps.length} steps`)
    return totalQuestions
    
  } catch (error) {
    console.error('❌ Error seeding quiz questions:', error)
    throw error
  }
}

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // 1. CLEAN UP EXISTING DATA (in correct order due to foreign keys)
    // Delete in reverse order of dependencies
    
    // First delete QuizQuestion (depends on Step)
    try {
      await prisma.quizQuestion.deleteMany()
      console.log('🧹 Cleared existing quiz questions')
    } catch (error) {
      console.log('⚠️ Error clearing quiz questions:', (error as Error)\.message)
    }
    
    // Delete StartedProject (depends on ProjectTemplate and User)
    try {
      await prisma.startedProject.deleteMany()
      console.log('🧹 Cleared existing started projects')
    } catch (error) {
      console.log('⚠️ Error clearing started projects:', (error as Error)\.message)
    }
    
    // Delete Step (depends on Project)
    await prisma.step.deleteMany()
    console.log('🧹 Cleared existing steps')
    
    // Delete ProjectTemplate
    await prisma.projectTemplate.deleteMany()
    console.log('🧹 Cleared existing project templates')
    
    // Note: We don\'t delete User, Account, Session, etc. as they contain user data
    
    // 2. CREATE THE E-COMMERCE STORE PROJECT
    console.log('🚀 Creating e-commerce store project...')
    
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
            {
              order: 3,
              title: 'Product Listing & UI Components',
              description: 'Build the product grid, filters, and shopping cart UI.',
              codeSnippets: [
                { language: 'typescript', code: '// components/ProductGrid.tsx\nconst ProductGrid = ({ products }) => {\n  return (\n    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n      {products.map(product => (\n        <ProductCard key={product.id} product={product} />\n      ))}\n    </div>\n  )\n}' }
              ],
              pitfalls: ['Not making components responsive', 'Forgetting loading states'],
              estimatedTime: '4 hours'
            },
            {
              order: 4,
              title: 'Shopping Cart & State Management',
              description: 'Implement cart functionality with proper state management.',
              codeSnippets: [
                { language: 'typescript', code: '// store/cart-store.ts\nimport { create } from "zustand";\n\ninterface CartStore {\n  items: CartItem[];\n  addItem: (product: Product) => void;\n  removeItem: (id: string) => void;\n}' }
              ],
              pitfalls: ['Not persisting cart state', 'Forgetting to validate cart items'],
              estimatedTime: '3 hours'
            },
            {
              order: 5,
              title: 'Checkout & Payment Integration',
              description: 'Integrate Stripe for secure payment processing.',
              codeSnippets: [
                { language: 'typescript', code: '// app/api/checkout/route.ts\nimport Stripe from "stripe";\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);' }
              ],
              pitfalls: ['Not handling webhooks', 'Exposing secret keys'],
              estimatedTime: '4 hours'
            },
            {
              order: 6,
              title: 'Order Management & Admin Panel',
              description: 'Build order tracking and admin functionality.',
              codeSnippets: [
                { language: 'typescript', code: '// app/admin/orders/page.tsx\nconst OrdersPage = () => {\n  const orders = await prisma.order.findMany({\n    include: { user: true, items: true }\n  });\n}' }
              ],
              pitfalls: ['Not adding authentication checks', 'Forgetting pagination'],
              estimatedTime: '3 hours'
            },
            {
              order: 7,
              title: 'Deployment & Performance Optimization',
              description: 'Deploy to production and optimize performance.',
              codeSnippets: [
                { language: 'bash', code: 'vercel deploy --prod' },
                { language: 'typescript', code: '// app/page.tsx\nexport const dynamic = "force-dynamic";' }
              ],
              pitfalls: ['Not setting environment variables', 'Forgetting to build before deploy'],
              estimatedTime: '2 hours'
            }
          ]
        }
      }
    })

    console.log(`✅ Created project: ${ecommerceProject.title}`)
    console.log(`   Slug: ${ecommerceProject.slug}`)
    console.log(`   Steps: 7`)
    
    // 3. SEED QUIZ QUESTIONS
    console.log('\n📚 Seeding quiz questions...')
    await seedQuizQuestions()
    
    console.log('\n🎉 Seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('   - Created e-commerce store project with 7 steps')
    console.log('   - Seeded 12 quiz questions across all steps')
    console.log('   - Ready for users to start learning!')
    
  } catch (error) {
    console.error('\n❌ Seeding error:', error)
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Make sure database is running')
    console.log('   2. Run: npx prisma db push (if schema changed)')
    console.log('   3. Run: npx prisma generate (to update client)')
    process.exit(1)
  }
}

// Handle promise rejection
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error)
  process.exit(1)
})

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

