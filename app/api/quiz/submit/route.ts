import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { stepId, answers, score } = data
    const passed = score >= 80

    console.log(`[QUIZ API] Received: stepId=${stepId}, score=${score}, passed=${passed}`)

    // 1. Save quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        stepId,
        answers,
        score,
        passed,
        timeSpentSeconds: 300,
        attemptNumber: 1
      }
    })

    console.log(`[QUIZ API] QuizAttempt created: ${quizAttempt.id}`)

    // 2. Only update progress if passed
    if (passed) {
      console.log('[QUIZ API] Step passed! Updating progress...')
      
      try {
        // Find the step and its project
        const step = await prisma.step.findUnique({
          where: { id: stepId },
          include: { projectTemplate: true }
        })
        
        if (!step?.projectTemplate) {
          console.error('[QUIZ API] Step or project not found')
          throw new Error('Step or project not found')
        }
        
        const project = step.projectTemplate
        const userId = session.user.id
        
        console.log(`[QUIZ API] Found project: ${project.title} (${project.id})`)

        // Ensure StartedProject exists
        const startedProject = await prisma.startedProject.upsert({
          where: {
            userId_projectId: {
              userId,
              projectId: project.id
            }
          },
          update: {},
          create: {
            userId,
            projectId: project.id,
            progress: 0,
            certificateEligible: false
          }
        })
        
        console.log(`[QUIZ API] StartedProject: ${startedProject.id}`)

        // ✅ CORRECT: Calculate completed steps from QuizAttempt table
        // Since there's NO StepCompletion table, we count passed QuizAttempts
        const completedSteps = await prisma.quizAttempt.count({
          where: {
            userId,
            passed: true,
            step: { projectTemplateId: project.id }
          },
          distinct: ['stepId']  // Count unique steps passed
        })
        
        const totalSteps = await prisma.step.count({
          where: { projectTemplateId: project.id }
        })
        
        const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
        console.log(`[QUIZ API] Progress: ${completedSteps}/${totalSteps} = ${newProgress}%`)

        // Update progress
        await prisma.startedProject.update({
          where: { id: startedProject.id },
          data: { progress: newProgress }
        })

        // Award certificate at 100%
        if (newProgress === 100) {
          await prisma.startedProject.update({
            where: { id: startedProject.id },
            data: {
              certificateEligible: true,
              certificateIssuedAt: new Date()
            }
          })
          console.log('[QUIZ API] 🎉 CERTIFICATE AWARDED!')
        }

        // Award points
        await prisma.user.update({
          where: { id: userId },
          data: { totalPoints: { increment: 50 } }
        })
        
        console.log(`[QUIZ API] Awarded 50 points to user`)

      } catch (error) {
        console.error('[QUIZ API] Progress update error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      quizAttempt,
      pointsAwarded: passed ? 50 : 0
    })

  } catch (error) {
    console.error('[QUIZ API] Submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
