"use client"
import { useState } from 'react'
import QuizModal from './QuizModal'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
}

export default function MarkCompleteButton({ stepId, projectId, isCompleted }: MarkCompleteButtonProps) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)

  const handleComplete = async () => {
    console.log('🎯 Mark Complete clicked, opening quiz...')
    setShowQuiz(true)
  }

  const handleQuizPass = async () => {
    console.log('✅ Quiz passed, marking step complete...')
    setLoading(true)
    try {
      const res = await fetch('/api/progress/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId })
      })
      
      if (res.ok) {
        setCompleted(true)
        setShowQuiz(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to mark complete:', error)
      alert('Failed to save progress. Please try again.')
    }
    setLoading(false)
  }

  if (completed) {
    return (<div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold text-center">✓ Completed</div>)
  }

  return (<><button onClick={handleComplete} disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold transition-all">{loading ? 'Saving...' : 'Take Quiz & Mark Complete'}</button><QuizModal stepId={stepId} isOpen={showQuiz} onClose={() => setShowQuiz(false)} onPass={handleQuizPass} /></>)
}
