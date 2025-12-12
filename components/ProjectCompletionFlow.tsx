"use client"
import { useState } from 'react'
import GitHubSubmission from './GitHubSubmission'
import ShowcasePrompt from './ShowcasePrompt'

interface ProjectCompletionFlowProps {
  projectId: string
  projectSlug: string
  projectTitle: string
  userId: string
  progress: number
  githubRepoUrl: string | null
  showcaseSubmitted: boolean
  certificateEligible: boolean
}

export default function ProjectCompletionFlow(props: ProjectCompletionFlowProps) {
  const [currentGithubUrl, setCurrentGithubUrl] = useState(props.githubRepoUrl)
  const [currentShowcaseSubmitted, setCurrentShowcaseSubmitted] = useState(props.showcaseSubmitted)

  if (props.progress < 100) {
    return null
  }

  if (props.certificateEligible) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-500 p-8 mb-6 text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
        <p className="text-gray-600 mb-6">
          Certificate earned!
        </p>
        
          href={`/api/certificate?project=${props.projectSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Download Certificate
        </a>
      </div>
    )
  }

  if (currentShowcaseSubmitted) {
    return (
      <div className="bg-yellow-50 rounded-lg border-2 border-yellow-500 p-6 mb-6 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h3 className="text-xl font-bold mb-2">Pending Approval</h3>
        <p className="text-gray-600">Certificate coming soon!</p>
      </div>
    )
  }

  if (currentGithubUrl) {
    return (
      <ShowcasePrompt 
        projectId={props.projectId}
        projectTitle={props.projectTitle}
      />
    )
  }

  return (
    <GitHubSubmission
      projectId={props.projectId}
      onSuccess={() => window.location.reload()}
    />
  )
}
