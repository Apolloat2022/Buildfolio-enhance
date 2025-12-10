'use client'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  status: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  createdAt: Date
  updatedAt: Date
}

interface StartedProject {
  id: string
  progress: number
  completedSteps: string[]
  project: {
    id: string
    title: string
    slug: string
    difficulty: string
    steps: Array<{
      id: string
      title: string
    }>
  }
}

interface DashboardClientProps {
  session: Session
  initialProjects: Project[]
  startedProjects: StartedProject[]
  stats: {
    total: number
    completed: number
    inProgress: number
    planned: number
  }
  tutorialStats: {
    tutorialsStarted: number
    tutorialsCompleted: number
    totalStepsCompleted: number
    totalStepsAvailable: number
    overallProgress: number
  }
}

export default function DashboardClient({
  session,
  initialProjects,
  startedProjects,
  stats,
  tutorialStats
}: DashboardClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">
          Your Dashboard - Fix Applied
        </h1>
        <p className="text-gray-600">
          Dashboard content will go here. The TypeScript module error should now be resolved.
        </p>
        <p className="mt-4">
          Session user: {session?.user?.name || 'Not logged in'}
        </p>
      </div>
    </div>
  )
}