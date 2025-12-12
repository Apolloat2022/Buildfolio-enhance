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

    const certNumber = `BF-${Date.now().toString(36).toUpperCase()}`
    const issueDate = startedProject.certificateIssuedAt || new Date()

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Lato', sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            padding: 40px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .certificate {
            background: white;
            width: 800px;
            padding: 60px;
            border: 20px solid #1e3c72;
            border-image: linear-gradient(135deg, #1e3c72, #2a5298, #667eea) 1;
            box-shadow: 0 30px 80px rgba(0,0,0,0.4);
            position: relative;
          }
          
          .certificate::before {
            content: '';
            position: absolute;
            top: 15px; left: 15px; right: 15px; bottom: 15px;
            border: 2px solid #d4af37;
            pointer-events: none;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #1e3c72;
            padding-bottom: 20px;
            margin-bottom: 40px;
          }
          
          .logo {
            font-size: 32px;
            font-weight: 700;
            color: #1e3c72;
            font-family: 'Playfair Display', serif;
            letter-spacing: 2px;
          }
          
          .subtitle {
            color: #667eea;
            font-size: 14px;
            margin-top: 5px;
            letter-spacing: 3px;
            text-transform: uppercase;
          }
          
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            color: #1e3c72;
            text-align: center;
            margin-bottom: 30px;
            letter-spacing: 2px;
          }
          
          .body-text {
            text-align: center;
            font-size: 18px;
            color: #333;
            line-height: 1.8;
            margin-bottom: 20px;
          }
          
          .recipient-name {
            font-size: 42px;
            font-weight: 700;
            color: #667eea;
            text-align: center;
            margin: 30px 0;
            font-family: 'Playfair Display', serif;
            border-bottom: 3px solid #d4af37;
            padding-bottom: 10px;
            display: inline-block;
            width: 100%;
          }
          
          .project-name {
            font-size: 32px;
            font-weight: 700;
            color: #1e3c72;
            text-align: center;
            margin: 30px 0;
            font-family: 'Playfair Display', serif;
          }
          
          .technologies {
            text-align: center;
            margin: 20px 0;
            font-size: 14px;
            color: #666;
          }
          
          .tech-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            margin: 5px;
            font-size: 12px;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #eee;
          }
          
          .signature-line {
            text-align: center;
            flex: 1;
            margin: 0 20px;
          }
          
          .signature {
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 40px;
            font-size: 14px;
            font-weight: 700;
          }
          
          .signature-title {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          
          .cert-details {
            text-align: center;
            margin-top: 40px;
            font-size: 11px;
            color: #999;
          }
          
          .seal {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, #d4af37, #f7dc6f);
            border: 5px solid #c9941d;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            position: absolute;
            bottom: 80px;
            right: 80px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          }
          
          @media print {
            body { background: white; padding: 0; }
            .certificate { border: 20px solid #1e3c72; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">BUILDFOLIO</div>
            <div class="subtitle">Professional Development Platform</div>
          </div>
          
          <div class="title">Certificate of Completion</div>
          
          <div class="body-text">This is to certify that</div>
          
          <div class="recipient-name">${startedProject.user.name || startedProject.user.email}</div>
          
          <div class="body-text">has successfully completed the intensive project</div>
          
          <div class="project-name">${startedProject.projectTemplate.title}</div>
          
          <div class="body-text">
            Demonstrating proficiency in full-stack development,<br>
            problem-solving, and software engineering best practices
          </div>
          
          <div class="technologies">
            ${startedProject.projectTemplate.technologies.map(tech => 
              `<span class="tech-badge">${tech}</span>`
            ).join('')}
          </div>
          
          <div class="footer">
            <div class="signature-line">
              <div class="signature">BuildFolio Team</div>
              <div class="signature-title">Platform Director</div>
            </div>
            <div class="signature-line">
              <div class="signature">${issueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <div class="signature-title">Date of Completion</div>
            </div>
          </div>
          
          <div class="seal">🏆</div>
          
          <div class="cert-details">
            Certificate No: ${certNumber}<br>
            Verify at: buildfolio.tech/verify/${certNumber}
          </div>
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
