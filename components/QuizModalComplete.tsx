// components/QuizModalComplete.tsx - FULL FEATURES
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
  questions: QuizQuestion[]
  onPass: () => void
  onClose: () => void
}

export default function QuizModalComplete({ stepId, questions, onPass, onClose }: QuizModalProps) {
  const [isClient, setIsClient] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Initialize
  useEffect(() => {
    setIsClient(true)
    setSelectedAnswers(new Array(questions.length).fill(-1))
  }, [questions.length])
  
  // Don't render on server
  if (!isClient) return null
  
  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults || isSubmitted) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = optionIndex
    setSelectedAnswers(newAnswers)
  }
  
  const calculateScore = () => {
    let correct = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctIndex) {
        correct++
      }
    })
    return correct
  }
  
  const handleSubmit = () => {
    // Check if all questions answered
    if (selectedAnswers.some(answer => answer === -1)) {
      alert('Please answer all questions before submitting!')
      return
    }
    
    const correctCount = calculateScore()
    const totalQuestions = questions.length
    const percentage = (correctCount / totalQuestions) * 100
    
    setScore(correctCount)
    setShowResults(true)
    
    // Submit to server
    fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stepId,
        answers: selectedAnswers,
        score: correctCount,
        totalQuestions,
        passed: percentage >= 80
      })
    }).catch(err => console.error('Submit error:', err))
    
    // Show results for 3 seconds, then act
    setTimeout(() => {
      setIsSubmitted(true)
      
      if (percentage >= 80) {
        alert(`🎉 Quiz Passed! ${correctCount}/${totalQuestions} (${percentage.toFixed(0)}%)`)
        onPass() // Mark step as complete
      } else {
        alert(`❌ Not enough to pass: ${correctCount}/${totalQuestions} (${percentage.toFixed(0)}%)\nNeed 80% or higher to pass.`)
      }
    }, 3000)
  }
  
  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(-1))
    setShowResults(false)
    setScore(0)
    setIsSubmitted(false)
  }
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }
  
  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }
  
  const currentQuiz = questions[currentQuestion]
  const totalQuestions = questions.length
  const allAnswered = selectedAnswers.every(answer => answer !== -1)
  const isSelected = selectedAnswers[currentQuestion] !== -1
  const selectedOption = selectedAnswers[currentQuestion]
  const isCorrect = selectedOption === currentQuiz.correctIndex
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Step Quiz</h2>
            <p className="text-gray-700">
              Question {currentQuestion + 1} of {totalQuestions}
              {showResults && ` | Score: ${score}/${totalQuestions}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            disabled={isSubmitted}
          >
            ✕
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQuiz.question}
          </h3>
          
          {/* Options */}
          <div className="space-y-3">
            {currentQuiz.options.map((option, index) => {
              const isSelectedOption = selectedAnswers[currentQuestion] === index
              const isCorrectOption = index === currentQuiz.correctIndex
              
              let optionClass = "w-full p-4 text-left rounded-lg border-2 transition-all "
              
              if (showResults) {
                if (isCorrectOption) {
                  optionClass += "border-green-500 bg-green-50 "
                } else if (isSelectedOption && !isCorrectOption) {
                  optionClass += "border-red-500 bg-red-50 "
                } else {
                  optionClass += "border-gray-200 bg-gray-50 "
                }
              } else if (isSelectedOption) {
                optionClass += "border-blue-500 bg-blue-50 "
              } else {
                optionClass += "border-gray-300 hover:border-gray-400 "
              }
              
              optionClass += isSubmitted ? "cursor-default" : "cursor-pointer"
              
              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(currentQuestion, index)}
                  disabled={showResults || isSubmitted}
                  className={optionClass}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      isSelectedOption ? "border-blue-600 bg-blue-600" : "border-gray-300"
                    }`}>
                      {showResults && isCorrectOption && (
                        <span className="text-white text-sm">✓</span>
                      )}
                      {showResults && isSelectedOption && !isCorrectOption && (
                        <span className="text-white text-sm">✗</span>
                      )}
                    </div>
                    <span className={`font-medium ${
                      showResults && isCorrectOption ? "text-green-900" :
                      showResults && isSelectedOption ? "text-red-900" :
                      "text-gray-900"
                    }`}>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Explanation (after submission) */}
        {showResults && currentQuiz.explanation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
            <p className="text-blue-800">{currentQuiz.explanation}</p>
          </div>
        )}
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex space-x-3">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0 || isSubmitted}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion === totalQuestions - 1 || isSubmitted}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:text-gray-400"
            >
              Next
            </button>
          </div>
          
          <div className="flex space-x-3">
            {!isSubmitted ? (
              <>
                {showResults ? (
                  <div className="text-gray-700 font-medium">
                    Calculating results...
                  </div>
                ) : (
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
                )}
              </>
            ) : score >= Math.ceil(totalQuestions * 0.8) ? (
              <div className="text-green-700 font-semibold">
                ✅ Quiz Passed! Step will be marked complete...
              </div>
            ) : (
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
        
        {/* Score display */}
        {showResults && (
          <div className="mt-4 text-center">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
              <span className="font-semibold">
                Score: {score}/{totalQuestions} (
                {((score / totalQuestions) * 100).toFixed(0)}%)
              </span>
              <span className="ml-4">
                {score >= Math.ceil(totalQuestions * 0.8) 
                  ? "✅ Passing (80%+ required)" 
                  : "❌ Needs retry (80%+ required)"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
