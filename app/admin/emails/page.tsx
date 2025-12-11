import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminEmailsPage() {
  const session = await auth()
  
  if (session?.user?.email !== 'revanaglobal@gmail.com') {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      resumeProfile: {
        select: {
          phone: true,
          location: true,
        }
      },
      subscriptions: {
        select: {
          plan: true,
          status: true,
        }
      },
      _count: {
        select: {
          startedProjects: true,
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">?? User Emails  ({users.length})</h1>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ? Back to Admin
          </Link>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Export Options</h2>
          <div className="flex flex-wrap gap-4">
            
              href="/api/admin/export-emails?filter=all"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Export All
            </a>
            
              href="/api/admin/export-emails?filter=free-users"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Free Users Only
            </a>
            
              href="/api/admin/export-emails?filter=active-free"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Active Free Users
            </a>
            
              href="/api/admin/export-emails?filter=completed-projects"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Completed Projects
            </a>
          </div>
        </div>

        {/* Email List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Plan</th>
                <th className="text-left p-4">Projects</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{user.name || '-'}</td>
                  <td className="p-4">
                    <a 
                      href={`mailto:${user.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td className="p-4">{user.resumeProfile?.phone || '-'}</td>
                  <td className="p-4">{user.resumeProfile?.location || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.subscriptions[0]?.plan === 'PRO' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.subscriptions[0]?.plan || 'FREE'}
                    </span>
                  </td>
                  <td className="p-4">{user._count.startedProjects}</td>
                  <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

