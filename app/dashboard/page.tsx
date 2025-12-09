// app/dashboard/page.tsx - COMPLETE FIX
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

  // Fetch projects from database
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

  // Calculate progress stats
  const completedCount = projects.filter((p: any) => p.status === 'completed').length
  const inProgressCount = projects.filter((p: any) => p.status === 'in-progress').length
  const plannedCount = projects.filter((p: any) => p.status === 'planned').length

  // TRANSFORM DATA: Convert null to appropriate types
  const transformedProjects = projects.map(project => ({
    ...project,
    githubUrl: project.githubUrl ?? undefined,    // null → undefined
    liveUrl: project.liveUrl ?? undefined,        // null → undefined
    description: project.description ?? '',       // null → empty string
  }))

  // Pass transformed data
  return (
    <DashboardClient
      session={session}
      initialProjects={transformedProjects}
      stats={{
        total: projects.length,
        completed: completedCount,
        inProgress: inProgressCount,
        planned: plannedCount
      }}
    />
  )
}