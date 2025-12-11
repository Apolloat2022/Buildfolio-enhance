import { auth } from '@/app/auth'
import ExportResumeButton from '@/components/ExportResumeButton'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import GamificationDashboard from '@/components/GamificationDashboard'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const startedProjects = await prisma.startedProject.findMany({
    where: { userId: session.user.id },
    include: {
      projectTemplate: true
    },
    orderBy: { lastWorkedOn: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user.name || session.user.email}!</p>
        </div>

        {/* Gamification Dashboard */}
        <div className="mb-8">
          <GamificationDashboard />
        </div>

        {/* Your Projects */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <Link 
              href="/projects"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse All Projects
            </Link>
                        <Link
              href="/dashboard/resume-profile"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Complete Resume Profile
            </Link>
            <ExportResumeButton />
          </div>

          {startedProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't started any projects yet</p>
              <Link 
                href="/projects"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Your First Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startedProjects.map((sp) => (
                <Link
                  key={sp.id}
                  href={`/projects/${sp.projectTemplate.slug}`}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold text-lg mb-2">{sp.projectTemplate.title}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{sp.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${sp.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      sp.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sp.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sp.status}
                    </span>
                    <span className="text-gray-500">
                      {sp.completedSteps.length} steps done
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}









