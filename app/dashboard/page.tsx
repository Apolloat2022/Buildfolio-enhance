import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await auth()

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Fetch TWO types of data:

  // 1. User's personal portfolio projects (Project model)
  const userProjects = await prisma.project.findMany({
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
  const startedProjects = await prisma.startedProject.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          steps: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  // TRANSFORM DATA for personal projects
  const transformedProjects = userProjects.map(project => ({
    ...project,
    githubUrl: project.githubUrl ?? undefined,
    liveUrl: project.liveUrl ?? undefined,
    description: project.description ?? '',
  }))

  // Calculate stats for BOTH types of projects
  const personalProjectsStats = {
    total: userProjects.length,
    completed: userProjects.filter((p: any) => p.status === 'completed').length,
    inProgress: userProjects.filter((p: any) => p.status === 'in-progress').length,
    planned: userProjects.filter((p: any) => p.status === 'planned').length
  }

  // Calculate tutorial progress stats
  const tutorialStats = {
    tutorialsStarted: startedProjects.length,
    tutorialsCompleted: startedProjects.filter(p => p.progress === 100).length,
    totalStepsCompleted: startedProjects.reduce((acc, p) => acc + p.completedSteps.length, 0),
    totalStepsAvailable: startedProjects.reduce((acc, p) => acc + p.project.steps.length, 0),
    overallProgress: startedProjects.reduce((acc, p) => acc + p.progress, 0) / Math.max(startedProjects.length, 1)
  }

  // Combine data for DashboardClient
  return (
    <DashboardClient
      session={session}
      initialProjects={transformedProjects}
      startedProjects={startedProjects}
      stats={personalProjectsStats}
      tutorialStats={tutorialStats}
    />
  )
}