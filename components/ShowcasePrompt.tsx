"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

interface ShowcasePromptProps {
  projectId: string
  projectTitle: string
}

export default function ShowcasePrompt({ projectId, projectTitle }: ShowcasePromptProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const handleCreateShowcase = () => {
    // Redirect to showcase creation with project pre-filled
    router.push(`/showcase/new?projectId=${projectId}`)
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-500 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold">Share Your Work!</h3>
      </div>

      <p className="text-gray-700 mb-4">
        Awesome! Your code is validated. Now it's time to showcase your project to the community!
      </p>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2">What you'll add:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Project description and key features</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Screenshots of your working application</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Links to GitHub and live demo (optional)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Technologies used and lessons learned</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Required:</strong> You must submit your project to the showcase to earn your certificate. 
          This helps build your public portfolio and proves your work to potential employers.
        </p>
      </div>

      <button
        onClick={handleCreateShowcase}
        disabled={submitting}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Sparkles className="w-5 h-5" />
        Create Showcase Submission
      </button>
    </div>
  )
}
