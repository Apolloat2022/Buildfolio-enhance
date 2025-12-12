import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🎓 Seeding quiz questions...')

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

  const quizData = [
    // Step 1
    {
      stepOrder: 1,
      questions: [
        {
          question: 'What command creates a new Next.js project?',
          options: ['npm create next-app', 'npx create-next-app', 'npm install next', 'next init'],
          correctIndex: 1,
          explanation: 'npx runs packages without installing globally and ensures you get the latest version.',
          order: 1
        },
        {
          question: 'Why use Decimal type for prices in Prisma?',
          options: ['Faster than Number', 'Less storage', 'Prevents floating-point errors', 'Required by Stripe'],
          correctIndex: 2,
          explanation: 'Decimal prevents issues like 0.1 + 0.2 = 0.30000000000000004 which breaks money calculations.',
          order: 2
        },
        {
          question: 'What does "npx prisma generate" do?',
          options: ['Creates database', 'Generates TypeScript types', 'Runs migrations', 'Starts Prisma Studio'],
          correctIndex: 1,
          explanation: 'Generates Prisma Client with TypeScript types for type-safe queries.',
          order: 3
        }
      ]
    },
    // Step 2
    {
      stepOrder: 2,
      questions: [
        {
          question: 'Why use Server Components for fetching products?',
          options: ['Faster client rendering', 'Better SEO and load time', 'Easier state management', 'Automatic caching'],
          correctIndex: 1,
          explanation: 'Server Components fetch on server, improving SEO and initial load performance.',
          order: 1
        },
        {
          question: 'Why use Next.js Image instead of <img>?',
          options: ['Required by Next.js', 'Automatic optimization', 'Better compatibility', 'Faster development'],
          correctIndex: 1,
          explanation: 'Image component optimizes, lazy loads, and serves right size/format.',
          order: 2
        }
      ]
    },
    // Step 3
    {
      stepOrder: 3,
      questions: [
        {
          question: 'Why use Zustand over React Context?',
          options: ['Required by Next.js', 'Better performance', 'Works with TypeScript', 'Free to use'],
          correctIndex: 1,
          explanation: 'Zustand provides better performance and simpler API than Context.',
          order: 1
        },
        {
          question: 'What does persist middleware do?',
          options: ['Makes state immutable', 'Saves to localStorage', 'Improves performance', 'Time travel debugging'],
          correctIndex: 1,
          explanation: 'Persist saves store to localStorage and rehydrates on load.',
          order: 2
        }
      ]
    },
    // Step 4
    {
      stepOrder: 4,
      questions: [
        {
          question: 'Why multiply prices by 100 for Stripe?',
          options: ['Add tax', 'Stripe uses cents', 'Better precision', 'Stripe requirement'],
          correctIndex: 1,
          explanation: 'Stripe expects smallest currency unit. $10.00 = 1000 cents.',
          order: 1
        },
        {
          question: 'Why verify webhook signatures?',
          options: ['Improve performance', 'Prevent fake notifications', 'Enable refunds', 'Track analytics'],
          correctIndex: 1,
          explanation: 'Verification ensures webhooks are from Stripe and not tampered.',
          order: 2
        }
      ]
    },
    // Step 5
    {
      stepOrder: 5,
      questions: [
        {
          question: 'How to protect admin routes?',
          options: ['Use middleware', 'Hide the link', 'Use CSS', 'Trust users'],
          correctIndex: 0,
          explanation: 'Middleware checks before page loads. Never rely on client-side hiding.',
          order: 1
        }
      ]
    },
    // Step 6
    {
      stepOrder: 6,
      questions: [
        {
          question: 'What is debouncing in search?',
          options: ['Caching results', 'Delay until typing stops', 'Sort by relevance', 'Filter duplicates'],
          correctIndex: 1,
          explanation: 'Debouncing waits for pause before searching, reducing API calls.',
          order: 1
        }
      ]
    },
    // Step 7
    {
      stepOrder: 7,
      questions: [
        {
          question: 'What must you do before deploying?',
          options: ['Delete node_modules', 'Set env vars in Vercel', 'Upgrade to Pro', 'Run npm audit'],
          correctIndex: 1,
          explanation: 'Environment variables must be added to Vercel dashboard.',
          order: 1
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

  console.log(`\n🎉 Created ${total} quiz questions!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
