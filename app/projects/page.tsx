// app/projects/page.tsx
import { prisma } from '@/lib/prisma'
import ProjectCard from '@/components/ProjectCard'

export default async function ProjectsPage() {
  const projects = await prisma.projectTemplate.findMany({
    orderBy: { resumeImpact: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Catalog</h1>
          <p className="text-gray-600 text-lg">
            Browse {projects.length} resume-worthy projects to build your portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            More projects coming soon! Check back regularly for new challenges.
          </p>
        </div>
      </div>
    </div>
  )
}