// app/dashboard/page.tsx - FIXED WITH TYPE ANNOTATIONS
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

  // Fetch projects from database (SERVER SIDE)
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

  // Calculate progress stats WITH EXPLICIT TYPES
  const completedCount = projects.filter((p: any) => p.status === 'completed').length
  const inProgressCount = projects.filter((p: any) => p.status === 'in-progress').length
  const plannedCount = projects.filter((p: any) => p.status === 'planned').length

  // Pass data to client component
  return (
    <DashboardClient
      session={session}
      initialProjects={projects}
      stats={{
        total: projects.length,
        completed: completedCount,
        inProgress: inProgressCount,
        planned: plannedCount
      }}
    />
  )
}

// FORCE NEW COMMIT - $(Get-Date -Format 'yyyy-MM-dd HH:mm')
