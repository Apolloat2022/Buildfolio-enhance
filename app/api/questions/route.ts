// app/api/questions/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET - List questions for a step
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const stepId = searchParams.get('stepId')

    if (!stepId) {
      return NextResponse.json({ error: 'stepId required' }, { status: 400 })
    }

    const questions = await prisma.question.findMany({
      where: { stepId },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        },
        replies: {
          include: {
            user: {
              select: { name: true, email: true, image: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: [
        { isAnswered: 'desc' },
        { upvotes: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST - Create new question
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stepId, question } = await req.json()

    if (!stepId || !question) {
      return NextResponse.json({ error: 'stepId and question required' }, { status: 400 })
    }

    const newQuestion = await prisma.question.create({
      data: {
        stepId,
        userId: session.user.id,
        question: question.trim()
      },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        }
      }
    })

    return NextResponse.json({ question: newQuestion })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}