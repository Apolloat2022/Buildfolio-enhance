// Save this as: components/TechnologyBadge.tsx
interface TechnologyBadgeProps {
  technology: string
}

export default function TechnologyBadge({ technology }: TechnologyBadgeProps) {
  const colors: Record<string, string> = {
    'Next.js': 'bg-black text-white',
    'TypeScript': 'bg-blue-600 text-white',
    'Tailwind': 'bg-cyan-500 text-white',
    'Prisma': 'bg-purple-600 text-white',
    'Stripe': 'bg-indigo-500 text-white',
    'React': 'bg-blue-400 text-white',
    'Node.js': 'bg-green-600 text-white',
    'Socket.io': 'bg-black text-white',
    'MongoDB': 'bg-green-700 text-white',
    'Redis': 'bg-red-600 text-white',
    'CSS': 'bg-pink-500 text-white',
    'LocalStorage': 'bg-gray-600 text-white',
    'Drag & Drop API': 'bg-orange-500 text-white',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[technology] || 'bg-gray-200 text-gray-800'}`}>
      {technology}
    </span>
  )
}