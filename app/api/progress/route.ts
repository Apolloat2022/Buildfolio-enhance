// app/api/progress/route.ts - UPDATED WITH STREAK INFO
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { NextRequest, NextResponse } from 'next/server'
import { updateUserStreak, awardPoints } from '@/lib/gamification'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stepId, projectId, action } = await req.json()

    // Find or create started project
    let startedProject = await prisma.startedProject.findUnique({
      where: {
        userId_projectTemplateId: {
          userId: session.user.id,
          projectTemplateId: projectId
        }
      },
      include: {
        projectTemplate: {
          include: { steps: true }
        }
      }
    })

    if (!startedProject) {
      startedProject = await prisma.startedProject.create({
        data: {
          userId: session.user.id,
          projectTemplateId: projectId,
          status: 'in-progress'
        },
        include: {
          projectTemplate: {
            include: { steps: true }
          }
        }
      })
    }

    const currentCompleted = startedProject.completedSteps || []
    let newCompleted: string[]
    let pointsAwarded = 0
    let streakData = null

    if (action === 'complete' && !currentCompleted.includes(stepId)) {
      newCompleted = [...currentCompleted, stepId]
      pointsAwarded = 50
      
      // Award points and update streak
      await awardPoints(session.user.id, pointsAwarded, 'Completed tutorial step')
      streakData = await updateUserStreak(session.user.id)
    } else if (action === 'incomplete') {
      newCompleted = currentCompleted.filter(id => id !== stepId)
    } else {
      newCompleted = currentCompleted
    }

    const totalSteps = startedProject.projectTemplate.steps.length
    const newProgress = Math.round((newCompleted.length / totalSteps) * 100)

    // Check if project just completed
    const wasComplete = startedProject.progress === 100
    const isNowComplete = newProgress === 100
    
    if (isNowComplete && !wasComplete) {
      await awardPoints(session.user.id, 500, 'Completed full project!')
      pointsAwarded += 500
    }

    await prisma.startedProject.update({
      where: {
        userId_projectTemplateId: {
          userId: session.user.id,
          projectTemplateId: projectId
        }
      },
      data: {
        completedSteps: newCompleted,
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : 'in-progress',
        lastWorkedOn: new Date(),
        completedAt: isNowComplete ? new Date() : null
      }
    })

    return NextResponse.json({ 
      success: true, 
      progress: newProgress,
      pointsAwarded,
      newStreak: streakData?.currentStreak,
      streakUpdated: !!streakData
    })

  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}