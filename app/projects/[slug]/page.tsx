// app/projects/[slug]/page.tsx - USING CORRECT FIELD NAMES
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
  
  // Get project with expanded details - SIMPLE FIXED VERSION
  const project = await prisma.projectTemplate.findUnique({
    where: { slug },
    include: {
      startedProjects: true, // ✅ Simple fix - include all
    }
  })

  if (!project) notFound()

  // Filter user's started project in JavaScript
  const userStartedProject = project.startedProjects?.find(
    sp => sp.userId === session?.user?.id
  )

  // Use actual database fields
  const timeEstimateDisplay = project.timeEstimate || 'N/A'
  const resumeStars = project.resumeImpact || 0
  const technologies = project.technologies || []
  const steps = project.steps || []

  // Expanded step details (would come from database)
  const detailedSteps = [
    {
      title: "Project Setup & Authentication",
      description: "Initialize the project with proper structure and user authentication",
      codeSnippets: [
        { language: 'bash', code: 'npx create-next-app@latest ecommerce-store --typescript --tailwind --app' },
        { language: 'typescript', code: '// auth.ts - Authentication setup\nimport { NextAuth } from "next-auth"\nimport CredentialsProvider from "next-auth/providers/credentials"' }
      ],
      pitfalls: ["Don't forget environment variables", "Set up proper CORS policies"],
      estimatedTime: "2 hours"
    },
    {
      title: "Product Catalog & Database",
      description: "Create product models and implement database schema",
      codeSnippets: [
        { language: 'prisma', code: 'model Product {\n  id String @id @default(cuid())\n  name String\n  price Decimal\n  description String?\n  category String\n}' }
      ],
      pitfalls: ["Normalize database properly", "Add proper indexes for performance"],
      estimatedTime: "3 hours"
    }
  ]

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
              completedSteps={userStartedProject?.progress || 0} // Use actual progress
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps */}
          <div className="lg:col-span-2 space-y-6">
            {detailedSteps.map((step, index) => (
              <InteractiveStep
                key={index}
                stepNumber={index + 1}
                title={step.title}
                description={step.description}
                codeSnippets={step.codeSnippets}
                pitfalls={step.pitfalls}
                estimatedTime={step.estimatedTime}
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