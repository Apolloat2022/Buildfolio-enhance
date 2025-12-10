import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

// Define proper TypeScript interfaces
interface UserProject {
  id: string
  title: string
  description: string | null
  status: string
  tags: string[]
  githubUrl: string | null
  liveUrl: string | null
  createdAt: Date
  updatedAt: Date
}

interface StartedProjectWithTemplate {
  id: string
  userId: string
  projectTemplateId: string
  status: string
  progress: number
  completedSteps: string[]
  startedAt: Date
  lastActivityAt: Date
  completedAt: Date | null
  projectTemplate: {
    id: string
    title: string
    slug: string
    description: string | null
    difficulty: string
    steps: Array<{
      id: string
      order: number
      title: string
      description: string | null
    }>
  }
}

export default async function DashboardPage() {
  const session = await auth()

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Wrap ALL data fetching in try-catch
  let userProjects: UserProject[] = []
  let startedProjects: StartedProjectWithTemplate[] = []

  try {
    // 1. User's personal portfolio projects (Project model)
    userProjects = await prisma.project.findMany({
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

    // 2. User's tutorial progress (StartedProject model)
    startedProjects = await prisma.startedProject.findMany({
      where: { userId: session.user.id },
      include: {
        projectTemplate: {
          include: {
            steps: {
              select: {
                id: true,
                order: true,
                title: true,
                description: true
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { lastActivityAt: 'desc' }
    })
  } catch (dbError) {
    console.error('Database error in dashboard:', dbError)
    // Continue with empty arrays - dashboard will show "no data" state
  }

  // TRANSFORM DATA for personal projects
  const transformedProjects = userProjects.map(project => ({
    ...project,
    githubUrl: project.githubUrl ?? undefined,
    liveUrl: project.liveUrl ?? undefined,
    description: project.description ?? '',
  }))

  // Calculate stats for personal projects
  const personalProjectsStats = {
    total: userProjects.length,
    completed: userProjects.filter(p => p.status === 'completed').length,
    inProgress: userProjects.filter(p => p.status === 'in-progress').length,
    planned: userProjects.filter(p => p.status === 'planned').length
  }

  // Calculate tutorial progress stats (with fallback for missing data)
  const totalStepsAvailable = startedProjects.reduce(
    (acc, p) => acc + (p.projectTemplate?.steps?.length || 0),
    0
  )
  
  const tutorialStats = {
    tutorialsStarted: startedProjects.length,
    tutorialsCompleted: startedProjects.filter(p => p.progress === 100).length,
    totalStepsCompleted: startedProjects.reduce(
      (acc, p) => acc + p.completedSteps.length,
      0
    ),
    totalStepsAvailable,
    overallProgress: startedProjects.length > 0 
      ? startedProjects.reduce((acc, p) => acc + p.progress, 0) / startedProjects.length
      : 0
  }

  // Prepare data for DashboardClient
  const clientStartedProjects = startedProjects.map(sp => ({
    id: sp.id,
    progress: sp.progress,
    completedSteps: sp.completedSteps,
    projectTemplate: {
      id: sp.projectTemplate.id,
      title: sp.projectTemplate.title,
      slug: sp.projectTemplate.slug,
      difficulty: sp.projectTemplate.difficulty,
      steps: sp.projectTemplate.steps.map(step => ({
        id: step.id,
        title: step.title
      }))
    }
  }))

  // Combine data for DashboardClient
  return (
    <DashboardClient
      session={session}
      initialProjects={transformedProjects}
      startedProjects={clientStartedProjects}
      stats={personalProjectsStats}
      tutorialStats={tutorialStats}
    />
  )
}