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
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Your Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* User Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, {session.user?.name || 'Developer'}!</h2>
          <div className="flex items-center gap-6">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-24 h-24 rounded-full"
              />
            )}
            <div className="flex-1">
              <p className="text-xl font-semibold">{session.user?.name}</p>
              <p className="text-gray-600">{session.user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Logged in via GitHub • Active member
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{tutorialStats.overallProgress.toFixed(0)}%</div>
              <div className="text-gray-600 text-sm">Overall Learning Progress</div>
            </div>
          </div>
        </div>

        {/* Two Columns: Tutorials + Personal Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Tutorial Progress */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📚 Tutorial Progress</h2>
              <Link
                href="/projects"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Tutorials
              </Link>
            </div>

            {startedProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Start Learning</h3>
                <p className="text-gray-600 mb-6">
                  Follow guided tutorials to build portfolio-worthy projects.
                </p>
                <Link
                  href="/projects"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start First Tutorial
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {startedProjects.slice(0, 3).map((sp) => (
                    <div key={sp.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800">{sp.project.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          sp.progress === 100 ? 'bg-green-100 text-green-800' :
                          sp.progress > 50 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sp.progress}% complete
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${sp.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{sp.completedSteps.length} of {sp.project.steps.length} steps</span>
                        <Link 
                          href={`/projects/${sp.project.slug}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {sp.progress === 100 ? 'Review' : 'Continue'} →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {startedProjects.length > 3 && (
                  <div className="text-center">
                    <Link
                      href="/dashboard/tutorials"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all {startedProjects.length} tutorials →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Personal Projects */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">💼 Your Projects</h2>
              <button
                onClick={() => router.push('/projects/new')}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                + Add Project
              </button>
            </div>

            {initialProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Start Building Your Portfolio</h3>
                <p className="text-gray-600 mb-6">
                  Add your own projects to showcase your skills.
                </p>
                <button
                  onClick={() => router.push('/projects/new')}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add First Project
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {initialProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{project.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              GitHub
                            </a>
                          )}
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:text-green-800"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {initialProjects.length > 3 && (
                  <div className="text-center">
                    <Link
                      href="/dashboard/projects"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all {initialProjects.length} projects →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Combined Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Your Progress Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Personal Projects Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-gray-700 font-medium mt-2">Personal Projects</p>
              <div className="flex gap-2 mt-3">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">✓ {stats.completed}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">↻ {stats.inProgress}</span>
                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">○ {stats.planned}</span>
              </div>
            </div>

            {/* Tutorial Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="text-4xl font-bold text-purple-600">{tutorialStats.tutorialsStarted}</div>
              <p className="text-gray-700 font-medium mt-2">Tutorials Started</p>
              <div className="flex gap-2 mt-3">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">✓ {tutorialStats.tutorialsCompleted}</span>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {tutorialStats.tutorialsStarted - tutorialStats.tutorialsCompleted} active
                </span>
              </div>
            </div>

            {/* Steps Completed */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="text-4xl font-bold text-green-600">{tutorialStats.totalStepsCompleted}</div>
              <p className="text-gray-700 font-medium mt-2">Steps Completed</p>
              <div className="text-sm text-gray-600 mt-3">
                of {tutorialStats.totalStepsAvailable} total steps
              </div>
            </div>

            {/* Overall Progress */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
              <div className="text-4xl font-bold text-orange-600">{tutorialStats.overallProgress.toFixed(0)}%</div>
              <p className="text-gray-700 font-medium mt-2">Learning Progress</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                <div 
                  className="h-full bg-orange-600 rounded-full"
                  style={{ width: `${tutorialStats.overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/projects')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Tutorials
            </button>
            <button
              onClick={() => router.push('/projects/new')}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Add New Project
            </button>
            <button
              onClick={() => router.push('/dashboard/subscription')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Upgrade to PRO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}