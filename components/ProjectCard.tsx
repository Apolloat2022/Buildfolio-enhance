// components/ProjectCard.tsx - Updated version
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string; // Now guaranteed to be string (not null)
    difficulty: string;
    timeEstimate: string; // Now guaranteed to be string
    technologies: string[];
    resumeImpact: number; // Now guaranteed to be number
    slug: string;
    category: string; // Now guaranteed to be string
    steps: string[];
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
            <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            project.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {project.difficulty}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-700">⏱️ {project.timeEstimate}</span>
            <span className="text-gray-700">•</span>
            <span className="flex">
              {'★'.repeat(project.resumeImpact)}
              {'☆'.repeat(5 - project.resumeImpact)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {project.steps.length} steps • {project.category}
          </span>
          <a
            href={`/projects/${project.slug}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Project
          </a>
        </div>
      </div>
    </div>
  );
}