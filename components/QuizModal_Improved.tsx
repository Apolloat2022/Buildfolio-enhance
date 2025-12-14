// components/QuizModal_Improved.tsx
"use client"

import { useState, useEffect } from 'react'
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
  questions: QuizQuestion[]
  onPass: () => void
  onClose: () => void
}

export default function QuizModal_Improved({ stepId, questions, onPass, onClose }: QuizModalProps) {
  // CRITICAL: Add a stable mount state to prevent initial flicker
  const [isMounted, setIsMounted] = useState(false)
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  
  // Only set mounted after component is stable
  useEffect(() => {
    setIsMounted(true)
    
    // Cleanup on unmount
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  // Safety check - if no questions, show error
  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quiz Available</h3>
            <p className="text-gray-600 mb-4">
              This step doesn&apos;t have quiz questions configured yet.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Close Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  function handleSelectAnswer(questionIndex: number, optionIndex: number) {
    if (isSubmitted) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  function handleSubmit() {
    if (selectedAnswers.some(answer => answer === -1)) {
      alert("Please answer all questions before submitting!")
      return
    }

    let correctCount = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctIndex) {
        correctCount++
      }
    })

    setScore(correctCount)
    setIsSubmitted(true)

    // Submit results to server
    fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stepId,
        answers: selectedAnswers,
        score: correctCount,
        passed: correctCount >= Math.ceil(questions.length * 0.8)
      })
    }).then(response => {
      if (response.ok) {
        console.log("Quiz results submitted")
      }
    })
  }

  function handleReset() {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(-1))
    setIsSubmitted(false)
    setScore(0)
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  function handlePrev() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const currentQuiz = questions[currentQuestion]
  const totalQuestions = questions.length
  const passed = score >= Math.ceil(totalQuestions * 0.8)
  const allAnswered = selectedAnswers.every(answer => answer !== -1)

  // If user passed and this is after submission, call onPass
  if (isSubmitted && passed && onPass) {
    setTimeout(() => {
      onPass()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white/95">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Step Quiz</h2>
            <p className="text-gray-700 mt-1">Answer all questions to complete this step</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            {isSubmitted && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {passed ? "Passed" : "Failed"} ({score}/{totalQuestions})
              </span>
            )}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">
              {currentQuiz?.question}
            </h3>
            
            {/* Options */}
            <div className="space-y-3">
              {currentQuiz?.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[currentQuestion] === optionIndex
                const isCorrect = optionIndex === currentQuiz.correctIndex
                const showResults = isSubmitted
                
                let optionStyle = "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                let textStyle = "text-gray-800"
                
                if (showResults) {
                  if (isCorrect) {
                    optionStyle = "border-green-500 bg-green-50"
                    textStyle = "text-green-900"
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-red-500 bg-red-50"
                    textStyle = "text-red-900"
                  } else {
                    optionStyle = "border-gray-200 bg-gray-50"
                    textStyle = "text-gray-600"
                  }
                } else if (isSelected) {
                  optionStyle = "border-blue-500 bg-blue-50"
                  textStyle = "text-blue-900"
                }
                
                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleSelectAnswer(currentQuestion, optionIndex)}
                    disabled={isSubmitted}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${optionStyle} ${!isSubmitted ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-0.5 mr-3 flex items-center justify-center ${
                        isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      }`}>
                        {showResults && isCorrect && (
                          <Check size={14} className="text-white" />
                        )}
                        {showResults && isSelected && !isCorrect && (
                          <XCircle size={14} className="text-white" />
                        )}
                      </div>
                      <div>
                        <span className={`font-medium ${textStyle}`}>
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation (shown after submission) */}
          {isSubmitted && currentQuiz?.explanation && (
            <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start">
                <HelpCircle className="flex-shrink-0 w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
                  <p className="text-blue-800">{currentQuiz.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-3">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentQuestion === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestion === totalQuestions - 1}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentQuestion === totalQuestions - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>

            <div className="flex space-x-3">
              {!isSubmitted ? (
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
              ) : (
                <>
                  {passed ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-green-700 font-semibold">
                        ✅ Quiz Passed! Step will be marked complete...
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
