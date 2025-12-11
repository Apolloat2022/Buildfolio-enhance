// app/api/seed-snippets/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Delete existing snippets
    await prisma.snippet.deleteMany()

    const snippets = [
      {
        title: 'Next.js API Route (TypeScript)',
        description: 'Basic Next.js API route with TypeScript',
        code: `import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true, data: [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}`,
        language: 'typescript',
        category: 'API Routes',
        tags: ['nextjs', 'api', 'typescript']
      },
      {
        title: 'Prisma Query with Relations',
        description: 'Fetch data with nested relations',
        code: `const data = await prisma.user.findMany({
  include: {
    posts: {
      include: {
        comments: true
      }
    }
  },
  orderBy: { createdAt: 'desc' }
})`,
        language: 'typescript',
        category: 'Database',
        tags: ['prisma', 'database', 'query']
      },
      {
        title: 'React useState Hook',
        description: 'Basic state management with useState',
        code: `const [count, setCount] = useState(0)

const increment = () => {
  setCount(prev => prev + 1)
}`,
        language: 'typescript',
        category: 'React Hooks',
        tags: ['react', 'hooks', 'state']
      },
      {
        title: 'Fetch Data with useEffect',
        description: 'Fetch data when component mounts',
        code: `useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data')
    const data = await response.json()
    setData(data)
  }
  fetchData()
}, [])`,
        language: 'typescript',
        category: 'React Hooks',
        tags: ['react', 'hooks', 'fetch']
      },
      {
        title: 'Tailwind Card Component',
        description: 'Reusable card component',
        code: `<div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl">
  <h3 className="text-xl font-bold mb-2">{title}</h3>
  <p className="text-gray-600">{description}</p>
</div>`,
        language: 'tsx',
        category: 'UI Components',
        tags: ['tailwind', 'component']
      },
      {
        title: 'Protected API Route',
        description: 'Check authentication',
        code: `import { auth } from '@/app/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ success: true })
}`,
        language: 'typescript',
        category: 'Authentication',
        tags: ['nextauth', 'auth']
      },
      {
        title: 'Form with Validation',
        description: 'Client-side form validation',
        code: `const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const errors: any = {}
  if (!email) errors.email = 'Required'
  if (Object.keys(errors).length > 0) {
    setErrors(errors)
    return
  }
  // Submit
}`,
        language: 'typescript',
        category: 'Forms',
        tags: ['react', 'form', 'validation']
      },
      {
        title: 'Debounced Search',
        description: 'Search with debounce',
        code: `useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery)
  }, 500)
  return () => clearTimeout(timer)
}, [searchQuery])`,
        language: 'typescript',
        category: 'React Hooks',
        tags: ['react', 'debounce']
      },
      {
        title: 'Stripe Checkout',
        description: 'Create checkout session',
        code: `const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'Product' },
      unit_amount: 2000,
    },
    quantity: 1,
  }],
  mode: 'payment',
})`,
        language: 'typescript',
        category: 'Payments',
        tags: ['stripe', 'payment']
      },
      {
        title: 'Loading Skeleton',
        description: 'Animated loading placeholder',
        code: `<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded"></div>
</div>`,
        language: 'tsx',
        category: 'UI Components',
        tags: ['loading', 'tailwind']
      }
    ]

    await prisma.snippet.createMany({ data: snippets })

    return NextResponse.json({
      success: true,
      message: '✅ Seeded 10 code snippets!',
      count: snippets.length
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}