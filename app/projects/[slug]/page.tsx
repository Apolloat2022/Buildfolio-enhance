import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import InteractiveStep from '@/components/InteractiveStep'
import ProgressTracker from '@/components/ProgressTracker'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

const getCodeSnippets = (codeSnippets: any): Array<{ language: string; code: string }> => {
  if (!codeSnippets) return []
  if (Array.isArray(codeSnippets)) {
    return codeSnippets.filter(item => 
      item && typeof item.language === 'string' && typeof item.code === 'string'
    )
  }
  return []
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const slug = (await params).slug
  const session = await auth()
  
  try {
    const project = await prisma.projectTemplate.findUnique({
      where: { slug },
      include: {
        steps: { orderBy: { order: 'asc' } },
        startedProjects: session?.user?.id ? {
          where: { userId: session.user.id }
        } : false,
      }
    })

    if (!project) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tutorial Coming Soon!
            </h1>
            <p className="text-gray-600 mb-6">
              The &quot;{slug}&quot; tutorial is being prepared.
            </p>
            <Link href="/projects" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              ← Browse Available Tutorials
            </Link>
          </div>
        </div>
      )
    }

    const userStartedProject = project.startedProjects?.[0] || null
    const completedSteps = userStartedProject?.completedSteps || []
    const progress = userStartedProject?.progress || 0
    const steps = project.steps || []
    const timeEstimate = project.timeEstimate || '25-30 hours'
    const resumeStars = project.resumeImpact || 5
    const technologies = project.technologies || []
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/projects" className="text-blue-600 hover:text-blue-800">
                  ← Back to Projects
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      project.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.difficulty}
                    </span>
                    <span className="text-gray-600">• {timeEstimate}</span>
                  </div>
                </div>
              </div>
              
              {session && (
                <ProgressTracker 
                  totalSteps={steps.length}
                  completedSteps={completedSteps.length}
                  projectId={project.id}
                />
              )}
              
              {!session && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center mb-2">
                    <div className="text-lg font-bold text-blue-600">Sign in to track progress</div>
                  </div>
                  <Link href="/auth/signin" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {steps.map((step) => {
                const isStepCompleted = completedSteps.includes(step.id)
                
                return (
                  <InteractiveStep
                    key={step.id}
                    stepNumber={step.order}
                    title={step.title}
                    description={step.description || ''}
                    codeSnippets={getCodeSnippets(step.codeSnippets)}
                    pitfalls={step.pitfalls || []}
                    estimatedTime={step.estimatedTime || 'Not specified'}
                    stepId={step.id}
                    projectId={project.id}
                    isCompleted={isStepCompleted}
                    onMarkComplete={async (stepId, projectId, isCompleted) => {
                      const response = await fetch('/api/progress', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          stepId, 
                          projectId, 
                          action: isCompleted ? 'complete' : 'incomplete' 
                        }),
                      })
                      
                      if (!response.ok) {
                        throw new Error('Failed to update progress')
                      }
                      
                      window.location.reload()
                    }}
                  />
                )
              })}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🛠️ Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    
  } catch (error) {
    console.error('Error loading tutorial:', error)
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tutorial</h1>
          <p className="text-gray-600 mb-6">
            We are having trouble loading this tutorial.
          </p>
          <Link href="/projects" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ← Back to All Tutorials
          </Link>
        </div>
      </div>
    )
  }
}