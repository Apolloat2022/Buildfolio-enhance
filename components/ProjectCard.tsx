// components/ProjectCard.tsx
import Link from 'next/link'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    difficulty: string
    timeEstimate: string
    technologies: string[]
    resumeImpact: number
    slug: string
    category: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-2">
              {project.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[project.difficulty as keyof typeof difficultyColors]}`}>
            {project.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 font-medium">{project.timeEstimate}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Impact:</span>
              <div className="flex">
                {'★'.repeat(project.resumeImpact)}{'☆'.repeat(5-project.resumeImpact)}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <Link
          href={`/projects/${project.slug}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Start Building →
        </Link>
      </div>
    </div>
  )
}