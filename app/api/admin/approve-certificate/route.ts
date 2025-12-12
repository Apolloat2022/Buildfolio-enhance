import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add proper admin role check here
    // For now, any logged-in user can approve (you'll want to restrict this)

    const { startedProjectId, approved, notes } = await req.json()

    if (!startedProjectId || approved === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Get the started project
    const startedProject = await prisma.startedProject.findUnique({
      where: { id: startedProjectId },
      include: { 
        user: true,
        projectTemplate: true 
      }
    })

    if (!startedProject) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    // Update the project with admin decision
    await prisma.startedProject.update({
      where: { id: startedProjectId },
      data: {
        adminReviewed: true,
        adminApprovedAt: approved ? new Date() : null,
        adminApprovedBy: session.user.email,
        adminNotes: notes || null,
        certificateEligible: approved,
        certificateIssuedAt: approved ? new Date() : null,
        status: approved ? 'completed' : 'in-progress' // Reset to in-progress if rejected
      }
    })

    // TODO: Send email notification to user
    // For now, just log it
    console.log(`Certificate ${approved ? 'APPROVED' : 'REJECTED'} for user ${startedProject.user.email}`)
    if (notes) {
      console.log(`Admin notes: ${notes}`)
    }

    return NextResponse.json({
      success: true,
      message: approved 
        ? 'Certificate approved! User can now download it.' 
        : 'Submission rejected. User has been notified.',
      approved
    })

  } catch (error) {
    console.error('Approve certificate error:', error)
    return NextResponse.json({ 
      error: 'Failed to process approval' 
    }, { status: 500 })
  }
}
