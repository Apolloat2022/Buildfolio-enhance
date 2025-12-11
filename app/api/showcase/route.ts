// app/api/showcase/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all showcases
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured') === 'true'
    const userId = searchParams.get('userId')

    const where: any = {}
    if (featured) where.featured = true
    if (userId) where.userId = userId

    const showcases = await prisma.showcase.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true, image: true }
        },
        comments: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { likes: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ showcases })
  } catch (error) {
    console.error('Error fetching showcases:', error)
    return NextResponse.json({ error: 'Failed to fetch showcases' }, { status: 500 })
  }
}

// POST - Create new showcase
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectSlug, title, description, imageUrl, githubUrl, liveUrl, tags } = await req.json()

    if (!projectSlug || !title) {
      return NextResponse.json({ error: 'projectSlug and title required' }, { status: 400 })
    }

    const showcase = await prisma.showcase.create({
      data: {
        userId: session.user.id,
        projectSlug,
        title,
        description,
        imageUrl,
        githubUrl,
        liveUrl,
        tags: tags || []
      },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        }
      }
    })

    return NextResponse.json({ showcase })
  } catch (error) {
    console.error('Error creating showcase:', error)
    return NextResponse.json({ error: 'Failed to create showcase' }, { status: 500 })
  }
}