import ShowcaseGallery from '@/components/ShowcaseGallery'
import { auth } from '@/app/auth'
import Link from 'next/link'

export default async function ShowcasePage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-3">Project Showcase</h1>
          <p className="text-lg text-white/90 mb-6">
            See what our community has built and get inspired for your next project!
          </p>
          {session && (
            <Link
              href="/showcase/submit"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all"
            >
              Submit Your Project
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <ShowcaseGallery isAuthenticated={!!session} />
      </div>
    </div>
  )
}