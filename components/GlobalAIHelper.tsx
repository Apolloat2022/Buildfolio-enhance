"use client"
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function GlobalAIHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  
  // Only show on project pages
  const isProjectPage = pathname?.includes('/projects/')
  
  if (!isProjectPage) return null

  const askQuestion = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          stepId: "general" // Temporary - we can make this dynamic later
        })
      })
      
      const data = await res.json()
      setAnswer(data.answer)
    } catch (error) {
      setAnswer('Sorry, I had trouble answering that. Please try again!')
    }
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-24 right-8 z-40 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 font-semibold animate-bounce">
        ?? Ask AI
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-8 z-40 w-96 bg-white rounded-lg shadow-2xl border-2 border-blue-500">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center"><h3 className="font-bold">?? AI Coding Tutor</h3><button onClick={() => setIsOpen(false)} className="text-2xl">×</button></div>
      <div className="p-4 max-h-96 overflow-y-auto">{answer && (<div className="bg-blue-50 p-4 rounded-lg mb-4 whitespace-pre-wrap">{answer}</div>)}<textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask me anything about coding..." className="w-full p-3 border rounded-lg resize-none" rows={4} /><button onClick={askQuestion} disabled={loading} className="w-full mt-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{loading ? 'Thinking...' : 'Ask AI'}</button><p className="text-xs text-gray-500 mt-2 text-center">?? Free AI help for coding</p></div>
    </div>
  )
}


