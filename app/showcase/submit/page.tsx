import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import ShowcaseSubmitForm from '@/components/ShowcaseSubmitForm'
import Link from 'next/link'

export default async function ShowcaseSubmitPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin?callbackUrl=/showcase/submit')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/showcase" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Showcase
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Submit Your Project</h1>
          <p className="text-gray-600 mt-2">
            Share your completed project with the community and inspire others!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <ShowcaseSubmitForm />
      </div>
    </div>
  )
}