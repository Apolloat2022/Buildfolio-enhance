"use client"
import { useState } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface GitHubSubmissionProps {
  projectId: string
  onSuccess: () => void
}

interface ValidationResult {
  valid: boolean
  repoName?: string
  commits?: number
  lastCommit?: string
  hasPackageJson?: boolean
  error?: string
}

export default function GitHubSubmission({ projectId, onSuccess }: GitHubSubmissionProps) {
  const [githubUrl, setGithubUrl] = useState('')
  const [validating, setValidating] = useState(false)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleValidate = async () => {
    if (!githubUrl.trim()) {
      setValidation({ valid: false, error: 'Please enter a GitHub URL' })
      return
    }

    setValidating(true)
    setValidation(null)

    try {
      const response = await fetch('/api/github/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl })
      })

      const data = await response.json()
      setValidation(data)

    } catch (error) {
      setValidation({ 
        valid: false, 
        error: 'Failed to validate repository. Please try again.' 
      })
    } finally {
      setValidating(false)
    }
  }

  const handleSubmit = async () => {
    if (!validation?.valid) return

    setSubmitting(true)

    try {
      const response = await fetch('/api/project/submit-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId, 
          githubUrl 
        })
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert('Failed to submit repository')
      }
    } catch (error) {
      alert('Error submitting repository')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-blue-500 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💻</span>
        <h3 className="text-xl font-bold">Submit Your Code</h3>
      </div>

      <p className="text-gray-600 mb-4">
        Great job completing all the steps! Now submit your GitHub repository to proceed.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository URL
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value)
              setValidation(null)
            }}
            placeholder="https://github.com/username/repo-name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Example: https://github.com/yourusername/ecommerce-store
          </p>
        </div>

        {/* Validation Result */}
        {validation && (
          <div className={`p-4 rounded-lg ${
            validation.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {validation.valid ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Repository Validated!
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>✓ Repository: {validation.repoName}</p>
                  {validation.commits && <p>✓ Commits: {validation.commits}</p>}
                  {validation.lastCommit && (
                    <p>✓ Last commit: {new Date(validation.lastCommit).toLocaleDateString()}</p>
                  )}
                  {validation.hasPackageJson && <p>✓ Contains package.json</p>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="w-5 h-5" />
                {validation.error}
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleValidate}
            disabled={validating || !githubUrl.trim()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {validating && <Loader2 className="w-4 h-4 animate-spin" />}
            {validating ? 'Validating...' : 'Validate Repository'}
          </button>

          {validation?.valid && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit & Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
