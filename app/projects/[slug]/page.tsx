import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@/app/auth'
import InteractiveStep from '@/components/InteractiveStep'
import ProgressTracker from '@/components/ProgressTracker'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const session = await auth()
  
  // Get project with REAL database steps
  const project = await prisma.projectTemplate.findUnique({
    where: { slug },
    include: {
      steps: {
        orderBy: { order: 'asc' }
      },
      startedProjects: session?.user?.id ? {
        where: { userId: session.user.id }
      } : false,
    }
  })

  if (!project) notFound()

  // User's progress for this project
  const userStartedProject = project.startedProjects?.[0] || null
  const completedSteps = userStartedProject?.completedSteps || []
  const progress = userStartedProject?.progress || 0
  const steps = project.steps || []
  
  // Use actual database fields
  const timeEstimateDisplay = project.timeEstimate || '25-30 hours'
  const resumeStars = project.resumeImpact || 5
  const technologies = project.technologies || []

  const getCodeSnippets = (codeSnippets: any): Array<{ language: string; code: string }> => {
    if (!codeSnippets) return []
    if (Array.isArray(codeSnippets)) {
      return codeSnippets.filter(item => 
        item && typeof item.language === 'string' && typeof item.code === 'string'
      )
    }
    return []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/projects"
                className="text-blue-600 hover:text-blue-800"
              >
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
                  <span className="text-gray-600">• {timeEstimateDisplay} • </span>
                  <span className="flex">
                    {'★'.repeat(resumeStars)}
                    {'☆'.repeat(5 - resumeStars)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* PROGRESS TRACKER COMPONENT */}
            {session && (
              <ProgressTracker 
                totalSteps={steps.length}
                completedSteps={completedSteps.length}
                projectId={project.id}
              />
            )}
            
            {/* If user not signed in, show sign in prompt */}
            {!session && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-w-[200px]">
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-blue-600">Sign in to track progress</div>
                  <div className="text-sm text-gray-500">Save your learning journey</div>
                </div>
                <a
                  href="/auth/signin"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps - WITH PROGRESS TRACKING */}
          <div className="lg:col-span-2 space-y-6">
            {steps.map((step) => {
              const isStepCompleted = completedSteps.includes(step.id);
              
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
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to update progress');
                    }
                    
                    // Refresh the page to update progress
                    window.location.reload();
                  }}
                />
              );
            })}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Download Starter Code */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Quick Start</h3>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg mb-3">
                Download Starter Code
              </button>
              <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg">
                Clone from GitHub
              </button>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🛠️ Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length === 0 && (
                  <span className="text-gray-500">No technologies listed</span>
                )}
              </div>
            </div>

            {/* Live Code Editor Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💻 Try It Live</h3>
              <div className="border rounded-lg p-4 bg-gray-900 text-white font-mono text-sm">
                // Welcome to {project.title}!<br/>
                // Try editing this code:<br/><br/>
                function Welcome() &#123;<br/>
                &nbsp;&nbsp;return &lt;h1&gt;Building {project.title}&lt;/h1&gt;;<br/>
                &#125;
              </div>
              <button className="w-full mt-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg">
                Open Full Editor
              </button>
            </div>

            {/* Learning Progress (Mobile only) */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:hidden">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Learning Progress</h3>
              {session ? (
                <>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600">{progress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{completedSteps.length} of {steps.length} steps</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {completedSteps.length === 0 ? 'Start your first step!' :
                     completedSteps.length < steps.length ? "Keep going! You're making steady progress." :
                     '🎉 Congratulations! Project completed!'}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-400 text-3xl mb-2">🔒</div>
                  <p className="text-gray-600 mb-4">Sign in to track your progress</p>
                  <a
                    href="/auth/signin"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign In
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}