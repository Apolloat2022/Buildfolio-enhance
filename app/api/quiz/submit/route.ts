import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stepId, answers, score, timeSpent } = await req.json()

    // Get existing attempts for this step
    const existingAttempts = await prisma.quizAttempt.count({
      where: {
        userId: session.user.id,
        stepId: stepId
      }
    })

    // Create quiz attempt record
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        stepId: stepId,
        answers: answers,
        score: score,
        passed: score >= 80,
        timeSpentSeconds: timeSpent || 0,
        attemptNumber: existingAttempts + 1
      }
    })

    return NextResponse.json({
      success: true,
      passed: score >= 80,
      attemptNumber: attempt.attemptNumber,
      score: score
    })

  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json({ 
      error: 'Failed to submit quiz' 
    }, { status: 500 })
  }
}
