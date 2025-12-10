// app/projects/[slug]/page.tsx - USING REAL DATABASE STEPS
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@/app/auth'
import InteractiveStep from '@/components/InteractiveStep'
import CodeEditor from '@/components/CodeEditor'
import ProgressTracker from '@/components/ProgressTracker'

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
        orderBy: { order: 'asc' }  // Fetch structured steps in order
      },
      startedProjects: session?.user?.id ? {
        where: { userId: session.user.id }
      } : false,
    }
  })

  if (!project) notFound()

  // User's progress for this project
  const userStartedProject = project.startedProjects?.[0] || null
  
  // Use actual database fields
  const timeEstimateDisplay = project.timeEstimate || 'N/A'
  const resumeStars = project.resumeImpact || 0
  const technologies = project.technologies || []
  const steps = project.steps || []  // REAL steps from database

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
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
            <ProgressTracker 
              totalSteps={steps.length}
              completedSteps={userStartedProject?.progress || 0}
            />
          </div>
        </div>
      </div>
const getCodeSnippets = (codeSnippets: any): Array<{ language: string; code: string }> => {
  if (!codeSnippets) return []
  if (Array.isArray(codeSnippets)) {
    return codeSnippets.filter(item => 
      item && typeof item.language === 'string' && typeof item.code === 'string'
    )
  }
  return []
}

// Then use it:
codeSnippets={getCodeSnippets(step.codeSnippets)}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps - USING REAL DATABASE STEPS */}
          <div className="lg:col-span-2 space-y-6">
            {steps.map((step) => (
              <InteractiveStep
                key={step.id}
                stepNumber={step.order}
                title={step.title}
                description={step.description || ''}
                codeSnippets={(step.codeSnippets as Array<{ language: string; code: string }>) || []}
                pitfalls={step.pitfalls || []}
                estimatedTime={step.estimatedTime || 'Not specified'}
              />
            ))}
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
              <CodeEditor
                initialCode={`// Welcome to ${project.title}!\n// Try editing this code:\n\nfunction Welcome() {\n  return <h1>Building ${project.title}</h1>;\n}`}
                language="typescript"
                height="200px"
              />
              <button className="w-full mt-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg">
                Open Full Editor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}