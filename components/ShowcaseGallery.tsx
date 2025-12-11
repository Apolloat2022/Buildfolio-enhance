'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, ExternalLink, Github, Award, Eye } from 'lucide-react'
import Link from 'next/link'

interface Showcase {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  tags: string[]
  likes: number
  featured: boolean
  createdAt: string
  projectSlug: string
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      name: string | null
      email: string | null
    }
  }>
}

interface ShowcaseGalleryProps {
  isAuthenticated: boolean
}

export default function ShowcaseGallery({ isAuthenticated }: ShowcaseGalleryProps) {
  const [showcases, setShowcases] = useState<Showcase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShowcase, setSelectedShowcase] = useState<Showcase | null>(null)
  const [commentContent, setCommentContent] = useState('')

  useEffect(() => {
    fetchShowcases()
  }, [])

  const fetchShowcases = async () => {
    try {
      const res = await fetch('/api/showcase')
      const data = await res.json()
      setShowcases(data.showcases || [])
    } catch (error) {
      console.error('Failed to fetch showcases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (showcaseId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to like projects')
      return
    }

    try {
      await fetch('/api/showcase/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcaseId })
      })
      fetchShowcases()
    } catch (error) {
      console.error('Failed to like:', error)
    }
  }

  const handleComment = async (showcaseId: string) => {
    if (!commentContent.trim()) return

    try {
      await fetch('/api/showcase/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcaseId, content: commentContent })
      })
      setCommentContent('')
      fetchShowcases()
      setSelectedShowcase(null)
    } catch (error) {
      console.error('Failed to comment:', error)
    }
  }

  const getInitials = (name: string | null, email: string | null) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    if (email) return email[0].toUpperCase()
    return '?'
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>
  }

  return (
    <>
      {showcases.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">Be the first to showcase your project!</p>
          {isAuthenticated && (
            <Link
              href="/showcase/submit"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all font-medium"
            >
              Submit Your Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.map((showcase) => (
            <div
              key={showcase.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all ${
                showcase.featured ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {showcase.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 text-center">
                  ⭐ FEATURED PROJECT
                </div>
              )}

              <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
                {showcase.imageUrl ? (
                  <img
                    src={showcase.imageUrl}
                    alt={showcase.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Eye className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(showcase.user.name, showcase.user.email)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {showcase.user.name || showcase.user.email?.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(showcase.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{showcase.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {showcase.description || 'No description provided.'}
                </p>

                {showcase.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {showcase.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  {showcase.githubUrl && (
                    
                      href={showcase.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {showcase.liveUrl && (
                    
                      href={showcase.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <button
                    onClick={() => handleLike(showcase.id)}
                    disabled={!isAuthenticated}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">{showcase.likes}</span>
                  </button>

                  <button
                    onClick={() => setSelectedShowcase(showcase)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">{showcase.comments.length}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedShowcase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{selectedShowcase.title}</h3>
              <button
                onClick={() => setSelectedShowcase(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {selectedShowcase.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
              ) : (
                selectedShowcase.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {comment.user.name || comment.user.email?.split('@')[0]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {isAuthenticated ? (
              <div>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full border-2 border-gray-200 rounded-lg p-3 mb-3 resize-none h-24"
                />
                <button
                  onClick={() => handleComment(selectedShowcase.id)}
                  disabled={!commentContent.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Post Comment
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <a href="/auth/signin" className="text-blue-600 font-bold hover:underline">
                  Sign in
                </a>{' '}
                to comment
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}