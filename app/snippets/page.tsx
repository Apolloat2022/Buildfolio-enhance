import SnippetLibrary from '@/components/SnippetLibrary'
import Link from 'next/link'

export default function SnippetsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Code Snippet Library</h1>
          <p className="text-gray-600 mt-2">
            Quick access to common code patterns. Click the copy button to use any snippet in your projects.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SnippetLibrary />
      </div>
    </div>
  )
}