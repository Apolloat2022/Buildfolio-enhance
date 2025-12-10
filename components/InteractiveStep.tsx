// components/InteractiveStep.tsx - FIXED VERSION
'use client'

import { useState } from 'react'

interface InteractiveStepProps {
  stepNumber: number
  title: string
  description: string
  codeSnippets?: Array<{ language: string; code: string }>
  pitfalls?: string[]
  estimatedTime: string
  stepId: string
  projectId: string
  isCompleted: boolean
  onMarkComplete?: (stepId: string, projectId: string, isCompleted: boolean) => Promise<void>
}

export default function InteractiveStep({
  stepNumber,
  title,
  description,
  codeSnippets = [],
  pitfalls = [],
  estimatedTime,
  stepId,
  projectId,
  isCompleted = false,
  onMarkComplete
}: InteractiveStepProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!onMarkComplete) return
    
    try {
      setLoading(true)
      await onMarkComplete(stepId, projectId, !isCompleted)
    } catch (error) {
      console.error('Failed to update progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {stepNumber}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
        {onMarkComplete && (
          <button
            onClick={handleClick}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium ${
              isCompleted 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : isCompleted ? '✓ Completed' : 'Mark Complete'}
          </button>
        )}
      </div>
      
      {Array.isArray(codeSnippets) && codeSnippets.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-gray-800 mb-2">Code Example:</h4>
          {codeSnippets.map((snippet, index) => (
            <div key={index} className="mb-3">
              <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded-t text-sm">
                {snippet.language}
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-b overflow-x-auto text-sm">
                {snippet.code}
              </pre>
            </div>
          ))}
        </div>
      )}
      
      {Array.isArray(pitfalls) && pitfalls.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-red-700 mb-2">⚠️ Common Pitfalls:</h4>
          <ul className="list-disc pl-5 text-gray-700">
            {pitfalls.map((pitfall, index) => (
              <li key={index}>{pitfall}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        ⏱️ Estimated time: {estimatedTime}
      </div>
    </div>
  )
}
