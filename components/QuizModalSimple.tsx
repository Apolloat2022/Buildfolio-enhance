// components/QuizModalSimple.tsx - NO HYDRATION ISSUES
"use client"

import { useState, useEffect } from 'react'

export default function QuizModalSimple({ questions = [], onClose, onPass }: any) {
  const [isClient, setIsClient] = useState(false)
  const [selected, setSelected] = useState(-1)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <h3 className="text-xl font-bold mb-4">No Quiz Available</h3>
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    )
  }
  
  const question = questions[0]
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Step Quiz</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`w-full p-4 text-left rounded-lg border ${
                selected === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => {
            if (selected === question.correctIndex) {
              alert('✅ Correct! Marking as complete...')
              setTimeout(onPass, 1000)
            } else {
              alert('❌ Incorrect. Try again!')
            }
          }}
          disabled={selected === -1}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
