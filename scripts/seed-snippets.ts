// scripts/seed-snippets.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing snippets first
  await prisma.snippet.deleteMany()
  console.log('🧹 Cleared existing snippets')

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
}

const decrement = () => {
  setCount(prev => prev - 1)
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
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch:', error)
    }
  }
  
  fetchData()
}, [])`,
      language: 'typescript',
      category: 'React Hooks',
      tags: ['react', 'hooks', 'fetch', 'useEffect']
    },
    {
      title: 'Tailwind Card Component',
      description: 'Reusable card component with Tailwind',
      code: `<div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h3 className="text-xl font-bold mb-2">{title}</h3>
  <p className="text-gray-600">{description}</p>
  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Learn More
  </button>
</div>`,
      language: 'tsx',
      category: 'UI Components',
      tags: ['tailwind', 'component', 'card']
    },
    {
      title: 'Protected API Route',
      description: 'Check authentication before processing',
      code: `import { auth } from '@/app/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Your protected logic here
  return NextResponse.json({ success: true })
}`,
      language: 'typescript',
      category: 'Authentication',
      tags: ['nextauth', 'auth', 'protected']
    },
    {
      title: 'Form with Validation',
      description: 'Client-side form with basic validation',
      code: `const [formData, setFormData] = useState({ email: '', password: '' })
const [errors, setErrors] = useState({})

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  
  const newErrors: any = {}
  if (!formData.email) newErrors.email = 'Email required'
  if (!formData.password) newErrors.password = 'Password required'
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }
  
  // Submit form
}`,
      language: 'typescript',
      category: 'Forms',
      tags: ['react', 'form', 'validation']
    },
    {
      title: 'Debounced Search Input',
      description: 'Search input with debounce to reduce API calls',
      code: `const [searchQuery, setSearchQuery] = useState('')
const [debouncedQuery, setDebouncedQuery] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery)
  }, 500)
  
  return () => clearTimeout(timer)
}, [searchQuery])

useEffect(() => {
  if (debouncedQuery) {
    // Fetch search results
    fetchResults(debouncedQuery)
  }
}, [debouncedQuery])`,
      language: 'typescript',
      category: 'React Hooks',
      tags: ['react', 'debounce', 'search']
    },
    {
      title: 'Stripe Checkout Session',
      description: 'Create a Stripe checkout session',
      code: `import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'Product Name' },
      unit_amount: 2000, // $20.00
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: \`\${origin}/success\`,
  cancel_url: \`\${origin}/cancel\`,
})`,
      language: 'typescript',
      category: 'Payments',
      tags: ['stripe', 'payment', 'checkout']
    },
    {
      title: 'Loading Skeleton',
      description: 'Animated loading placeholder',
      code: `<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>`,
      language: 'tsx',
      category: 'UI Components',
      tags: ['loading', 'skeleton', 'tailwind']
    }
  ]

  await prisma.snippet.createMany({
    data: snippets
  })

  console.log('✅ Seeded 10 code snippets!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())