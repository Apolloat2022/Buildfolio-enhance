"use client"
import { useState, useEffect } from 'react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string | null
}

interface QuizModalProps {
  stepId: string
  isOpen: boolean
  onClose: () => void
  onPass: () => void
}

export default function QuizModal({ stepId, isOpen, onClose, onPass }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState<Array<{questionId: string, selectedIndex: number}>>([])
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    
    async function fetchQuestions() {
      try {
        setLoading(true)
        const res = await fetch(`/api/quiz/questions?stepId=${stepId}`)
        const data = await res.json()
        
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions)
          console.log(`📚 Loaded ${data.questions.length} questions for step`)
        } else {
          setQuestions([])
        }
      } catch (error) {
        console.error('Failed to load quiz:', error)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuestions()
  }, [stepId, isOpen])

  if (!isOpen) return null

  if (loading) {
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-slate-800 rounded-lg p-8 border border-blue-500"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div><p className="mt-4 text-white">Loading quiz...</p></div></div>)
  }

  if (!questions || questions.length === 0) {
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-slate-800 rounded-lg p-8 max-w-md border border-blue-500"><h3 className="text-xl font-bold mb-4 text-white">No Quiz Available</h3><p className="text-gray-300 mb-4">This step doesn't have quiz questions yet.</p><button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button></div></div>)
  }

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setShowExplanation(true)
    
    const isCorrect = index === currentQuestion.correctIndex
    if (isCorrect) {
      setScore(score + 1)
    }
    
    setAnswers([...answers, { questionId: currentQuestion.id, selectedIndex: index }])
    
    console.log(`📝 Q${currentIndex + 1}: Selected ${index}, Correct: ${currentQuestion.correctIndex}, ${isCorrect ? '✅' : '❌'}`)
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
    }
  }

  const handleSubmit = async () => {
    console.log('🎓 Submitting quiz...')
    console.log(`   Score: ${score}/${totalQuestions} = ${Math.round((score / totalQuestions) * 100)}%`)
    
    setSubmitting(true)
    
    try {
      const finalScore = Math.round((score / totalQuestions) * 100)
      const passed = finalScore >= 80
      
      console.log(`📡 Submitting to API:`, { stepId, answers, score: finalScore, passed })
      
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId,
          answers,
          score: finalScore
        })
      })
      
      const data = await res.json()
      console.log('📥 Quiz API response:', data)
      
      if (passed) {
        console.log('✅ QUIZ PASSED! Calling onPass...')
        onPass()
      } else {
        console.log('❌ Quiz failed, need to retry')
        handleRetry()
      }
    } catch (error) {
      console.error('❌ Quiz submission error:', error)
      alert('Failed to submit quiz. Please try again.')
    }
    
    setSubmitting(false)
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setAnswers([])
    setScore(0)
    setCompleted(false)
  }

  if (completed) {
    const finalScore = Math.round((score / totalQuestions) * 100)
    const passed = finalScore >= 80
    
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-slate-800 rounded-lg p-8 max-w-md border-2 border-blue-500"><h3 className="text-2xl font-bold mb-4 text-white">{passed ? '🎉 Quiz Passed!' : '❌ Not Quite'}</h3><p className="text-2xl mb-4 text-white">Score: {score}/{totalQuestions} ({finalScore}%)</p><p className="text-gray-300 mb-6">{passed ? `Great job! You need 80% to pass.` : `You need ${Math.ceil(totalQuestions * 0.8)} correct to pass (80%). You got ${score}.`}</p><div className="flex gap-4">{passed ? (<button onClick={handleSubmit} disabled={submitting} className="flex-1 px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold disabled:bg-gray-600">{submitting ? 'Saving...' : 'Continue'}</button>) : (<button onClick={handleRetry} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry Quiz</button>)}<button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Close</button></div></div></div>)
  }

  return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-slate-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-500"><div className="mb-6"><div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-300">Question {currentIndex + 1} of {totalQuestions}</span><span className="text-sm text-gray-300">Score: {score}/{totalQuestions}</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all" style={{width: `${((currentIndex + 1) / totalQuestions) * 100}%`}}></div></div></div><h3 className="text-xl font-bold mb-6 text-white">{currentQuestion.question}</h3><div className="space-y-3 mb-6">{currentQuestion.options.map((option, index) => {const isSelected = selectedAnswer === index; const isCorrect = index === currentQuestion.correctIndex; const showCorrect = showExplanation && isCorrect; const showWrong = showExplanation && isSelected && !isCorrect; return (<button key={index} onClick={() => !showExplanation && handleAnswer(index)} disabled={showExplanation} className={`w-full p-4 text-left rounded-lg border-2 transition-all ${showCorrect ? 'bg-green-900/50 border-green-500 text-white' : showWrong ? 'bg-red-900/50 border-red-500 text-white' : isSelected ? 'border-blue-500 bg-slate-700 text-white' : 'border-gray-600 hover:border-blue-400 bg-slate-900 text-gray-200'} ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}>{option}</button>)})}</div>{showExplanation && currentQuestion.explanation && (<div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6"><p className="text-sm text-blue-200"><strong>Explanation:</strong> {currentQuestion.explanation}</p></div>)}<div className="flex gap-4">{showExplanation && (<button onClick={handleNext} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">{currentIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}</button>)}<button onClick={onClose} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Close</button></div></div></div>)
}
