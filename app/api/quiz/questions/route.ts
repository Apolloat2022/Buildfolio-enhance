import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const stepId = searchParams.get('stepId')

    if (!stepId) {
      return NextResponse.json({ error: 'Step ID required' }, { status: 400 })
    }

    const questions = await prisma.quizQuestion.findMany({
      where: { stepId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        options: true,
        correctIndex: true,
        explanation: true,
        order: true
      }
    })

    return NextResponse.json({ questions })

  } catch (error) {
    console.error('Fetch questions error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch questions' 
    }, { status: 500 })
  }
}
