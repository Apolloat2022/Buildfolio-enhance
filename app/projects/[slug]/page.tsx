import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import Link from 'next/link'
import MarkCompleteButton from '@/components/MarkCompleteButton'
import StudyTimer from '@/components/StudyTimer'
import StepQA from '@/components/StepQA'

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

const getHints = (hints: any): Array<{ level: number; content: string; unlockMinutes: number }> => {
  if (!hints) return []
  if (Array.isArray(hints)) {
    return hints.filter(item => 
      item && typeof item.level === 'number' && typeof item.content === 'string'
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
        <div className="p-8">
          <h1>Not Found: {slug}</h1>
          <Link href="/projects">Back</Link>
        </div>
      )
    }

    const userStartedProject = project.startedProjects?.[0] || null
    const completedSteps = userStartedProject?.completedSteps || []
    const progress = userStartedProject?.progress || 0
    const steps = project.steps || []
    const technologies = project.technologies || []
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto">
            <Link href="/projects" className="text-blue-600">← Back</Link>
            <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
            <p className="text-gray-600">{project.description}</p>
            
            {session && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <p className="font-bold">Progress: {progress}%</p>
                <p className="text-sm">Completed: {completedSteps.length} / {steps.length} steps</p>
              </div>
            )}
            
            {!session && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm">
                  <Link href="/auth/signin" className="text-blue-600 font-bold">Sign in</Link> to track your progress
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN - Tutorial Steps */}
            <div className="lg:col-span-2 space-y-6">
              {steps.map((step) => {
                const isCompleted = completedSteps.includes(step.id)
                const codeSnippets = getCodeSnippets(step.codeSnippets)
                const hints = getHints(step.hints)
                
                return (
                  <div key={step.id} className={`bg-white rounded-lg shadow p-6 border-2 ${isCompleted ? 'border-green-500' : 'border-transparent'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-bold">
                        Step {step.order}: {step.title}
                      </h2>
                      {isCompleted && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          ✓ Complete
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      ⏱️ {step.estimatedTime || 'Not specified'}
                    </p>

                    {/* VIDEO */}
                    {step.videoUrl && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          🎥 Video Walkthrough
                        </h4>
                        <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                          <iframe
                            src={step.videoUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`Video for ${step.title}`}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* CODE SNIPPETS */}
                    {codeSnippets.length > 0 && (
                      <div className="space-y-3 mb-4">
                        <h4 className="font-semibold text-gray-900">📝 Code</h4>
                        {codeSnippets.map((snippet, idx) => (
                          <div key={idx} className="bg-gray-900 rounded-lg p-4">
                            <div className="text-xs text-gray-400 mb-2">{snippet.language}</div>
                            <pre className="text-sm text-white overflow-x-auto">
                              <code>{snippet.code}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* HINTS */}
                    {hints.length > 0 && (
                      <details className="mb-4 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                        <summary className="cursor-pointer font-semibold text-amber-900 flex items-center gap-2">
                          💡 Hints ({hints.length} available)
                        </summary>
                        <div className="mt-3 space-y-2">
                          {hints.map((hint, idx) => (
                            <div key={idx} className="bg-white rounded p-3 border border-amber-200">
                              <div className="text-xs text-amber-600 font-semibold mb-1">
                                Hint {hint.level} (unlocks after {hint.unlockMinutes}min)
                              </div>
                              <p className="text-sm text-gray-700">{hint.content}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                    
                    {/* PITFALLS */}
                    {step.pitfalls && step.pitfalls.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                        <p className="font-bold text-yellow-800 mb-2">⚠️ Common Pitfalls:</p>
                        <ul className="list-disc list-inside text-sm text-yellow-700">
                          {step.pitfalls.map((pitfall, idx) => (
                            <li key={idx}>{pitfall}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* MARK COMPLETE BUTTON */}
                    {session && (
                      <MarkCompleteButton 
                        stepId={step.id}
                        projectId={project.id}
                        isCompleted={isCompleted}
                      />
                    )}

                    {/* Q&A SECTION */}
                    <StepQA stepId={step.id} isAuthenticated={!!session} />
                  </div>
                )
              })}
            </div>

            {/* RIGHT COLUMN - Sidebar */}
            <div className="space-y-6">
              {/* STUDY TIMER */}
              <StudyTimer />

              {/* TECHNOLOGIES */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">🛠️ Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
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
    return (
      <div className="p-8">
        <h1 className="text-red-600">ERROR!</h1>
        <pre className="bg-red-50 p-4 mt-4">{error instanceof Error ? error.message : 'Unknown'}</pre>
      </div>
    )
  }
}