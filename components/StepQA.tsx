'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ThumbsUp, Reply, Send } from 'lucide-react'

interface Question {
  id: string
  question: string
  upvotes: number
  isAnswered: boolean
  createdAt: string
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  replies: Array<{
    id: string
    content: string
    upvotes: number
    createdAt: string
    user: {
      name: string | null
      email: string | null
    }
  }>
}

interface StepQAProps {
  stepId: string
  isAuthenticated: boolean
}

export default function StepQA({ stepId, isAuthenticated }: StepQAProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showAskForm, setShowAskForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [stepId])

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/questions?stepId=${stepId}`)
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, question: newQuestion })
      })

      if (res.ok) {
        setNewQuestion('')
        setShowAskForm(false)
        fetchQuestions()
      }
    } catch (error) {
      console.error('Failed to post question:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (questionId: string) => {
    if (!replyContent.trim() || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, content: replyContent })
      })

      if (res.ok) {
        setReplyContent('')
        setReplyingTo(null)
        fetchQuestions()
      }
    } catch (error) {
      console.error('Failed to post reply:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (name: string | null, email: string | null) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    if (email) return email[0].toUpperCase()
    return '?'
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
  }

  return (
    <div className="mt-8 border-t-2 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          Questions ({questions.length})
        </h3>
        {isAuthenticated && (
          <button
            onClick={() => setShowAskForm(!showAskForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            {showAskForm ? 'Cancel' : 'Ask Question'}
          </button>
        )}
      </div>

      {/* Ask Question Form */}
      {showAskForm && isAuthenticated && (
        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What are you stuck on? Be specific..."
            className="w-full h-24 border rounded-lg p-3 mb-3 resize-none"
          />
          <button
            onClick={handleAskQuestion}
            disabled={submitting || !newQuestion.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            <a href="/auth/signin" className="font-bold text-blue-600 hover:underline">Sign in</a> to ask questions and help others
          </p>
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white border-2 rounded-lg p-5 hover:border-blue-200 transition-colors">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(q.user.name, q.user.email)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {q.user.name || q.user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                    {q.isAnswered && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        ✓ Answered
                      </span>
                    )}
                  </div>

                  <p className="text-gray-800 mb-3 font-medium">{q.question}</p>

                  {/* Replies */}
                  {q.replies.length > 0 && (
                    <div className="space-y-3 mt-4 pl-4 border-l-2 border-green-200">
                      {q.replies.map((reply) => (
                        <div key={reply.id} className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Reply className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-900">
                              {reply.user.name || reply.user.email?.split('@')[0]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Button/Form */}
                  {isAuthenticated && (
                    <>
                      {replyingTo === q.id ? (
                        <div className="mt-4">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your answer..."
                            className="w-full h-20 border rounded-lg p-2 text-sm resize-none"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleReply(q.id)}
                              disabled={submitting || !replyContent.trim()}
                              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              {submitting ? 'Posting...' : 'Post Answer'}
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyContent('')
                              }}
                              className="text-gray-600 px-4 py-1 text-sm hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(q.id)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}