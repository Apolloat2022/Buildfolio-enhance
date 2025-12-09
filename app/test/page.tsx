// app/test/page.tsx
import { PrismaClient } from '@prisma/client'

export default async function TestPage() {
  const prisma = new PrismaClient()
  
  try {
    const count = await prisma.projectTemplate.count()
    const projects = await prisma.projectTemplate.findMany({
      select: {
        title: true,
        difficulty: true,
        category: true
      },
      take: 5
    })

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Database Test</h1>
        
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">✅ Database Connection Successful</p>
          <p className="text-green-600 mt-1">Project templates in database: {count}</p>
        </div>

        {projects.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sample Projects:</h2>
            <ul className="space-y-2">
              {projects.map((project, index) => (
                <li key={index} className="p-3 bg-white border rounded-lg">
                  <strong>{project.title}</strong>
                  <div className="text-sm text-gray-600">
                    Difficulty: {project.difficulty} | Category: {project.category}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">⚠️ No projects found in database</p>
            <p className="text-yellow-600 text-sm mt-1">
              Run: <code className="bg-gray-100 px-2 py-1 rounded">node scripts/seed-projects.js</code>
            </p>
          </div>
        )}
      </div>
    )
  } catch (error: any) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Database Error</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error Message:</p>
          <p className="text-red-600 mt-1 font-mono">{error.message}</p>
        </div>
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Check DATABASE_URL in .env file</li>
            <li>Run: <code className="bg-gray-100 px-2 py-1 rounded">npx prisma db push</code></li>
            <li>Run: <code className="bg-gray-100 px-2 py-1 rounded">npx prisma generate</code></li>
          </ol>
        </div>
      </div>
    )
  } finally {
    await prisma.$disconnect()
  }
}