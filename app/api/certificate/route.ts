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
    const formattedDate = issueDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400&family=Great+Vibes&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Lato', sans-serif;
            background: #f5f5f5;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          
          .certificate {
            background: white;
            width: 1100px;
            height: 850px;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          
          /* Diagonal stripes top right */
          .stripe-top {
            position: absolute;
            top: -100px;
            right: -100px;
            width: 600px;
            height: 600px;
            transform: rotate(45deg);
            background: linear-gradient(135deg, 
              #1e3c72 0%, #1e3c72 30%, 
              transparent 30%, transparent 35%,
              #d4af37 35%, #d4af37 40%,
              transparent 40%);
            z-index: 1;
          }
          
          /* Diagonal stripes bottom left */
          .stripe-bottom {
            position: absolute;
            bottom: -100px;
            left: -100px;
            width: 600px;
            height: 600px;
            transform: rotate(45deg);
            background: linear-gradient(135deg, 
              #1e3c72 0%, #1e3c72 30%, 
              transparent 30%, transparent 35%,
              #d4af37 35%, #d4af37 40%,
              transparent 40%);
            z-index: 1;
          }
          
          .content {
            position: relative;
            z-index: 2;
            padding: 80px 100px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          
          .logo {
            font-size: 36px;
            font-weight: 700;
            color: #1e3c72;
            font-family: 'Playfair Display', serif;
            letter-spacing: 2px;
          }
          
          .logo-sub {
            font-size: 12px;
            color: #667eea;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 5px;
          }
          
          .title-section {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .main-title {
            font-family: 'Playfair Display', serif;
            font-size: 64px;
            color: #1e3c72;
            letter-spacing: 4px;
            margin-bottom: 10px;
          }
          
          .subtitle {
            font-size: 18px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .presented-to {
            text-align: center;
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
          }
          
          .recipient-name {
            font-family: 'Great Vibes', cursive;
            font-size: 72px;
            color: #1e3c72;
            text-align: center;
            margin: 30px 0;
            line-height: 1;
          }
          
          .completion-text {
            text-align: center;
            font-size: 16px;
            color: #333;
            line-height: 1.8;
            max-width: 700px;
            margin: 0 auto 20px;
          }
          
          .project-name {
            font-weight: 700;
            color: #1e3c72;
          }
          
          .technologies {
            text-align: center;
            margin: 20px 0;
          }
          
          .tech-badge {
            display: inline-block;
            background: linear-gradient(135deg, #1e3c72, #667eea);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            margin: 5px;
            font-size: 11px;
            letter-spacing: 1px;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
          }
          
          .signature-section {
            text-align: center;
            flex: 1;
          }
          
          .signature-name {
            font-family: 'Great Vibes', cursive;
            font-size: 36px;
            color: #1e3c72;
            margin-bottom: 5px;
            border-top: 2px solid #333;
            padding-top: 10px;
          }
          
          .signature-title {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .date-section {
            text-align: center;
            flex: 1;
          }
          
          .date {
            font-size: 16px;
            color: #333;
            font-weight: 600;
            margin-bottom: 5px;
            border-top: 2px solid #333;
            padding-top: 10px;
          }
          
          .date-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .cert-number {
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 10px;
            color: #999;
            z-index: 3;
          }
          
          @media print {
            body { background: white; padding: 0; }
            @page { size: landscape; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="stripe-top"></div>
          <div class="stripe-bottom"></div>
          
          <div class="content">
            <div class="header">
              <div>
                <div class="logo">BUILDFOLIO</div>
                <div class="logo-sub">Professional Development</div>
              </div>
            </div>
            
            <div class="title-section">
              <div class="main-title">CERTIFICATE</div>
              <div class="subtitle">OF ${startedProject.projectTemplate.title.toUpperCase()}</div>
            </div>
            
            <div class="presented-to">This Certificate Is Proudly Presented To</div>
            
            <div class="recipient-name">${startedProject.user.name || startedProject.user.email}</div>
            
            <div class="completion-text">
              We give this certificate because <span class="project-name">${startedProject.user.name || startedProject.user.email}</span> has completed the 
              <span class="project-name">"${startedProject.projectTemplate.title}"</span> project and passed all assessments,
              demonstrating proficiency in full-stack development and software engineering best practices.
            </div>
            
            <div class="technologies">
              ${startedProject.projectTemplate.technologies.map(tech => 
                `<span class="tech-badge">${tech}</span>`
              ).join('')}
            </div>
            
            <div class="footer">
              <div class="signature-section">
                <div class="signature-name">Robin Pandey</div>
                <div class="signature-title">Chief Executive Officer</div>
              </div>
              
              <div class="date-section">
                <div class="date">${formattedDate}</div>
                <div class="date-label">Date</div>
              </div>
            </div>
          </div>
          
          <div class="cert-number">Certificate No: ${certNumber} | Verify at buildfolio.tech/verify</div>
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
