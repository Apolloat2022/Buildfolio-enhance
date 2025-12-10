// app/api/seed-ecommerce/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if project exists
    const existingProject = await prisma.projectTemplate.findUnique({
      where: { slug: 'ecommerce-store' },
      include: { steps: true }
    })

    let projectId: string

    if (!existingProject) {
      const newProject = await prisma.projectTemplate.create({
        data: {
          slug: 'ecommerce-store',
          title: 'Build an E-commerce Store',
          description: 'Create a full-stack e-commerce platform with product listings, shopping cart, and checkout functionality.',
          difficulty: 'intermediate',
          timeEstimate: '25-30 hours',
          technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
          resumeImpact: 5,
          category: 'Full-Stack'
        }
      })
      projectId = newProject.id
    } else {
      projectId = existingProject.id
    }

    // Delete existing steps to avoid duplicates
    await prisma.step.deleteMany({
      where: { projectTemplateId: projectId }
    })

    // Create tutorial steps one by one
    const stepData = [
      {
        projectTemplateId: projectId,
        order: 1,
        title: 'Project Setup & Database Schema',
        description: 'Initialize your Next.js project and set up the database schema for products, users, and orders.',
        estimatedTime: '2-3 hours',
        codeSnippets: {
          snippets: [
            {
              language: 'bash',
              code: 'npx create-next-app@latest ecommerce-store\ncd ecommerce-store\nnpm install @prisma/client stripe'
            },
            {
              language: 'prisma',
              code: 'model Product {\n  id          String   @id @default(cuid())\n  name        String\n  description String\n  price       Decimal  @db.Decimal(10, 2)\n  imageUrl    String\n  stock       Int\n  category    String\n}'
            }
          ]
        },
        pitfalls: ['Make sure to add your DATABASE_URL to .env file', 'Run npx prisma generate after creating your schema']
      },
      {
        projectTemplateId: projectId,
        order: 2,
        title: 'Product Catalog Page',
        description: 'Build a responsive product grid that fetches and displays products from your database.',
        estimatedTime: '3-4 hours',
        codeSnippets: {
          snippets: [
            {
              language: 'typescript',
              code: 'export default async function ProductsPage() {\n  const products = await prisma.product.findMany()\n  return (\n    <div className="grid grid-cols-3 gap-6">\n      {products.map(p => <ProductCard key={p.id} product={p} />)}\n    </div>\n  )\n}'
            }
          ]
        },
        pitfalls: ['Remember to handle loading states', 'Add error boundaries for failed queries']
      },
      {
        projectTemplateId: projectId,
        order: 3,
        title: 'Shopping Cart Functionality',
        description: 'Implement add-to-cart functionality with state management and local storage persistence.',
        estimatedTime: '4-5 hours',
        codeSnippets: {
          snippets: [
            {
              language: 'typescript',
              code: 'import { create } from "zustand"\n\ninterface CartStore {\n  items: CartItem[]\n  addItem: (item: CartItem) => void\n  removeItem: (id: string) => void\n}\n\nexport const useCart = create<CartStore>((set) => ({\n  items: [],\n  addItem: (item) => set((state) => ({ items: [...state.items, item] })),\n  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) }))\n}))'
            }
          ]
        },
        pitfalls: ['Use zustand or Context API for cart state', 'Persist cart to localStorage']
      },
      {
        projectTemplateId: projectId,
        order: 4,
        title: 'Stripe Payment Integration',
        description: 'Set up Stripe for secure payment processing with checkout sessions.',
        estimatedTime: '5-6 hours',
        codeSnippets: {
          snippets: [
            {
              language: 'typescript',
              code: 'import Stripe from "stripe"\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)\n\nexport async function POST(req: NextRequest) {\n  const { items } = await req.json()\n  const session = await stripe.checkout.sessions.create({\n    line_items: items,\n    mode: "payment",\n    success_url: `${origin}/success`,\n    cancel_url: `${origin}/cart`\n  })\n  return NextResponse.json({ sessionId: session.id })\n}'
            }
          ]
        },
        pitfalls: ['Never expose Stripe secret key in client code', 'Test with Stripe test cards first']
      },
      {
        projectTemplateId: projectId,
        order: 5,
        title: 'Order Management & Admin Dashboard',
        description: 'Create an admin panel to manage products and view orders.',
        estimatedTime: '6-7 hours',
        codeSnippets: {
          snippets: [
            {
              language: 'typescript',
              code: 'export default async function AdminOrdersPage() {\n  const orders = await prisma.order.findMany({\n    include: { user: true, items: { include: { product: true } } }\n  })\n  return <OrdersTable orders={orders} />\n}'
            }
          ]
        },
        pitfalls: ['Add authentication middleware to protect admin routes', 'Implement role-based access control']
      },
      {
        projectTemplateId: projectId,
        order: 6,
        title: 'Search & Filtering',
        description: 'Add search functionality and category filters to improve user experience.',
        estimatedTime: '3-4 hours',
        codeSnippets: {
          snippets: [
            {
              language: 'typescript',
              code: 'const products = await prisma.product.findMany({\n  where: {\n    AND: [\n      searchQuery ? {\n        OR: [\n          { name: { contains: searchQuery, mode: "insensitive" } },\n          { description: { contains: searchQuery, mode: "insensitive" } }\n        ]\n      } : {},\n      category ? { category } : {}\n    ]\n  }\n})'
            }
          ]
        },
        pitfalls: ['Use URL search params for filters', 'Add debouncing to search input']
      },
      {
        projectTemplateId: projectId,
        order: 7,
        title: 'Deployment & Production Optimization',
        description: 'Deploy to Vercel and optimize for production with caching and CDN.',
        estimatedTime: '2-3 hours',
        codeSnippets: {
          snippets: [
            {
              language: 'bash',
              code: '# Deploy to Vercel\nvercel --prod\n\n# Set environment variables\nvercel env add DATABASE_URL\nvercel env add STRIPE_SECRET_KEY\nvercel env add NEXTAUTH_SECRET'
            }
          ]
        },
        pitfalls: ['Set up database connection pooling', 'Enable Next.js caching for product pages']
      }
    ]

    // Create steps
    const createdSteps = []
    for (const step of stepData) {
      const created = await prisma.step.create({ data: step })
      createdSteps.push(created)
    }

    return NextResponse.json({
      success: true,
      message: '✅ E-commerce tutorial seeded successfully!',
      projectId: projectId,
      slug: 'ecommerce-store',
      stepsCreated: createdSteps.length,
      steps: createdSteps.map(s => ({ order: s.order, title: s.title }))
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}