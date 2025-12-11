import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  const session = await auth()
  
  // Only allow specific admin email
  if (session?.user?.email !== 'revanaglobal@gmail.com') {
    redirect('/')
  }

  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.startedProject.count(),
    prisma.startedProject.count({ where: { status: 'completed' } }),
    prisma.showcase.count(),
    prisma.resumeProfile.count(),
  ])

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      totalPoints: true,
      level: true,
      _count: {
        select: {
          startedProjects: true,
          showcases: true,
        }
      }
    }
  })

  const projectStats = await prisma.startedProject.groupBy({
    by: ['status'],
    _count: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-3xl font-bold">{stats[0]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Projects Started</div>
            <div className="text-3xl font-bold">{stats[1]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Projects Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats[2]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Showcases</div>
            <div className="text-3xl font-bold">{stats[3]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Resume Profiles</div>
            <div className="text-3xl font-bold">{stats[4]}</div>
          </div>
        </div>

        {/* Project Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Project Status</h2>
          <div className="space-y-2">
            {projectStats.map((stat) => (
              <div key={stat.status} className="flex justify-between items-center">
                <span className="capitalize">{stat.status}:</span>
                <span className="font-bold">{stat._count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Level</th>
                  <th className="text-left p-2">Points</th>
                  <th className="text-left p-2">Projects</th>
                  <th className="text-left p-2">Showcases</th>
                  <th className="text-left p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.level}</td>
                    <td className="p-2">{user.totalPoints}</td>
                    <td className="p-2">{user._count.startedProjects}</td>
                    <td className="p-2">{user._count.showcases}</td>
                    <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
