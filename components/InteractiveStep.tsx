// components/InteractiveStep.tsx
'use client'

import { useState } from 'react'
import CodeSnippet from './CodeSnippet'

interface InteractiveStepProps {
  stepNumber: number
  title: string
  description: string
  codeSnippets?: Array<{ language: string; code: string }>
  pitfalls?: string[]
  estimatedTime: string
}

export default function InteractiveStep({
  stepNumber,
  title,
  description,
  codeSnippets = [],
  pitfalls = [],
  estimatedTime
}: InteractiveStepProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCode, setShowCode] = useState(false)

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 ${isCompleted ? 'border-green-200' : 'border-gray-200'} p-6 mb-6`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {stepNumber}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-2">{description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {estimatedTime}
              </span>
              {codeSnippets.length > 0 && (
                <button 
                  onClick={() => setShowCode(!showCode)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  {showCode ? 'Hide Code' : 'View Code'}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCode ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsCompleted(!isCompleted)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isCompleted ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          {isCompleted ? (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed
            </>
          ) : 'Mark Complete'}
        </button>
      </div>

      {/* Code Snippets */}
      {showCode && codeSnippets.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code Examples
          </h4>
          <div className="space-y-4">
            {codeSnippets.map((snippet, index) => (
              <CodeSnippet
                key={index}
                language={snippet.language}
                code={snippet.code}
              />
            ))}
          </div>
        </div>
      )}

      {/* Common Pitfalls */}
      {pitfalls.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Common Pitfalls to Avoid
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {pitfalls.map((pitfall, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Code
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Ask for Help
        </button>
      </div>
    </div>
  )
}