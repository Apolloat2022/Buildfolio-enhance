// components/MarkCompleteButton_Fixed.tsx
"use client"

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import QuizModal from './QuizModal'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
  requiresQuiz?: boolean
  estimatedMinutes?: number
  timeSpentMinutes?: number
}

export default function MarkCompleteButton_Fixed({
  stepId,
  projectId,
  isCompleted,
  requiresQuiz = true,
  estimatedMinutes = 0,
  timeSpentMinutes = 0
}: MarkCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<any[] | null>(null)
  const [quizError, setQuizError] = useState<string | null>(null)
  const [loadingQuiz, setLoadingQuiz] = useState(false)

  async function markComplete(bypassQuiz = false) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId })
      })
      
      if (!response.ok) throw new Error('Failed to mark complete')
      
      window.location.reload()
    } catch (error) {
      console.error('Error marking complete:', error)
      alert('Failed to mark step as complete. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadQuiz() {
    setLoadingQuiz(true)
    setQuizError(null)
    
    try {
      console.log('Loading quiz for step:', stepId)
      
      const response = await fetch(\/api/quiz/questions?stepId=\\)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(\API Error \: \\)
      }
      
      const data = await response.json()
      console.log('Quiz API response:', data)
      
      // Validate quiz data
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid quiz data format')
      }
      
      if (data.questions.length === 0) {
        console.log('No quiz questions for this step')
        markComplete(true) // Mark complete without quiz
        return
      }
      
      setQuizQuestions(data.questions)
      setShowQuiz(true)
      
    } catch (error: any) {
      console.error('Quiz load error:', error)
      setQuizError(error.message || 'Failed to load quiz')
      
      // Show user-friendly error
      alert(\Quiz Error: \\n\nYou can still mark the step complete.\)
      
      // Option to mark complete anyway
      if (confirm('Would you like to mark this step complete anyway?')) {
        markComplete(true)
      }
    } finally {
      setLoadingQuiz(false)
    }
  }

  function handleQuizPass() {
    markComplete(false)
  }

  function handleClick() {
    if (isCompleted) return
    
    if (requiresQuiz && !showQuiz) {
      loadQuiz()
    } else {
      markComplete(false)
    }
  }

  if (isCompleted) {
    return (
      <button disabled className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
        <Check size={20} />
        Complete
      </button>
    )
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading || loadingQuiz}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading || loadingQuiz ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {loadingQuiz ? 'Loading Quiz...' : 'Marking Complete...'}
          </>
        ) : (
          'Mark Complete'
        )}
      </button>
      
      {quizError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <strong>Quiz Error:</strong> {quizError}
        </div>
      )}
      
      {showQuiz && quizQuestions && (
        <QuizModal
          stepId={stepId}
          questions={quizQuestions}
          onPass={handleQuizPass}
          onClose={() => {
            setShowQuiz(false)
            setQuizQuestions(null)
          }}
        />
      )}
    </>
  )
}
