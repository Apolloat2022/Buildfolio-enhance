import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, githubUrl } = await req.json()

    if (!projectId || !githubUrl) {
      return NextResponse.json({ 
        error: 'Project ID and GitHub URL are required' 
      }, { status: 400 })
    }

    // Update the StartedProject with GitHub URL
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

    // Update with GitHub URL and validation timestamp
    await prisma.startedProject.update({
      where: { id: startedProject.id },
      data: {
        githubRepoUrl: githubUrl,
        repoValidatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'GitHub repository submitted successfully',
      nextStep: 'showcase'
    })

  } catch (error) {
    console.error('Submit repo error:', error)
    return NextResponse.json({ 
      error: 'Failed to submit repository' 
    }, { status: 500 })
  }
}
