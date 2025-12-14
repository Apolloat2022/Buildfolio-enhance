// components/MarkCompleteButton.tsx - FIXED VERSION
"use client"

import { useState, useRef, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import QuizModal to prevent SSR issues
const QuizModal = dynamic(() => import('@/components/QuizModal'), {
  ssr: false,
  loading: () => <div className="text-sm text-gray-500">Loading quiz...</div>
})

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
  requiresQuiz?: boolean
  estimatedMinutes?: number
  timeSpentMinutes?: number
}

export default function MarkCompleteButton({
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
  
  // Use refs to track state without triggering re-renders
  const isOpeningQuiz = useRef(false)
  const clickCooldown = useRef(false)

  async function markComplete(bypassQuiz = false) {
    if (isLoading) return
    
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
    // Prevent multiple simultaneous calls with ref
    if (isOpeningQuiz.current || clickCooldown.current) {
      console.log('Preventing duplicate quiz load')
      return
    }
    
    isOpeningQuiz.current = true
    clickCooldown.current = true
    
    setLoadingQuiz(true)
    setQuizError(null)
    setQuizQuestions(null)
    
    try {
      console.log('📚 Loading quiz for step:', stepId)
      
      const response = await fetch(`/api/quiz/questions?stepId=${stepId}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Quiz API response:', data)
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid quiz data format')
      }
      
      if (data.questions.length === 0) {
        console.log('No quiz questions for this step')
        setQuizError('No quiz questions available for this step.')
        return
      }
      
      // Set questions first
      setQuizQuestions(data.questions)
      
      // Small delay before showing modal
      setTimeout(() => {
        setShowQuiz(true)
      }, 50)
      
    } catch (error: any) {
      console.error('Quiz load error:', error)
      setQuizError(error.message || 'Failed to load quiz')
      
      setTimeout(() => {
        alert(`Quiz Error: ${error.message}\n\nPlease try again or contact support.`)
      }, 500)
      
    } finally {
      setLoadingQuiz(false)
      
      // Reset flags with delay
      setTimeout(() => {
        isOpeningQuiz.current = false
        clickCooldown.current = false
      }, 1000)
    }
  }

  function handleQuizPass() {
    setShowQuiz(false)
    setQuizQuestions(null)
    markComplete(false)
  }

  function handleQuizClose() {
    setShowQuiz(false)
    setQuizQuestions(null)
    setQuizError(null)
  }

  function handleClick() {
    if (isCompleted || isLoading || loadingQuiz) return
    
    // Prevent rapid double-clicks
    if (clickCooldown.current) {
      console.log('Click cooldown active')
      return
    }
    
    clickCooldown.current = true
    setTimeout(() => {
      clickCooldown.current = false
    }, 500)
    
    if (requiresQuiz && !showQuiz) {
      loadQuiz()
    } else {
      markComplete(false)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      isOpeningQuiz.current = false
      clickCooldown.current = false
    }
  }, [])

  if (isCompleted) {
    return (
      <button 
        disabled 
        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
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
      
      {quizError && !showQuiz && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
          <strong>Note:</strong> {quizError}
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                if (!clickCooldown.current) {
                  clickCooldown.current = true
                  markComplete(true)
                  setTimeout(() => { clickCooldown.current = false }, 500)
                }
              }}
              className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 disabled:opacity-50"
              disabled={clickCooldown.current}
            >
              Mark Complete Anyway
            </button>
            <button
              onClick={() => {
                if (!clickCooldown.current) {
                  loadQuiz()
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={clickCooldown.current}
            >
              Retry Quiz
            </button>
          </div>
        </div>
      )}
      
      {showQuiz && quizQuestions && (
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
