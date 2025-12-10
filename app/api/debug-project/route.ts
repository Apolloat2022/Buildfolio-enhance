// app/api/debug-project/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'ecommerce-store'

    const project = await prisma.projectTemplate.findUnique({
      where: { slug },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found',
        slug
      })
    }

    // Check each step's data structure
    const stepAnalysis = project.steps.map(step => ({
      id: step.id,
      order: step.order,
      title: step.title,
      descriptionType: typeof step.description,
      descriptionValue: step.description,
      codeSnippetsType: typeof step.codeSnippets,
      codeSnippetsValue: step.codeSnippets,
      codeSnippetsIsArray: Array.isArray(step.codeSnippets),
      pitfallsType: typeof step.pitfalls,
      pitfallsIsArray: Array.isArray(step.pitfalls),
      pitfallsLength: Array.isArray(step.pitfalls) ? step.pitfalls.length : 'N/A',
      estimatedTime: step.estimatedTime
    }))

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        slug: project.slug,
        title: project.title,
        difficulty: project.difficulty,
        timeEstimate: project.timeEstimate,
        technologies: project.technologies,
        resumeImpact: project.resumeImpact,
        stepCount: project.steps.length
      },
      stepAnalysis,
      rawSteps: project.steps
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}