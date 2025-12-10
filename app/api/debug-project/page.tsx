// app/projects/[slug]/page-debug.tsx
// Rename this to page.tsx to test
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  try {
    // Step 1: Try to fetch the project
    const project = await prisma.projectTemplate.findUnique({
      where: { slug },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // Step 2: If no project, show message
    if (!project) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p>No project with slug: {slug}</p>
            <Link href="/projects" className="text-blue-600">← Back</Link>
          </div>
        </div>
      )
    }

    // Step 3: Show raw project data for debugging
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/projects" className="text-blue-600 mb-4 inline-block">← Back</Link>
          
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Project Info</h2>
            <p><strong>ID:</strong> {project.id}</p>
            <p><strong>Slug:</strong> {project.slug}</p>
            <p><strong>Difficulty:</strong> {project.difficulty}</p>
            <p><strong>Time Estimate:</strong> {project.timeEstimate || 'Not set'}</p>
            <p><strong>Resume Impact:</strong> {project.resumeImpact || 'Not set'}</p>
            <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
            <p><strong>Step Count:</strong> {project.steps.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Steps</h2>
            {project.steps.length === 0 && (
              <p className="text-gray-500">No steps found</p>
            )}
            {project.steps.map((step, index) => (
              <div key={step.id} className="border-b pb-4 mb-4 last:border-b-0">
                <h3 className="font-bold text-lg">
                  Step {step.order}: {step.title}
                </h3>
                <p className="text-gray-600 mt-2">{step.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Time: {step.estimatedTime || 'Not specified'}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">
                    Show Raw Data
                  </summary>
                  <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                    {JSON.stringify(step, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    
  } catch (error) {
    // Step 4: Show the actual error
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error!</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="font-bold">Error Message:</p>
            <pre className="mt-2 text-sm">
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
            {error instanceof Error && error.stack && (
              <>
                <p className="font-bold mt-4">Stack Trace:</p>
                <pre className="mt-2 text-xs overflow-auto">
                  {error.stack}
                </pre>
              </>
            )}
          </div>
          <Link href="/projects" className="text-blue-600 mt-4 inline-block">
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }
}