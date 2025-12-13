// app/api/progress/route.ts - FIXED BONUS POINTS BUG
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
    const totalSteps = startedProject.projectTemplate.steps.length
    let newCompleted: string[]
    let pointsAwarded = 0
    let streakData = null

    // Store old progress to check for completion
    const oldProgress = Math.round((currentCompleted.length / totalSteps) * 100)

    if (action === 'complete' && !currentCompleted.includes(stepId)) {
      newCompleted = [...currentCompleted, stepId]
      pointsAwarded = 50
      
      await awardPoints(session.user.id, pointsAwarded, 'Completed tutorial step')
      streakData = await updateUserStreak(session.user.id)
      
      // Calculate new progress
      const newProgress = Math.round((newCompleted.length / totalSteps) * 100)
      
      // Award bonus ONLY when going from incomplete to complete (100%)
      if (oldProgress < 100 && newProgress === 100) {
        await awardPoints(session.user.id, 500, 'Completed full project!')
        pointsAwarded += 500
      
        
        // Auto-enable certificate at 100% completion
        await prisma.startedProject.update({
          where: {
            userId_projectTemplateId: {
              userId: session.user.id,
              projectTemplateId: projectId
            }
          },
          data: {
            certificateEligible: true,
            certificateIssuedAt: new Date()
          }
        })}
    } else if (action === 'incomplete') {
      newCompleted = currentCompleted.filter(id => id !== stepId)
      // No points for marking incomplete
    } else {
      newCompleted = currentCompleted
    }

    const newProgress = Math.round((newCompleted.length / totalSteps) * 100)

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
        completedAt: newProgress === 100 ? new Date() : null
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
