import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CertificatesPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const eligibleProjects = await prisma.startedProject.findMany({
    where: {
      userId: session.user.id,
      certificateEligible: true
    },
    include: {
      projectTemplate: true
    },
    orderBy: {
      certificateIssuedAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Certificates</h1>
        
        {eligibleProjects.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Certificates Yet</h2>
            <p className="text-gray-500 mb-6">Complete projects to earn certificates!</p>
            <Link href="/projects" className="text-blue-600 hover:underline">
              Browse Projects →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {eligibleProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {project.projectTemplate.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Issued: {project.certificateIssuedAt?.toLocaleDateString() || 'Recently'}
                    </p>
                  </div>
                  
                    href={`/api/certificate?project=${project.projectTemplate.slug}`}
                    target="_blank"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg"
                  >
                    🎓 Download Certificate
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
