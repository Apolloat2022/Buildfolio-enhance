// app/dashboard/DashboardClient.tsx
'use client'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

interface DashboardClientProps {
  session: Session
  initialProjects: Project[]
  stats: {
    total: number
    completed: number
    inProgress: number
    planned: number
  }
}

export default function DashboardClient({
  session,
  initialProjects,
  stats
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
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {/* User Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome!</h2>
          <div className="flex items-center gap-6">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-24 h-24 rounded-full"
              />
            )}
            <div>
              <p className="text-xl font-semibold">{session.user?.name}</p>
              <p className="text-gray-600">{session.user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Logged in via GitHub
              </p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Your Projects ({initialProjects.length}/10)
            </h2>
            <button
              onClick={() => router.push('/projects/new')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              + Add New Project
            </button>
          </div>

          {initialProjects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <h3 className="text-2xl font-bold mb-4">🚀 Start Your First Project!</h3>
              <p className="text-gray-600 mb-8">
                You haven't created any projects yet. Add your first project to begin tracking your 10-project journey.
              </p>
              <button
                onClick={() => router.push('/projects/new')}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {initialProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{project.description}</p>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 text-sm">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" className="text-blue-600 hover:underline">
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" className="text-green-600 hover:underline">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">📊 Progress Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
                    <p className="text-gray-600 mt-2">Total Projects</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-4xl font-bold text-green-600">{stats.completed}</div>
                    <p className="text-gray-600 mt-2">Completed</p>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-4xl font-bold text-yellow-600">{stats.inProgress}</div>
                    <p className="text-gray-600 mt-2">In Progress</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-4xl font-bold text-purple-600">{stats.planned}</div>
                    <p className="text-gray-600 mt-2">Planned</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}