'use client'

import { useState } from 'react'
import { showPointsToast, showStreakToast } from './ToastContainer'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
}

export default function MarkCompleteButton({ stepId, projectId, isCompleted }: MarkCompleteButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const action = isCompleted ? 'incomplete' : 'complete'
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId, action }),
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Show points toast
        if (data.pointsAwarded && data.pointsAwarded > 0) {
          showPointsToast(data.pointsAwarded, 'Great work!')
        }
        
        // Show streak toast if user maintains streak
        if (data.newStreak && data.newStreak >= 3) {
          showStreakToast(data.newStreak)
        }
        
        // Wait for toast animation then reload
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
        isCompleted 
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Saving...' : isCompleted ? '✓ Mark Incomplete' : 'Mark Complete ✨'}
    </button>
  )
}