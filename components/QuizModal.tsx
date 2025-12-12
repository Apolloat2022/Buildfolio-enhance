"use client"
import { useState } from 'react'
import { X } from 'lucide-react'

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

export default function QuizModal({ stepId, questions, onPass, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate score
      const correct = selectedAnswers.filter((answer, idx) => answer === questions[idx].correctIndex).length
      const percentage = Math.round((correct / questions.length) * 100)
      setScore(percentage)
      setShowResults(true)
      
      // Submit to API
      submitQuiz(percentage)
    }
  }

  const submitQuiz = async (percentage: number) => {
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId,
          answers: selectedAnswers,
          score: percentage,
          timeSpent: 0 // We'll add timing later
        })
      })
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(-1))
    setShowResults(false)
    setScore(0)
  }

  const handleContinue = () => {
    if (score >= 80) {
      onPass()
    }
    onClose()
  }

  if (showResults) {
    const passed = score >= 80
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
            <h2 className="text-3xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored <span className="font-bold text-blue-600">{score}%</span>
            </p>
            
            {passed ? (
              <p className="text-gray-600 mb-8">
                Great job! You can now mark this step as complete.
              </p>
            ) : (
              <p className="text-gray-600 mb-8">
                You need 80% or higher to pass. Review the material and try again!
              </p>
            )}

            {/* Review Answers */}
            <div className="text-left mb-8 max-h-96 overflow-y-auto">
              <h3 className="font-bold mb-4">Review Your Answers:</h3>
              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[idx]
                const isCorrect = userAnswer === q.correctIndex
                return (
                  <div key={q.id} className="mb-6 p-4 border rounded-lg">
                    <p className="font-semibold mb-2">Q{idx + 1}: {q.question}</p>
                    <p className={`mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✅' : '❌'} Your answer: {q.options[userAnswer] || 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600 mb-2">
                        ✓ Correct answer: {q.options[q.correctIndex]}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-sm text-gray-600 italic">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4 justify-center">
              {!passed && (
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {passed ? 'Continue' : 'Review Material'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Quick Knowledge Check</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === idx
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswer === -1}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
