// app/api/progress/route.ts - UPDATED WITH GET METHOD
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch user progress for a project
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find user's progress for this project
    const startedProject = await prisma.startedProject.findUnique({
      where: {
        userId_projectTemplateId: {
          userId: user.id,
          projectTemplateId: projectId
        }
      }
    });

    if (!startedProject) {
      return NextResponse.json({ 
        progress: 0, 
        completedSteps: [] 
      });
    }

    return NextResponse.json({
      progress: startedProject.progress,
      completedSteps: startedProject.completedSteps
    });
  } catch (error) {
    console.error('GET Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST: Update user progress (YOUR EXISTING CODE)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stepId, projectId, action } = await request.json();
    
    if (!stepId || !projectId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find or create StartedProject
    let startedProject = await prisma.startedProject.findUnique({
      where: {
        userId_projectTemplateId: {
          userId: user.id,
          projectTemplateId: projectId
        }
      }
    });

    if (!startedProject) {
      startedProject = await prisma.startedProject.create({
        data: {
          userId: user.id,
          projectTemplateId: projectId,
          completedSteps: [],
          progress: 0
        }
      });
    }

    if (action === 'complete') {
      // Add step to completedSteps if not already there
      if (!startedProject.completedSteps.includes(stepId)) {
        const updated = await prisma.startedProject.update({
          where: {
            userId_projectTemplateId: {
              userId: user.id,
              projectTemplateId: projectId
            }
          },
          data: {
            completedSteps: { push: stepId }
          }
        });

        // Calculate progress percentage
        const project = await prisma.projectTemplate.findUnique({
          where: { id: projectId },
          include: { steps: true }
        });

        const progress = project 
          ? Math.round((updated.completedSteps.length / project.steps.length) * 100)
          : 0;

        // Update progress percentage
        const finalUpdate = await prisma.startedProject.update({
          where: {
            userId_projectTemplateId: {
              userId: user.id,
              projectTemplateId: projectId
            }
          },
          data: { progress }
        });

        return NextResponse.json({ 
          success: true, 
          progress: finalUpdate.progress,
          completedSteps: finalUpdate.completedSteps 
        });
      }
    } else if (action === 'incomplete') {
      // Remove step from completedSteps
      const updatedSteps = startedProject.completedSteps.filter(id => id !== stepId);
      
      const updated = await prisma.startedProject.update({
        where: {
          userId_projectTemplateId: {
            userId: user.id,
            projectTemplateId: projectId
          }
        },
        data: {
          completedSteps: updatedSteps
        }
      });

      // Recalculate progress
      const project = await prisma.projectTemplate.findUnique({
        where: { id: projectId },
        include: { steps: true }
      });

      const progress = project 
        ? Math.round((updatedSteps.length / project.steps.length) * 100)
        : 0;

      // Update progress percentage
      const finalUpdate = await prisma.startedProject.update({
        where: {
          userId_projectTemplateId: {
            userId: user.id,
            projectTemplateId: projectId
          }
        },
        data: { progress }
      });

      return NextResponse.json({ 
        success: true, 
        progress: finalUpdate.progress,
        completedSteps: finalUpdate.completedSteps 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}