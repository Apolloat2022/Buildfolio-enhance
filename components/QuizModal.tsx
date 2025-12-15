// components/QuizModal.tsx - SIMPLE NO-HYDRATION VERSION
"use client"

import { useState, useEffect } from 'react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
}

interface QuizModalProps {
  stepId: string
  questions?: QuizQuestion[]
  onPass: () => void
  onClose: () => void
}

export default function QuizModal({ stepId, questions = [], onPass, onClose }: QuizModalProps) {
  // Client-only rendering - return null on server
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Don't render anything on server
  if (!isClient) {
    return null
  }
  
  // If no questions, show simple message
  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">No Quiz Available</h3>
          <p className="text-gray-600 mb-4">This step doesn't have a quiz yet.</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }
  
  // For now, show a basic quiz - we'll add full functionality later
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Step Quiz</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {questions[0]?.question || "Quiz Question"}
          </h3>
          
          <div className="space-y-3">
            {questions[0]?.options?.map((option, index) => (
              <button
                key={index}
                className="w-full p-4 text-left rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                onClick={() => {
                  if (index === questions[0].correctIndex) {
                    alert("Correct! Marking as complete...")
                    setTimeout(() => {
                      onPass()
                    }, 1000)
                  } else {
                    alert("Incorrect. Try again!")
                  }
                }}
              >
                <span className="font-medium text-gray-900">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>This is a simplified quiz. Full functionality will be restored after fixing hydration issues.</p>
        </div>
      </div>
    </div>
  )
}
