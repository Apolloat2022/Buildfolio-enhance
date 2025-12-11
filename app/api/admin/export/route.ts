import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  
  // Only allow admin
  if (session?.user?.email !== 'revanaglobal@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    include: {
      startedProjects: {
        include: {
          projectTemplate: true
        }
      },
      resumeProfile: true,
      showcases: true,
      subscriptions: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  // Build CSV content
  const csvRows = []
  
  // Headers
  csvRows.push([
    'Name',
    'Email',
    'Phone',
    'Location',
    'Level',
    'Points',
    'Projects Started',
    'Projects Completed',
    'Showcases',
    'Has Resume Profile',
    'Subscription Plan',
    'Subscription Status',
    'Joined Date',
    'Last Active',
  ].join(','))

  // Data rows
  users.forEach(user => {
    const projectsStarted = user.startedProjects.length
    const projectsCompleted = user.startedProjects.filter(p => p.status === 'completed').length
    const hasResume = user.resumeProfile ? 'Yes' : 'No'
    const subscription = user.subscriptions[0]
    
    csvRows.push([
      `"${user.name || ''}"`,
      user.email || '',
      user.resumeProfile?.phone || '',
      user.resumeProfile?.location || '',
      user.level,
      user.totalPoints,
      projectsStarted,
      projectsCompleted,
      user.showcases.length,
      hasResume,
      subscription?.plan || 'FREE',
      subscription?.status || 'NONE',
      new Date(user.createdAt).toLocaleDateString(),
      user.lastActiveDate ? new Date(user.lastActiveDate).toLocaleDateString() : 'N/A',
    ].join(','))
  })

  const csv = csvRows.join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="buildfolio-users-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
