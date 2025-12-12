import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminReviewCard from '@/components/AdminReviewCard'

export default async function AdminReviewPage() {
  const session = await auth()
  
  // Check if user is admin (you can add admin role check here)
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Get all projects pending approval
  const pendingProjects = await prisma.startedProject.findMany({
    where: {
      progress: 100,
      showcaseSubmitted: true,
      adminReviewed: false
    },
    include: {
      user: true,
      projectTemplate: true,
      showcase: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // Get quiz scores for each project
  const projectsWithData = await Promise.all(
    pendingProjects.map(async (project) => {
      const steps = await prisma.step.findMany({
        where: { projectTemplateId: project.projectTemplateId }
      })

      const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
          userId: project.userId,
          stepId: { in: steps.map(s => s.id) }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Get best score per step
      const stepScores = steps.map(step => {
        const stepAttempts = quizAttempts.filter(a => a.stepId === step.id)
        const bestAttempt = stepAttempts.reduce((best, current) => 
          current.score > (best?.score || 0) ? current : best
        , stepAttempts[0])
        
        return {
          stepOrder: step.order,
          stepTitle: step.title,
          score: bestAttempt?.score || 0,
          attempts: stepAttempts.length
        }
      })

      const avgScore = stepScores.reduce((sum, s) => sum + s.score, 0) / stepScores.length

      return {
        ...project,
        quizScores: stepScores,
        averageScore: Math.round(avgScore)
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Certificate Review Dashboard</h1>
          <p className="text-gray-600">
            Review project submissions and approve certificates
          </p>
        </div>

        {projectsWithData.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              All Caught Up!
            </h2>
            <p className="text-gray-500">
              No projects pending approval at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>{projectsWithData.length}</strong> project{projectsWithData.length !== 1 ? 's' : ''} pending approval
              </p>
            </div>

            {projectsWithData.map((project) => (
              <AdminReviewCard key={project.id} submission={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
