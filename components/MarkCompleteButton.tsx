'use client'
import { useState } from 'react'
import { showPointsToast, showStreakToast } from './ToastContainer'
import QuizModal from './QuizModal'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
  requiresQuiz?: boolean
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
}

export default function MarkCompleteButton({ 
  stepId, 
  projectId, 
  isCompleted,
  requiresQuiz = true 
}: MarkCompleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(false)

  const handleClick = async () => {
    // If marking as incomplete, just do it directly
    if (isCompleted) {
      markComplete(false)
      return
    }

    // If marking as complete and quiz required, show quiz first
    if (requiresQuiz) {
      await loadQuiz()
    } else {
      // No quiz required, mark complete directly
      markComplete(true)
    }
  }

  const loadQuiz = async () => {
    setLoadingQuiz(true)
    try {
      const response = await fetch(`/api/quiz/questions?stepId=${stepId}`)
      const data = await response.json()
      
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions)
        setShowQuiz(true)
      } else {
        // No quiz questions, mark complete directly
        console.log('No quiz questions found, marking complete')
        markComplete(true)
      }
    } catch (error) {
      console.error('Failed to load quiz:', error)
      // On error, allow completion without quiz
      markComplete(true)
    } finally {
      setLoadingQuiz(false)
    }
  }

  const markComplete = async (complete: boolean) => {
    console.log('Marking step:', { stepId, projectId, complete })
    setLoading(true)
    const action = complete ? 'complete' : 'incomplete'

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId, action }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)

        // Show points toast
        if (data.pointsAwarded && data.pointsAwarded > 0) {
          console.log('Showing points toast:', data.pointsAwarded)
          showPointsToast(data.pointsAwarded, 'Great work!')
        }

        // Show streak toast
        if (data.newStreak && data.newStreak >= 3) {
          console.log('Showing streak toast:', data.newStreak)
          showStreakToast(data.newStreak)
        }

        // Wait for toast then reload
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      } else {
        console.error('API error:', response.status)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const handleQuizPass = () => {
    setShowQuiz(false)
    markComplete(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || loadingQuiz}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          isCompleted
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading || loadingQuiz ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingQuiz ? 'Loading Quiz...' : 'Saving...'}
          </span>
        ) : isCompleted ? (
          '✓ Completed'
        ) : (
          'Mark Complete'
        )}
      </button>

      {showQuiz && (
        <QuizModal
          stepId={stepId}
          questions={quizQuestions}
          onPass={handleQuizPass}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </>
  )
}
