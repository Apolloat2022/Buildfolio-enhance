import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import { createElement } from 'react'
import ResumePDF from '@/components/ResumePDF'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const startedProjects = await prisma.startedProject.findMany({
      where: {
        userId: session.user.id,
        status: 'completed',
      },
      include: {
        projectTemplate: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    const completedProjects = startedProjects.map((sp) => ({
      id: sp.id,
      title: sp.projectTemplate.title,
      description: sp.projectTemplate.description,
      technologies: sp.projectTemplate.technologies,
      completedAt: sp.completedAt || new Date(),
      difficulty: sp.projectTemplate.difficulty,
      timeEstimate: sp.projectTemplate.timeEstimate,
    }))

    const allTechnologies = new Set<string>()
    let totalHours = 0

    completedProjects.forEach((project) => {
      project.technologies.forEach((tech: string) => allTechnologies.add(tech))
      if (project.timeEstimate) {
        const match = project.timeEstimate.match(/(\d+)-(\d+)/)
        if (match) {
          totalHours += (parseInt(match[1]) + parseInt(match[2])) / 2
        }
      }
    })

    const resumeData = {
      user: {
        name: session.user.name,
        email: session.user.email,
      },
      completedProjects,
      stats: {
        totalProjects: completedProjects.length,
        totalHours: Math.round(totalHours),
        technologiesLearned: Array.from(allTechnologies),
      },
    }

    // Use createElement instead of JSX
    const pdfElement = createElement(ResumePDF, { data: resumeData })
    const stream = await renderToStream(pdfElement)

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${session.user.name || 'portfolio'}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Resume export error:', error)
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 })
  }
}
