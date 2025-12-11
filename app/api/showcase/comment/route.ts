// app/api/showcase/comment/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { showcaseId, content } = await req.json()

    if (!showcaseId || !content) {
      return NextResponse.json({ error: 'showcaseId and content required' }, { status: 400 })
    }

    const comment = await prisma.showcaseComment.create({
      data: {
        showcaseId,
        userId: session.user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}