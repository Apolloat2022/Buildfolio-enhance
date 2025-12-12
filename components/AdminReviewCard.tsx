"use client"
import { useState } from 'react'
import { ExternalLink, Github, Award, Clock, Target } from 'lucide-react'
import Link from 'next/link'

interface QuizScore {
  stepOrder: number
  stepTitle: string
  score: number
  attempts: number
}

interface Submission {
  id: string
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  projectTemplate: {
    title: string
    technologies: string[]
  }
  showcase: {
    id: string
    title: string
    liveUrl: string | null
  } | null
  githubRepoUrl: string | null
  timeSpentMinutes: number
  quizScores: QuizScore[]
  averageScore: number
}

interface AdminReviewCardProps {
  submission: Submission
}

export default function AdminReviewCard({ submission }: AdminReviewCardProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    if (!confirm('Approve this certificate? The user will be able to download it.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/approve-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startedProjectId: submission.id,
          approved: true,
          notes
        })
      })

      if (response.ok) {
        alert('Certificate approved! ??')
        window.location.reload()
      } else {
        alert('Failed to approve certificate')
      }
    } catch (error) {
      alert('Error approving certificate')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/approve-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startedProjectId: submission.id,
          approved: false,
          notes: reason
        })
      })

      if (response.ok) {
        alert('Submission rejected. User has been notified.')
        window.location.reload()
      } else {
        alert('Failed to reject submission')
      }
    } catch (error) {
      alert('Error rejecting submission')
    } finally {
      setLoading(false)
    }
  }


  const estimatedHours = Math.round(submission.timeSpentMinutes / 60)

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">
              {submission.user.name || submission.user.email}
            </h3>
            <p className="text-gray-600">{submission.projectTemplate.title}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{submission.averageScore}%</div>
            <div className="text-sm text-gray-500">Avg Quiz Score</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Quiz Scores */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Quiz Performance
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {submission.quizScores.map((score) => (
              <div key={score.stepOrder} className="bg-gray-50 rounded p-3">
                <div className="text-xs text-gray-500 mb-1">Step {score.stepOrder}</div>
                <div className={`text-lg font-bold ${
                  score.score >= 80 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {score.score}%
                </div>
                <div className="text-xs text-gray-500">{score.attempts} attempt{score.attempts !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Spent */}
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Time Spent: <strong>{estimatedHours} hours</strong></span>
        </div>

        {/* Technologies */}
        <div>
          <h4 className="font-semibold mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {submission.projectTemplate.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {submission.githubRepoUrl && (
            
              href={submission.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <Github className="w-4 h-4" />
              View GitHub Repo
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
          )}
          
          {submission.showcase && (
            <Link
              href={`/showcase/${submission.showcase.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Award className="w-4 h-4" />
              View Showcase
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Link>
          )}
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes or feedback..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
          >
            Request Changes
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
          >
            ? Approve Certificate
          </button>
        </div>
      </div>
    </div>
  )
}


