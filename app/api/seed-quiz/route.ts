import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const existingCount = await prisma.quizQuestion.count()
    if (existingCount >= 30) {
      return NextResponse.json({ message: 'Quiz questions already seeded', count: existingCount })
    }

    const ecommerceProject = await prisma.projectTemplate.findUnique({
      where: { slug: 'ecommerce-store' },
      include: { steps: { orderBy: { order: 'asc' } } }
    })

    if (!ecommerceProject) {
      return NextResponse.json({ error: 'E-commerce project not found' }, { status: 404 })
    }

    const questions = [
      { stepOrder: 1, question: 'What command creates a new Next.js project with TypeScript?', options: ['npm create next-app', 'npx create-next-app', 'npm install next', 'next init'], correctIndex: 1, explanation: 'npx runs packages without installing globally.', order: 1 },
      { stepOrder: 1, question: 'Why use Decimal type instead of Float for prices?', options: ['Faster queries', 'Less storage', 'Prevents floating-point errors', 'Required by Stripe'], correctIndex: 2, explanation: 'Prevents 0.1 + 0.2 = 0.30000000004 issues.', order: 2 },
      { stepOrder: 1, question: 'What does npx prisma generate do?', options: ['Creates database', 'Generates TypeScript types', 'Runs migrations', 'Starts Studio'], correctIndex: 1, explanation: 'Generates Prisma Client with types.', order: 3 },
      { stepOrder: 1, question: 'Where should DATABASE_URL be stored?', options: ['package.json', '.env file', 'public folder', 'schema.prisma'], correctIndex: 1, explanation: '.env keeps secrets out of git.', order: 4 },
      { stepOrder: 1, question: 'What does @db.Decimal(10, 2) mean?', options: ['10 decimals, 2 integers', '10 total digits, 2 after decimal', '10 bytes, 2 precision', '10 max, 2 min'], correctIndex: 1, explanation: '10 total digits, 2 decimal places.', order: 5 },
      
      { stepOrder: 2, question: 'Why use Server Components for data fetching?', options: ['Faster client', 'Better SEO and load time', 'Easier state', 'Caching only'], correctIndex: 1, explanation: 'Server Components improve SEO and initial load.', order: 1 },
      { stepOrder: 2, question: 'What Prisma method fetches all products?', options: ['find()', 'getAll()', 'findMany()', 'fetchAll()'], correctIndex: 2, explanation: 'findMany() retrieves multiple records.', order: 2 },
      { stepOrder: 2, question: 'Why use Next.js Image vs img?', options: ['Required', 'Auto optimization and lazy loading', 'Browser compatibility', 'Faster dev'], correctIndex: 1, explanation: 'Automatic optimization and lazy loading.', order: 3 },
      { stepOrder: 2, question: 'What does priority prop do?', options: ['Loads first', 'Disables lazy loading', 'Increases quality', 'Preloads all'], correctIndex: 1, explanation: 'For above-fold images, prevents LCP issues.', order: 4 },
      { stepOrder: 2, question: 'How handle empty product lists?', options: ['Show error', 'Conditional rendering with message', 'Redirect', 'Crash'], correctIndex: 1, explanation: 'Handle edge cases gracefully.', order: 5 },
      
      { stepOrder: 3, question: 'Why Zustand over Context?', options: ['Required', 'Better performance and API', 'TypeScript only', 'Free'], correctIndex: 1, explanation: 'Simpler API, better performance.', order: 1 },
      { stepOrder: 3, question: 'What does persist middleware do?', options: ['Immutable state', 'Saves to localStorage', 'Performance', 'Time travel'], correctIndex: 1, explanation: 'Persists to localStorage.', order: 2 },
      { stepOrder: 3, question: 'Why validate cart before checkout?', options: ['Performance', 'Prevent out-of-stock purchases', 'Required by Stripe', 'UX only'], correctIndex: 1, explanation: 'Verify availability server-side.', order: 3 },
      { stepOrder: 3, question: 'What if no quantity limits?', options: ['Nothing', 'Could order more than stock', 'Faster', 'Better performance'], correctIndex: 1, explanation: 'Enforce limits to prevent overselling.', order: 4 },
      { stepOrder: 3, question: 'How calculate cart total?', options: ['Client only', 'Server-side verification', 'Trust user', 'Cookies'], correctIndex: 1, explanation: 'Never trust client calculations for money.', order: 5 },
      
      { stepOrder: 4, question: 'Why multiply prices by 100 for Stripe?', options: ['Tax', 'Uses smallest currency unit', 'Precision', 'API requirement'], correctIndex: 1, explanation: 'Stripe uses cents. $10 = 1000.', order: 1 },
      { stepOrder: 4, question: 'Why verify webhook signatures?', options: ['Performance', 'Prevent fake notifications', 'Refunds', 'Analytics'], correctIndex: 1, explanation: 'Ensures webhooks are from Stripe.', order: 2 },
      { stepOrder: 4, question: 'Where store Stripe secret keys?', options: ['Client', 'Server environment variables', 'Public', 'Git'], correctIndex: 1, explanation: 'Never expose secrets client-side.', order: 3 },
      { stepOrder: 4, question: 'What is idempotency?', options: ['Fast payments', 'Preventing duplicate charges', 'Refunds', 'Validation'], correctIndex: 1, explanation: 'Prevents duplicate processing.', order: 4 },
      { stepOrder: 4, question: 'When capture payment?', options: ['Immediately', 'After fulfillment verification', 'Before stock check', 'Never'], correctIndex: 1, explanation: 'Authorize first, capture after verification.', order: 5 },
      
      { stepOrder: 5, question: 'How protect admin routes?', options: ['Middleware to check auth', 'Hide nav link', 'CSS', 'Trust users'], correctIndex: 0, explanation: 'Middleware runs before page loads.', order: 1 },
      { stepOrder: 5, question: 'What Prisma method calculates revenue?', options: ['sum()', 'aggregate()', 'calculate()', 'total()'], correctIndex: 1, explanation: 'aggregate() computes SUM, AVG, etc.', order: 2 },
      { stepOrder: 5, question: 'Why is RBAC important?', options: ['Faster', 'Prevent unauthorized actions', 'SEO', 'Performance'], correctIndex: 1, explanation: 'Users can only do authorized actions.', order: 3 },
      { stepOrder: 5, question: 'What validate in admin forms?', options: ['Client only', 'Server only', 'Both client and server', 'Neither'], correctIndex: 2, explanation: 'Client for UX, server for security.', order: 4 },
      { stepOrder: 5, question: 'How prevent SQL injection with Prisma?', options: ['Manual escaping', 'Prisma prevents it automatically', 'Raw queries', 'Validate input'], correctIndex: 1, explanation: 'Prisma uses parameterized queries.', order: 5 },
      
      { stepOrder: 6, question: 'What is debouncing?', options: ['Caching', 'Delaying calls until typing stops', 'Sorting', 'Filtering'], correctIndex: 1, explanation: 'Waits for pause to reduce API calls.', order: 1 },
      { stepOrder: 6, question: 'Why store search params in URL?', options: ['Faster', 'Shareable links and navigation', 'SEO only', 'Required'], correctIndex: 1, explanation: 'Makes searches shareable and SEO-friendly.', order: 2 },
      { stepOrder: 6, question: 'What does mode: insensitive do?', options: ['Faster', 'Case-insensitive search', 'Exact match', 'Regex'], correctIndex: 1, explanation: 'Makes search case-insensitive.', order: 3 },
      { stepOrder: 6, question: 'How combine filters in Prisma?', options: ['OR', 'AND', 'Both AND/OR', 'Chain'], correctIndex: 2, explanation: 'Prisma supports AND, OR, NOT.', order: 4 },
      { stepOrder: 6, question: 'Why paginate results?', options: ['SEO', 'Prevent loading thousands', 'Required', 'Faster DB'], correctIndex: 1, explanation: 'Prevents performance issues.', order: 5 },
      
      { stepOrder: 7, question: 'What before deploying?', options: ['Delete node_modules', 'Set env vars in Vercel', 'Upgrade Pro', 'npm audit'], correctIndex: 1, explanation: 'Configure environment variables.', order: 1 },
      { stepOrder: 7, question: 'Why separate production database?', options: ['Faster', 'Prevent dev changes affecting prod', 'Required', 'Security only'], correctIndex: 1, explanation: 'Prevents accidental data loss.', order: 2 },
      { stepOrder: 7, question: 'What if forget webhook URL update?', options: ['Nothing', 'Webhooks fail, no payments', 'Slower', 'SEO issues'], correctIndex: 1, explanation: 'Webhooks go to old URL.', order: 3 },
      { stepOrder: 7, question: 'Why does Vercel run build?', options: ['Check errors', 'Create optimized bundle', 'Install deps', 'Run tests'], correctIndex: 1, explanation: 'Optimizes and catches errors.', order: 4 },
      { stepOrder: 7, question: 'Benefit of edge network?', options: ['Cheaper', 'Faster global loads via CDN', 'More storage', 'Analytics'], correctIndex: 1, explanation: 'Serves from servers near users.', order: 5 }
    ]

    let created = 0
    for (const q of questions) {
      const step = ecommerceProject.steps.find(s => s.order === q.stepOrder)
      if (!step) continue
      
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
      created++
    }

    return NextResponse.json({ success: true, created, total: created })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
