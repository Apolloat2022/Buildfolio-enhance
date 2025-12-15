// components/QuizModal.tsx - SAFE VERSION (handles undefined questions)
"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Check, XCircle, HelpCircle } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
}

interface QuizModalProps {
  stepId: string
  questions?: QuizQuestion[]  // Make optional
  onPass: () => void
  onClose: () => void
}

export default function QuizModal({ stepId, questions = [], onPass, onClose }: QuizModalProps) {
  // SAFE INITIALIZATION: Handle undefined questions
  const questionsSafe = questions || []
  
  // SINGLE state for all UI state - use questionsSafe.length
  const [uiState, setUiState] = useState({
    currentQuestion: 0,
    selectedAnswers: new Array(questionsSafe.length).fill(-1),
    isSubmitted: false,
    score: 0,
    isVisible: false
  })
  
  const renderCount = useRef(0)
  const isMounted = useRef(false)
  const clickInProgress = useRef(false)

  // Update single state property helper
  const updateUiState = useCallback((updates: Partial<typeof uiState>) => {
    setUiState(prev => ({ ...prev, ...updates }))
  }, [])

  // SINGLE useEffect for all side effects
  useEffect(() => {
    if (isMounted.current) return
    
    isMounted.current = true
    
    // Prevent body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    // Add escape key listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    
    // Set visible after a frame for smooth animation
    requestAnimationFrame(() => {
      updateUiState({ isVisible: true })
    })
    
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleEscape)
      isMounted.current = false
    }
  }, [updateUiState, handleClose])

  // Auto-pass if submitted and passed - use questionsSafe.length
  useEffect(() => {
    if (uiState.isSubmitted && uiState.score >= Math.ceil(questionsSafe.length * 0.8)) {
      const timer = setTimeout(() => {
        onPass()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [uiState.isSubmitted, uiState.score, questionsSafe.length, onPass])

  // FIX: Proper click handler with event prevention
  const handleSelectAnswer = useCallback((questionIndex: number, optionIndex: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (uiState.isSubmitted || clickInProgress.current) return
    
    clickInProgress.current = true
    
    updateUiState({
      selectedAnswers: uiState.selectedAnswers.map((answer, idx) => 
        idx === questionIndex ? optionIndex : answer
      )
    })
    
    setTimeout(() => {
      clickInProgress.current = false
    }, 100)
  }, [uiState.isSubmitted, uiState.selectedAnswers, updateUiState])

  const handleSubmit = useCallback(() => {
    if (uiState.selectedAnswers.some(answer => answer === -1)) {
      alert("Please answer all questions!")
      return
    }

    let correctCount = 0
    uiState.selectedAnswers.forEach((answer, index) => {
      if (answer === questionsSafe[index]?.correctIndex) {
        correctCount++
      }
    })

    updateUiState({
      isSubmitted: true,
      score: correctCount
    })

    // Submit results - check if we have questions
    if (questionsSafe.length > 0) {
      fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId,
          answers: uiState.selectedAnswers,
          score: correctCount,
          passed: correctCount >= Math.ceil(questionsSafe.length * 0.8)
        })
      })
    }
  }, [uiState.selectedAnswers, questionsSafe, stepId, updateUiState])

  const handleClose = useCallback(() => {
    updateUiState({ isVisible: false })
    setTimeout(() => {
      onClose()
    }, 200)
  }, [onClose, updateUiState])

  const handleNext = useCallback(() => {
    if (uiState.currentQuestion < questionsSafe.length - 1) {
      updateUiState({ currentQuestion: uiState.currentQuestion + 1 })
    }
  }, [uiState.currentQuestion, questionsSafe.length, updateUiState])

  const handlePrev = useCallback(() => {
    if (uiState.currentQuestion > 0) {
      updateUiState({ currentQuestion: uiState.currentQuestion - 1 })
    }
  }, [uiState.currentQuestion, updateUiState])

  // SAFE ACCESS: Use optional chaining and nullish coalescing
  const currentQuiz = questionsSafe[uiState.currentQuestion]
  const totalQuestions = questionsSafe.length
  const passed = uiState.score >= Math.ceil(totalQuestions * 0.8)
  const allAnswered = uiState.selectedAnswers.every(answer => answer !== -1)

  // If no questions, show error state
  if (questionsSafe.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">No Quiz Available</h3>
          <p className="text-gray-600 mb-4">This quiz doesn't have any questions configured.</p>
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

  // Smooth transitions
  const opacityClass = uiState.isVisible ? 'opacity-100' : 'opacity-0'
  const scaleClass = uiState.isVisible ? 'scale-100' : 'scale-95'

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 transition-all duration-200 ${opacityClass}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transition-all duration-200 ${scaleClass}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white/95">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Step Quiz</h2>
            <p className="text-gray-700 mt-1">Answer all questions to complete this step</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {uiState.currentQuestion + 1} of {totalQuestions}
            </span>
            {uiState.isSubmitted && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {passed ? "Passed" : "Failed"} ({uiState.score}/{totalQuestions})
              </span>
            )}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((uiState.currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuiz?.question || "No question available"}
            </h3>
            
            <div className="space-y-3">
              {currentQuiz?.options?.map((option, optionIndex) => {
                const isSelected = uiState.selectedAnswers[uiState.currentQuestion] === optionIndex
                const isCorrect = optionIndex === currentQuiz.correctIndex
                const showResults = uiState.isSubmitted
                
                let buttonClasses = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 "
                let circleClasses = "flex-shrink-0 w-6 h-6 rounded-full border-2 mt-0.5 mr-3 flex items-center justify-center "
                let textClasses = "font-medium "
                
                if (showResults) {
                  if (isCorrect) {
                    buttonClasses += "border-green-500 bg-green-50 "
                    circleClasses += "border-green-600 bg-green-600 "
                    textClasses += "text-green-900"
                  } else if (isSelected && !isCorrect) {
                    buttonClasses += "border-red-500 bg-red-50 "
                    circleClasses += "border-red-600 bg-red-600 "
                    textClasses += "text-red-900"
                  } else {
                    buttonClasses += "border-gray-200 bg-gray-50 "
                    circleClasses += "border-gray-300 "
                    textClasses += "text-gray-700"
                  }
                } else if (isSelected) {
                  buttonClasses += "border-blue-500 bg-blue-50 "
                  circleClasses += "border-blue-600 bg-blue-600 "
                  textClasses += "text-blue-900"
                } else {
                  buttonClasses += "border-gray-200 hover:border-gray-300 hover:bg-gray-50 "
                  circleClasses += "border-gray-300 "
                  textClasses += "text-gray-800"
                }
                
                buttonClasses += uiState.isSubmitted ? "cursor-default" : "cursor-pointer"
                
                return (
                  <div key={optionIndex} className="relative">
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => handleSelectAnswer(uiState.currentQuestion, optionIndex, e)}
                      disabled={uiState.isSubmitted || clickInProgress.current}
                      className={`${buttonClasses} select-none active:scale-[0.99]`}
                    >
                      <div className="flex items-start">
                        <div className={circleClasses}>
                          {showResults && isCorrect && <Check size={14} className="text-white" />}
                          {showResults && isSelected && !isCorrect && <XCircle size={14} className="text-white" />}
                        </div>
                        <span className={textClasses}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                          {option}
                        </span>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {uiState.isSubmitted && currentQuiz?.explanation && (
            <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start">
                <HelpCircle className="flex-shrink-0 w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
                  <p className="text-blue-800 font-medium">{currentQuiz.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-3">
              <button
                onClick={handlePrev}
                disabled={uiState.currentQuestion === 0}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:text-gray-400 font-medium"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={uiState.currentQuestion === totalQuestions - 1}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:text-gray-400 font-medium"
              >
                Next
              </button>
            </div>

            <div className="flex space-x-3">
              {!uiState.isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    allAnswered
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit Quiz
                </button>
              ) : passed ? (
                <div className="text-green-800 font-semibold">
                  ✅ Quiz Passed! Marking as complete...
                </div>
              ) : (
                <button
                  onClick={() => {
                    updateUiState({
                      currentQuestion: 0,
                      selectedAnswers: new Array(questionsSafe.length).fill(-1),
                      isSubmitted: false,
                      score: 0
                    })
                  }}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
