import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { auth } from '@/app/auth'

export default async function ProjectsPage() {
  const session = await auth()
  
  const projects = await prisma.projectTemplate.findMany({
    include: {
      steps: true,
      _count: {
        select: { startedProjects: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Build Real Projects
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose a project, follow step-by-step tutorials, pass quizzes, and earn your certificate.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.slug}`}
              className="block animate-slide-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="card-modern h-full flex flex-col group">
                {/* Project Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {project.icon || '??'}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <span>??</span>
                    <span>{project.steps.length} steps</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>??</span>
                    <span>{project._count.startedProjects} started</span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="badge">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="badge">+{project.technologies.length - 3}</span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <div className="btn-primary w-full text-center">
                    Start Building
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Projects State */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">??</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400">Check back soon for new projects!</p>
          </div>
        )}
      </div>
    </div>
  )
}

