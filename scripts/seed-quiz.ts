import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedQuizQuestions() {
  console.log('?? Seeding quiz questions...')

  // Find the E-commerce project
  const project = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: { steps: { orderBy: { order: 'asc' } } }
  })

  if (!project) {
    console.error('? E-commerce project not found')
    return
  }

  console.log(`? Found project: ${project.title}`)
  console.log(`?? Creating questions for ${project.steps.length} steps`)

  // Quiz questions for each step
  const quizData = [
    // STEP 1: Project Setup & Database Schema
    {
      stepOrder: 1,
      questions: [
        {
          question: 'What command is used to create a new Next.js project?',
          options: ['npm create next-app', 'npx create-next-app', 'npm install next', 'next init'],
          correctIndex: 1,
          explanation: 'npx is used to run packages without installing them globally. It ensures you get the latest version of create-next-app.',
          order: 1
        },
        {
          question: 'Why should you use Decimal type for prices in Prisma?',
          options: ['It\'s faster than Number', 'It takes less storage space', 'It prevents floating-point rounding errors', 'It\'s required by Stripe'],
          correctIndex: 2,
          explanation: 'Decimal type stores exact values, preventing issues like 0.1 + 0.2 = 0.30000000000000004 which can cause serious problems with money calculations.',
          order: 2
        },
        {
          question: 'What does "npx prisma generate" do?',
          options: ['Creates a new database', 'Generates TypeScript types from schema', 'Runs database migrations', 'Starts Prisma Studio'],
          correctIndex: 1,
          explanation: 'Prisma generate creates the Prisma Client with TypeScript types based on your schema, enabling type-safe database queries.',
          order: 3
        },
        {
          question: 'Where should you store your DATABASE_URL?',
          options: ['In package.json', 'In a .env file', 'In the database schema', 'Directly in your code'],
          correctIndex: 1,
          explanation: 'Database URLs contain sensitive credentials and should be stored in .env files which are excluded from version control via .gitignore.',
          order: 4
        },
        {
          question: 'What is the purpose of ?sslmode=require in a PostgreSQL connection string?',
          options: ['It makes queries faster', 'It enforces encrypted connections', 'It\'s only needed in production', 'It enables connection pooling'],
          correctIndex: 1,
          explanation: '?sslmode=require forces SSL/TLS encryption for database connections, which is essential for security when connecting to hosted databases.',
          order: 5
        }
      ]
    },
    // STEP 2: Product Catalog Page
    {
      stepOrder: 2,
      questions: [
        {
          question: 'What is the benefit of using Server Components in Next.js for fetching products?',
          options: ['Faster client-side rendering', 'Better SEO and initial load time', 'Easier state management', 'Automatic caching'],
          correctIndex: 1,
          explanation: 'Server Components fetch data on the server, sending fully rendered HTML to the client, which improves SEO and initial page load performance.',
          order: 1
        },
        {
          question: 'What Prisma query method would you use to find all products in stock?',
          options: ['findMany({ where: { stock: > 0 } })', 'findMany({ where: { stock: { gt: 0 } } })', 'findMany({ stock: { greaterThan: 0 } })', 'findAll({ stock: positive })'],
          correctIndex: 1,
          explanation: 'Prisma uses query operators like "gt" (greater than) inside the where clause for filtering.',
          order: 2
        },
        {
          question: 'Why use Next.js Image component instead of regular <img> tags?',
          options: ['It\'s required by Next.js', 'Automatic image optimization and lazy loading', 'Better browser compatibility', 'Faster development'],
          correctIndex: 1,
          explanation: 'Next.js Image component automatically optimizes images, provides lazy loading, and serves the right size/format for each device.',
          order: 3
        }
      ]
    },
    // STEP 3: Shopping Cart
    {
      stepOrder: 3,
      questions: [
        {
          question: 'Why use Zustand instead of React Context for cart state?',
          options: ['It\'s required by Next.js', 'Better performance and simpler API', 'It works with TypeScript', 'It\'s free'],
          correctIndex: 1,
          explanation: 'Zustand provides better performance (no context re-renders), simpler API, and built-in persistence middleware.',
          order: 1
        },
        {
          question: 'What does the persist middleware in Zustand do?',
          options: ['Makes state immutable', 'Saves state to localStorage', 'Improves performance', 'Enables time travel debugging'],
          correctIndex: 1,
          explanation: 'The persist middleware automatically saves your store to localStorage and rehydrates it on page load.',
          order: 2
        },
        {
          question: 'Why should you validate cart items before checkout?',
          options: ['To improve performance', 'To prevent ordering out-of-stock or deleted items', 'It\'s required by Stripe', 'To reduce database queries'],
          correctIndex: 1,
          explanation: 'Product availability can change between adding to cart and checkout. Always validate against current database state.',
          order: 3
        }
      ]
    },
    // STEP 4: Stripe Integration
    {
      stepOrder: 4,
      questions: [
        {
          question: 'Why must you multiply prices by 100 when sending to Stripe?',
          options: ['To add tax', 'Stripe uses cents, not dollars', 'For better precision', 'It\'s a Stripe requirement'],
          correctIndex: 1,
          explanation: 'Stripe expects amounts in the smallest currency unit (cents for USD). $10.00 = 1000 cents.',
          order: 1
        },
        {
          question: 'What is the purpose of webhook signature verification?',
          options: ['To improve performance', 'To prevent fake payment notifications', 'To enable refunds', 'To track analytics'],
          correctIndex: 1,
          explanation: 'Signature verification ensures webhook events actually came from Stripe and haven\'t been tampered with.',
          order: 2
        },
        {
          question: 'Should you store Stripe secret keys in client-side code?',
          options: ['Yes, it\'s convenient', 'No, never - only in server-side environment variables', 'Only in production', 'Only if encrypted'],
          correctIndex: 1,
          explanation: 'Secret keys must NEVER be exposed to the client. They grant full access to your Stripe account and should only exist in server-side .env files.',
          order: 3
        }
      ]
    },
    // STEP 5: Admin Dashboard
    {
      stepOrder: 5,
      questions: [
        {
          question: 'How should you protect admin routes in Next.js?',
          options: ['Use middleware to check user role', 'Hide the link', 'Use CSS to hide content', 'Trust users not to access it'],
          correctIndex: 0,
          explanation: 'Middleware runs before the page loads and can redirect unauthorized users. Never rely on client-side hiding.',
          order: 1
        },
        {
          question: 'What Prisma method would you use to get total revenue?',
          options: ['sum()', 'aggregate()', 'count()', 'total()'],
          correctIndex: 1,
          explanation: 'aggregate() can perform operations like _sum, _avg, _count, _min, and _max on your data.',
          order: 2
        }
      ]
    },
    // STEP 6: Search & Filter
    {
      stepOrder: 6,
      questions: [
        {
          question: 'What is debouncing in the context of search?',
          options: ['Caching search results', 'Delaying API calls until user stops typing', 'Sorting results by relevance', 'Filtering duplicate results'],
          correctIndex: 1,
          explanation: 'Debouncing waits for a pause in user input before executing the search, reducing unnecessary API calls.',
          order: 1
        },
        {
          question: 'Why store filters in URL search parameters?',
          options: ['Better performance', 'SEO and shareable links', 'Required by Next.js', 'Easier to debug'],
          correctIndex: 1,
          explanation: 'URL parameters make filter states shareable and bookmarkable, and improve SEO for filtered pages.',
          order: 2
        },
        {
          question: 'What does "mode: insensitive" do in Prisma contains queries?',
          options: ['Makes searches faster', 'Makes searches case-insensitive', 'Enables fuzzy matching', 'Searches multiple fields'],
          correctIndex: 1,
          explanation: 'mode: "insensitive" makes the search case-insensitive, so "SHIRT" matches "shirt", "Shirt", etc.',
          order: 3
        }
      ]
    },
    // STEP 7: Deploy to Vercel
    {
      stepOrder: 7,
      questions: [
        {
          question: 'What must you do before deploying to Vercel?',
          options: ['Delete node_modules', 'Set environment variables in Vercel dashboard', 'Upgrade to Pro plan', 'Run npm audit'],
          correctIndex: 1,
          explanation: 'Environment variables from your local .env must be added to Vercel\'s dashboard, as .env files are not deployed.',
          order: 1
        },
        {
          question: 'Why use a separate production database?',
          options: ['It\'s faster', 'To avoid affecting development data during testing', 'It\'s required by Vercel', 'To save money'],
          correctIndex: 1,
          explanation: 'Separate databases prevent development work from corrupting production data and vice versa.',
          order: 2
        },
        {
          question: 'What happens to Stripe webhooks when you deploy to a new domain?',
          options: ['They stop working automatically', 'They need to be updated in Stripe dashboard', 'Vercel updates them automatically', 'Nothing, they still work'],
          correctIndex: 1,
          explanation: 'Webhook endpoints are tied to specific URLs. When you change domains, you must update the webhook URL in Stripe dashboard.',
          order: 3
        }
      ]
    }
  ]

  // Create questions for each step
  for (const stepData of quizData) {
    const step = project.steps.find(s => s.order === stepData.stepOrder)
    if (!step) {
      console.log(`??  Step ${stepData.stepOrder} not found, skipping...`)
      continue
    }

    console.log(`\n?? Adding ${stepData.questions.length} questions for Step ${step.order}: ${step.title}`)

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
      console.log(`  ? Question ${q.order}: ${q.question.substring(0, 50)}...`)
    }
  }

  console.log('\n?? Quiz seeding complete!')
}

seedQuizQuestions()
  .catch((e) => {
    console.error('Error seeding quiz questions:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

