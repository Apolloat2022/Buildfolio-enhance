// app/api/quiz/questions/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const stepId = searchParams.get('stepId')

    if (!stepId) {
      return NextResponse.json(
        { error: 'Step ID is required' },
        { status: 400 }
      )
    }

    // Get quiz questions for this step
    const quizQuestions = await prisma.quizQuestion.findMany({
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

    // Format for frontend
    const formattedQuestions = quizQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    }))

    return NextResponse.json({
      questions: formattedQuestions,
      count: formattedQuestions.length
    })

  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    )
  }
}
