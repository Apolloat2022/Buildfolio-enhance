// app/api/projects/route.ts - CORRECT VERSION
import { NextRequest } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return Response.json({ projects: [] })
    }

    console.log('[API] Fetching projects for user:', session.user.id)
    
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        tags: true,
        githubUrl: true,
        liveUrl: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    console.log('[API] Found', projects.length, 'projects')
    return Response.json({ projects })
    
  } catch (error: any) {
    console.error('[API] ❌ GET /api/projects error:', error)
    return Response.json({ 
      projects: [], 
      error: 'Failed to fetch projects',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth()
    
    if (!session?.user?.id) {
      console.log('[API] ❌ No session found')
      return Response.json({ 
        success: false,
        error: 'Not authenticated. Please sign in first.' 
      }, { status: 401 })
    }

    console.log('[API] User authenticated:', session.user.id, session.user.email)
    
    // 2. Parse request body
    const body = await request.json()
    console.log('[API] Request body:', JSON.stringify(body, null, 2))
    
    // 3. Validate required fields
    if (!body.title || body.title.trim() === '') {
      return Response.json({
        success: false,
        error: 'Project title is required'
      }, { status: 400 })
    }
    
    // 4. Process tags
    let tags: string[] = []
    if (body.tags) {
      if (Array.isArray(body.tags)) {
        tags = body.tags.filter((tag: any) => typeof tag === 'string' && tag.trim() !== '')
      } else if (typeof body.tags === 'string') {
        tags = body.tags.split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== '')
      }
    }
    
    // 5. Create project in database
    console.log('[API] Creating project with data:', {
      title: body.title,
      description: body.description || '',
      tags,
      status: body.status || 'planned',
      userId: session.user.id
    })
    
    const project = await prisma.project.create({
      data: {
        title: body.title.trim(),
        description: (body.description || '').trim(),
        tags: tags,
        githubUrl: body.githubUrl?.trim() || null,
        liveUrl: body.liveUrl?.trim() || null,
        status: body.status || 'planned',
        userId: session.user.id
      }
    })
    
    console.log('[API] ✅ Project created successfully! ID:', project.id)
    
    // 6. Return success response
    return Response.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        status: project.status,
        createdAt: project.createdAt
      },
      message: 'Project created successfully!'
    }, { status: 201 })
    
  } catch (error: any) {
    // 7. Handle errors
    console.error('[API] ❌ POST /api/projects error:', error)
    
    let errorMessage = 'Failed to create project'
    let statusCode = 500
    
    // Specific error handling
    if (error.code === 'P1001') {
      errorMessage = 'Database connection failed. Check your DATABASE_URL.'
    } else if (error.code === 'P2002') {
      errorMessage = 'A similar project already exists.'
      statusCode = 409
    } else if (error.message?.includes('prisma')) {
      errorMessage = 'Database error occurred.'
    }
    
    return Response.json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    }, { status: statusCode })
  }
}