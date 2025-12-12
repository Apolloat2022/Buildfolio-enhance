"use client"
import { useState, useEffect } from 'react'
import GitHubSubmission from './GitHubSubmission'
import ShowcasePrompt from './ShowcasePrompt'
import DownloadCertificateButton from './DownloadCertificateButton'

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

export default function ProjectCompletionFlow({
  projectId,
  projectSlug,
  projectTitle,
  userId,
  progress,
  githubRepoUrl,
  showcaseSubmitted,
  certificateEligible
}: ProjectCompletionFlowProps) {
  const [currentGithubUrl, setCurrentGithubUrl] = useState(githubRepoUrl)
  const [currentShowcaseSubmitted, setCurrentShowcaseSubmitted] = useState(showcaseSubmitted)

  // Not 100% complete yet
  if (progress < 100) {
    return null
  }

  // Show certificate if eligible
  if (certificateEligible) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-500 p-8 mb-6 text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
        <p className="text-gray-600 mb-6">
          You've completed this project and earned your certificate!
        </p>
        <DownloadCertificateButton 
          projectSlug={projectSlug}
          isCompleted={true}
        />
      </div>
    )
  }

  // Show pending approval status
  if (currentShowcaseSubmitted) {
    return (
      <div className="bg-yellow-50 rounded-lg border-2 border-yellow-500 p-6 mb-6 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h3 className="text-xl font-bold mb-2">Pending Admin Approval</h3>
        <p className="text-gray-600 mb-4">
          Your project has been submitted for review. You'll be notified once your certificate is approved!
        </p>
        <div className="text-sm text-gray-500">
          This usually takes 24-48 hours.
        </div>
      </div>
    )
  }

  // Show showcase prompt if GitHub validated
  if (currentGithubUrl) {
    return (
      <ShowcasePrompt 
        projectId={projectId}
        projectTitle={projectTitle}
      />
    )
  }

  // Show GitHub submission form
  return (
    <GitHubSubmission
      projectId={projectId}
      onSuccess={() => window.location.reload()}
    />
  )
}
