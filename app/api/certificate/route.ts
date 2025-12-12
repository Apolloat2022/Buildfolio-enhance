import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectSlug = searchParams.get('project')

    if (!projectSlug) {
      return new NextResponse('Project slug required', { status: 400 })
    }

    // Get the project
    const startedProject = await prisma.startedProject.findFirst({
      where: {
        userId: session.user.id,
        projectTemplate: { slug: projectSlug }
      },
      include: {
        user: true,
        projectTemplate: true
      }
    })

    if (!startedProject || !startedProject.certificateEligible) {
      return new NextResponse('Certificate not available', { status: 403 })
    }

    // Generate simple HTML certificate
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: 'Georgia', serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            margin: 0 auto;
          }
          h1 { 
            font-size: 48px; 
            color: #333; 
            margin-bottom: 20px;
          }
          .name { 
            font-size: 36px; 
            color: #667eea; 
            font-weight: bold;
            margin: 30px 0;
          }
          .project { 
            font-size: 24px; 
            color: #555;
            margin: 20px 0;
          }
          .date {
            color: #888;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>🎓 Certificate of Completion</h1>
          <p>This certifies that</p>
          <div class="name">${startedProject.user.name || startedProject.user.email}</div>
          <p>has successfully completed</p>
          <div class="project">${startedProject.projectTemplate.title}</div>
          <p>Demonstrating proficiency in full-stack development</p>
          <div class="date">Issued: ${new Date().toLocaleDateString()}</div>
          <p style="margin-top: 40px; color: #888;">BuildFolio.tech</p>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Certificate error:', error)
    return new NextResponse('Error generating certificate', { status: 500 })
  }
}
