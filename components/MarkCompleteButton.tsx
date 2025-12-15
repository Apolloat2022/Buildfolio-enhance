// components/MarkCompleteButton.tsx - ENSURING IT WORKS
"use client"

import { useState, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import QuizModal from './QuizModal'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
  requiresQuiz?: boolean
}

export default function MarkCompleteButton({
  stepId,
  projectId,
  isCompleted,
  requiresQuiz = true
}: MarkCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function markComplete() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to mark complete')
      }
      
      // Success - reload to update UI
      window.location.reload()
      
    } catch (error: any) {
      console.error('Error:', error)
      alert(`❌ Failed: ${error.message}`)
      setIsLoading(false)
    }
  }

  async function loadQuiz() {
    setLoadingQuiz(true)
    
    try {
      console.log('Loading quiz for step:', stepId)
      const response = await fetch(`/api/quiz/questions?stepId=${stepId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load quiz: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Quiz data received:', data)
      
      if (!data.questions || data.questions.length === 0) {
        alert('No quiz questions found. Marking as complete.')
        markComplete()
        return
      }
      
      setQuizQuestions(data.questions)
      setShowQuiz(true)
      
    } catch (error: any) {
      console.error('Quiz error:', error)
      alert(`Quiz Error: ${error.message}\n\nMarking as complete anyway.`)
      markComplete()
    } finally {
      setLoadingQuiz(false)
    }
  }

  function handleClick() {
    if (isCompleted) return
    
    if (requiresQuiz) {
      loadQuiz()
    } else {
      markComplete()
    }
  }

  function handleQuizPass() {
    setShowQuiz(false)
    markComplete()
  }

  function handleQuizClose() {
    setShowQuiz(false)
  }

  if (!mounted) {
    return (
      <button disabled className="w-full py-3 px-4 bg-gray-400 text-white rounded-lg">
        <Loader2 className="animate-spin inline mr-2" size={20} />
        Loading...
      </button>
    )
  }

  if (isCompleted) {
    return (
      <button disabled className="w-full py-3 px-4 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
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
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading || loadingQuiz ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {loadingQuiz ? 'Loading Quiz...' : 'Processing...'}
          </>
        ) : (
          'Mark Complete'
        )}
      </button>
      
      {showQuiz && quizQuestions.length > 0 && (
        <QuizModal
          stepId={stepId}
          questions={quizQuestions}
          onPass={handleQuizPass}
          onClose={handleQuizClose}
        />
      )}
    </>
  )
}
