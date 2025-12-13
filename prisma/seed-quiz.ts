import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🎓 Seeding comprehensive quiz questions...')

  const project = await prisma.projectTemplate.findFirst({
    where: { 
      title: { contains: 'E-commerce' }
    },
    include: { steps: { orderBy: { order: 'asc' } } }
  })

  if (!project) {
    console.log('❌ E-commerce project not found')
    return
  }

  console.log(`✅ Found: ${project.title}`)
  console.log(`📝 Steps found: ${project.steps.length}`)

  // Delete existing questions
  await prisma.quizQuestion.deleteMany({
    where: {
      step: {
        projectTemplateId: project.id
      }
    }
  })
  console.log('🗑️ Cleared old questions')

  const quizData = [
    // Step 1: Project Setup & Database Schema (5 questions)
    {
      stepOrder: 1,
      questions: [
        {
          question: 'What command creates a new Next.js project with TypeScript?',
          options: ['npm create next-app', 'npx create-next-app', 'npm install next', 'next init'],
          correctIndex: 1,
          explanation: 'npx runs packages without installing globally and ensures you get the latest version.',
          order: 1
        },
        {
          question: 'Why use Decimal type instead of Float for prices in Prisma?',
          options: ['Faster queries', 'Less storage space', 'Prevents floating-point rounding errors', 'Required by Stripe'],
          correctIndex: 2,
          explanation: 'Decimal prevents issues like 0.1 + 0.2 = 0.30000000000000004 which breaks money calculations.',
          order: 2
        },
        {
          question: 'What does "npx prisma generate" do?',
          options: ['Creates the database', 'Generates TypeScript types from schema', 'Runs migrations', 'Starts Prisma Studio'],
          correctIndex: 1,
          explanation: 'Generates Prisma Client with TypeScript types for type-safe database queries.',
          order: 3
        },
        {
          question: 'Where should you store DATABASE_URL in development?',
          options: ['package.json', '.env file (gitignored)', 'public folder', 'schema.prisma'],
          correctIndex: 1,
          explanation: '.env files store sensitive data and should never be committed to version control.',
          order: 4
        },
        {
          question: 'What does @db.Decimal(10, 2) mean in Prisma schema?',
          options: ['10 decimals, 2 integers', '10 total digits, 2 after decimal', '10 bytes, 2 precision', '10 max, 2 min'],
          correctIndex: 1,
          explanation: 'Total of 10 digits with 2 decimal places. Example: 99999999.99',
          order: 5
        }
      ]
    },
    // Step 2: Product Catalog Page (5 questions)
    {
      stepOrder: 2,
      questions: [
        {
          question: 'Why use Server Components for fetching products?',
          options: ['Faster client rendering', 'Better SEO and initial load time', 'Easier state management', 'Automatic caching only'],
          correctIndex: 1,
          explanation: 'Server Components fetch data on the server, improving SEO and initial page load performance.',
          order: 1
        },
        {
          question: 'What Prisma method fetches all products?',
          options: ['prisma.product.find()', 'prisma.product.getAll()', 'prisma.product.findMany()', 'prisma.product.fetchAll()'],
          correctIndex: 2,
          explanation: 'findMany() retrieves multiple records. Use findFirst() or findUnique() for single records.',
          order: 2
        },
        {
          question: 'Why use Next.js Image instead of <img> tag?',
          options: ['Required by Next.js', 'Automatic optimization and lazy loading', 'Better browser compatibility', 'Faster development'],
          correctIndex: 1,
          explanation: 'Next.js Image automatically optimizes images, lazy loads, and serves the right size/format.',
          order: 3
        },
        {
          question: 'What does the "priority" prop do on Next.js Image?',
          options: ['Loads image first', 'Disables lazy loading for above-fold images', 'Increases image quality', 'Preloads all images'],
          correctIndex: 1,
          explanation: 'Use priority for above-the-fold images to prevent Largest Contentful Paint issues.',
          order: 4
        },
        {
          question: 'How do you handle empty product lists in React?',
          options: ['Show error', 'Conditional rendering with message', 'Redirect to home', 'Crash the app'],
          correctIndex: 1,
          explanation: 'Always handle edge cases with conditional rendering and helpful user messages.',
          order: 5
        }
      ]
    },
    // Step 3: Shopping Cart (5 questions)
    {
      stepOrder: 3,
      questions: [
        {
          question: 'Why use Zustand over React Context for cart state?',
          options: ['Required by Next.js', 'Better performance and simpler API', 'Only works with TypeScript', 'Free to use'],
          correctIndex: 1,
          explanation: 'Zustand provides better performance, simpler API, and no Provider wrapper needed.',
          order: 1
        },
        {
          question: 'What does the persist middleware do in Zustand?',
          options: ['Makes state immutable', 'Saves state to localStorage', 'Improves performance', 'Enables time travel debugging'],
          correctIndex: 1,
          explanation: 'Persist middleware saves the store to localStorage and rehydrates it on page load.',
          order: 2
        },
        {
          question: 'Why validate cart contents before checkout?',
          options: ['Improve performance', 'Prevent out-of-stock purchases', 'Required by Stripe', 'Better UX only'],
          correctIndex: 1,
          explanation: 'Always verify product availability and prices server-side before processing payment.',
          order: 3
        },
        {
          question: 'What happens if you don\'t limit cart quantities?',
          options: ['Nothing', 'Users could order more than in stock', 'Faster checkout', 'Better performance'],
          correctIndex: 1,
          explanation: 'Always enforce stock limits to prevent overselling products.',
          order: 4
        },
        {
          question: 'How should you calculate cart total?',
          options: ['Client-side only', 'Server-side verification', 'Trust user input', 'Use cookies'],
          correctIndex: 1,
          explanation: 'Never trust client-side calculations for money. Always verify server-side.',
          order: 5
        }
      ]
    },
    // Step 4: Stripe Integration (5 questions)
    {
      stepOrder: 4,
      questions: [
        {
          question: 'Why multiply prices by 100 for Stripe?',
          options: ['Add sales tax', 'Stripe uses smallest currency unit (cents)', 'Better precision', 'Stripe API requirement'],
          correctIndex: 1,
          explanation: 'Stripe expects amounts in the smallest currency unit. $10.00 = 1000 cents.',
          order: 1
        },
        {
          question: 'Why must you verify webhook signatures?',
          options: ['Improve performance', 'Prevent fake payment notifications', 'Enable refunds', 'Track analytics'],
          correctIndex: 1,
          explanation: 'Signature verification ensures webhooks are actually from Stripe and haven\'t been tampered with.',
          order: 2
        },
        {
          question: 'Where should you store Stripe secret keys?',
          options: ['Client-side code', 'Server environment variables', 'Public folder', 'Git repository'],
          correctIndex: 1,
          explanation: 'NEVER expose secret keys client-side. Store in server environment variables only.',
          order: 3
        },
        {
          question: 'What is idempotency in payment processing?',
          options: ['Fast payments', 'Preventing duplicate charges', 'Automatic refunds', 'Card validation'],
          correctIndex: 1,
          explanation: 'Idempotency keys ensure the same request isn\'t processed multiple times.',
          order: 4
        },
        {
          question: 'When should you capture payment in Stripe?',
          options: ['Immediately always', 'After order fulfillment verification', 'Before stock check', 'Never'],
          correctIndex: 1,
          explanation: 'Authorize first, capture after confirming you can fulfill the order.',
          order: 5
        }
      ]
    },
    // Step 5: Admin Dashboard (5 questions)
    {
      stepOrder: 5,
      questions: [
        {
          question: 'How do you protect admin routes in Next.js?',
          options: ['Use middleware to check authentication', 'Hide the navigation link', 'Use CSS to hide content', 'Trust users not to visit'],
          correctIndex: 0,
          explanation: 'Middleware runs before the page loads and can redirect unauthorized users.',
          order: 1
        },
        {
          question: 'What Prisma method calculates total revenue?',
          options: ['sum()', 'aggregate()', 'calculate()', 'total()'],
          correctIndex: 1,
          explanation: 'aggregate() can compute SUM, AVG, COUNT, MIN, MAX on numeric fields.',
          order: 2
        },
        {
          question: 'Why is role-based access control important?',
          options: ['Faster queries', 'Prevent unauthorized actions', 'Better SEO', 'Improve performance'],
          correctIndex: 1,
          explanation: 'RBAC ensures users can only perform actions they\'re authorized for.',
          order: 3
        },
        {
          question: 'What should you validate in admin forms?',
          options: ['Client-side only', 'Server-side only', 'Both client and server-side', 'Neither'],
          correctIndex: 2,
          explanation: 'Client-side for UX, server-side for security. Never trust client input.',
          order: 4
        },
        {
          question: 'How do you prevent SQL injection with Prisma?',
          options: ['Manual escaping', 'Prisma automatically prevents it', 'Use raw queries', 'Validate all input'],
          correctIndex: 1,
          explanation: 'Prisma uses parameterized queries which prevent SQL injection automatically.',
          order: 5
        }
      ]
    },
    // Step 6: Search & Filter (5 questions)
    {
      stepOrder: 6,
      questions: [
        {
          question: 'What is debouncing in search functionality?',
          options: ['Caching results', 'Delaying API calls until typing stops', 'Sorting by relevance', 'Filtering duplicates'],
          correctIndex: 1,
          explanation: 'Debouncing waits for a pause in typing before searching, reducing unnecessary API calls.',
          order: 1
        },
        {
          question: 'Why store search params in the URL?',
          options: ['Faster search', 'Shareable links and browser back/forward', 'Better SEO only', 'Required by Next.js'],
          correctIndex: 1,
          explanation: 'URL params make searches shareable, SEO-friendly, and work with browser navigation.',
          order: 2
        },
        {
          question: 'What does mode: "insensitive" do in Prisma queries?',
          options: ['Faster queries', 'Case-insensitive search', 'Exact match only', 'Regex search'],
          correctIndex: 1,
          explanation: 'Makes search case-insensitive so "iPhone" matches "iphone" and "IPHONE".',
          order: 3
        },
        {
          question: 'How do you combine multiple filters in Prisma?',
          options: ['Use OR', 'Use AND', 'Use both AND/OR operators', 'Chain queries'],
          correctIndex: 2,
          explanation: 'Prisma supports AND, OR, and NOT operators for complex filtering logic.',
          order: 4
        },
        {
          question: 'Why paginate search results?',
          options: ['Better SEO', 'Prevent loading thousands of records', 'Required by Prisma', 'Faster database'],
          correctIndex: 1,
          explanation: 'Pagination prevents performance issues and improves user experience with large datasets.',
          order: 5
        }
      ]
    },
    // Step 7: Deploy to Vercel (5 questions)
    {
      stepOrder: 7,
      questions: [
        {
          question: 'What must you do before deploying to production?',
          options: ['Delete node_modules', 'Set environment variables in Vercel dashboard', 'Upgrade to Vercel Pro', 'Run npm audit'],
          correctIndex: 1,
          explanation: 'Environment variables must be configured in Vercel for the app to work in production.',
          order: 1
        },
        {
          question: 'Why use a separate production database?',
          options: ['Faster queries', 'Prevent development changes from affecting production', 'Required by Vercel', 'Better security only'],
          correctIndex: 1,
          explanation: 'Separate databases prevent accidental data loss and allow safe development testing.',
          order: 2
        },
        {
          question: 'What happens if you forget to update webhook URLs after domain change?',
          options: ['Nothing', 'Webhooks fail and payments won\'t be processed', 'Slower performance', 'SEO issues'],
          correctIndex: 1,
          explanation: 'Stripe sends webhooks to the old URL, so payments won\'t be confirmed in your app.',
          order: 3
        },
        {
          question: 'Why does Vercel automatically run "npm run build"?',
          options: ['Check for errors', 'Create optimized production bundle', 'Install dependencies', 'Run tests'],
          correctIndex: 1,
          explanation: 'Build process optimizes code, generates static pages, and catches build-time errors.',
          order: 4
        },
        {
          question: 'What is the benefit of Vercel\'s edge network?',
          options: ['Cheaper hosting', 'Faster global page loads via CDN', 'More storage', 'Better analytics'],
          correctIndex: 1,
          explanation: 'Vercel serves your app from servers close to users worldwide for faster load times.',
          order: 5
        }
      ]
    }
  ]

  let total = 0
  for (const stepData of quizData) {
    const step = project.steps.find(s => s.order === stepData.stepOrder)
    if (!step) {
      console.log(`⚠️  Step ${stepData.stepOrder} not found`)
      continue
    }

    for (const q of stepData.questions) {
      await prisma.quizQuestion.create({
        data: {
          stepId: step.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          order: q.order,
          difficulty: 'medium'
        }
      })
      total++
    }
    console.log(`✅ Step ${step.order}: ${stepData.questions.length} questions`)
  }

  console.log(`\n🎉 Created ${total} comprehensive quiz questions!`)
  console.log('📊 5 questions per step × 7 steps = 35 total questions')
  console.log('🎯 Users must score 80%+ to pass each step')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
