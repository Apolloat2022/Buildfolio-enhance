// app/api/quiz/submit/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stepId, answers, score, passed } = body

    if (!stepId || !answers || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        stepId,
        answers,
        score,
        passed,
        timeSpentSeconds: 300, // Default 5 minutes
        attemptNumber: 1
      }
    })

    // Award points for passing quiz
    if (passed) {
      // Award 50 points for passing a quiz
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalPoints: { increment: 50 }
        }
      })
    }

    return NextResponse.json({
      success: true,
      quizAttempt,
      pointsAwarded: passed ? 50 : 0
    })

  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}

