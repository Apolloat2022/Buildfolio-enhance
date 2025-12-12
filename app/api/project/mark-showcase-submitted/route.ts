import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, showcaseId } = await req.json()

    // Update StartedProject to mark showcase as submitted
    const startedProject = await prisma.startedProject.findFirst({
      where: {
        userId: session.user.id,
        projectTemplateId: projectId
      }
    })

    if (!startedProject) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    await prisma.startedProject.update({
      where: { id: startedProject.id },
      data: {
        showcaseSubmitted: true,
        showcaseId: showcaseId
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Showcase submitted! Pending admin approval.',
      status: 'pending_approval'
    })

  } catch (error) {
    console.error('Mark showcase error:', error)
    return NextResponse.json({ 
      error: 'Failed to mark showcase as submitted' 
    }, { status: 500 })
  }
}
