// app/api/replies/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { NextRequest, NextResponse } from 'next/server'

// POST - Add reply to question
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { questionId, content } = await req.json()

    if (!questionId || !content) {
      return NextResponse.json({ error: 'questionId and content required' }, { status: 400 })
    }

    const reply = await prisma.reply.create({
      data: {
        questionId,
        userId: session.user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        }
      }
    })

    // Mark question as answered
    await prisma.question.update({
      where: { id: questionId },
      data: { isAnswered: true }
    })

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }
}