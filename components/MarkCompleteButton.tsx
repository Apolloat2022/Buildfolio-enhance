// components/MarkCompleteButton.tsx - FIXED VERSION
"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import QuizModal from "./QuizModal"

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  stepTitle: string
  stepOrder: number
  totalSteps: number
  requiresQuiz?: boolean
  isCompleted?: boolean
}

export default function MarkCompleteButton({
  stepId,
  projectId,
  stepTitle,
  stepOrder,
  totalSteps,
  requiresQuiz = true,
  isCompleted = false
}: MarkCompleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  const markComplete = async () => {
    if (requiresQuiz && !isCompleted) {
      // Show quiz modal first
      setShowQuiz(true)
      return
    }
    
    // Mark as complete directly (for steps without quiz or retry)
    await completeStep()
  }

  const completeStep = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, projectId })
      })

      if (response.ok) {
        router.refresh() // Refresh page to show updated progress
      } else {
        alert("Failed to mark step as complete")
      }
    } catch (error) {
      console.error("Error marking step complete:", error)
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
      setShowQuiz(false)
    }
  }

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      // User passed quiz, mark step complete
      completeStep()
    } else {
      // User failed quiz, keep quiz open for retry
      alert("You need to pass the quiz to complete this step. Try again!")
    }
  }

  return (
    <>
      <button
        onClick={markComplete}
        disabled={loading || isCompleted}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isCompleted
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } ${loading ? "opacity-70 cursor-wait" : ""}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : isCompleted ? (
          <>
            <CheckCircle className="h-5 w-5" />
            Completed
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            Mark Complete
            {requiresQuiz && <span className="text-sm opacity-90">(Quiz Required)</span>}
          </>
        )}
      </button>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          stepId={stepId}
          stepTitle={`${stepTitle} (Step ${stepOrder})`}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </>
  )
}
