"use client"
import { useState } from 'react'

interface AIHelperProps {
  stepId: string
  stepTitle: string
}

export default function AIHelper({ stepId, stepTitle }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const askQuestion = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    setError('')
    setAnswer('')
    
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, stepId })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to get response')
        return
      }
      
      setAnswer(data.answer)
    } catch (err) {
      setError('Sorry, something went wrong. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askQuestion()
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-24 right-8 z-40 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 font-semibold flex items-center gap-2 animate-bounce hover:animate-none transition-all">
        🤖 Ask AI Tutor
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-8 z-40 w-96 bg-white rounded-lg shadow-2xl border-2 border-blue-500">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center"><div><h3 className="font-bold">🤖 AI Tutor</h3><p className="text-xs opacity-90">{stepTitle}</p></div><button onClick={() => setIsOpen(false)} className="text-2xl hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full">×</button></div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        {answer && (<div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500"><div className="text-sm text-gray-800 whitespace-pre-wrap">{answer}</div><button onClick={() => { setAnswer(''); setQuestion(''); }} className="text-xs text-blue-600 mt-2 hover:underline">Ask another question</button></div>)}
        
        {error && (<div className="bg-red-50 p-3 rounded-lg mb-4 border-l-4 border-red-500 text-sm text-red-700">{error}</div>)}
        
        {!answer && (<div><textarea value={question} onChange={(e) => setQuestion(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask me anything about this step...

Examples:
- Why use this approach?
- How does this code work?
- What's a better way to do this?" className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} /><button onClick={askQuestion} disabled={loading || !question.trim()} className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold flex items-center justify-center gap-2">{loading ? (<><span className="animate-spin">⏳</span> Thinking...</>) : '🚀 Ask AI Tutor'}</button></div>)}
        
        <div className="mt-3 pt-3 border-t text-center"><p className="text-xs text-gray-500">💡 Free AI-powered help</p><p className="text-xs text-gray-400 mt-1">Press Enter to send • Shift+Enter for new line</p></div>
      </div>
    </div>
  )
}
