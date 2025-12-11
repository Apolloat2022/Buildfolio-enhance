'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Link as LinkIcon, Github, Tag } from 'lucide-react'

export default function ShowcaseSubmitForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    projectSlug: '',
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    tags: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)

      const response = await fetch('/api/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags
        })
      })

      if (response.ok) {
        router.push('/showcase')
      } else {
        alert('Failed to submit project. Please try again.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Submit Your Project</h2>

      {/* Project Slug */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Project Tutorial *
        </label>
        <select
          required
          value={formData.projectSlug}
          onChange={(e) => setFormData({ ...formData, projectSlug: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        >
          <option value="">Select the tutorial you completed...</option>
          <option value="ecommerce-store">E-commerce Store</option>
          {/* Add more project options as you create them */}
        </select>
        <p className="text-xs text-gray-500 mt-1">Which tutorial did you complete?</p>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Project Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="My Awesome E-commerce Store"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell us about your project, what you built, and what you learned..."
          rows={4}
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none resize-none"
        />
      </div>

      {/* Screenshot URL */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Screenshot URL
        </label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://imgur.com/your-screenshot.png"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload to <a href="https://imgur.com" target="_blank" className="text-blue-600 hover:underline">Imgur</a> and paste the URL here
        </p>
      </div>

      {/* GitHub URL */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Github className="w-4 h-4" />
          GitHub Repository
        </label>
        <input
          type="url"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          placeholder="https://github.com/username/repo"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Live URL */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          Live Demo URL
        </label>
        <input
          type="url"
          value={formData.liveUrl}
          onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
          placeholder="https://your-project.vercel.app"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="nextjs, stripe, ecommerce"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !formData.projectSlug || !formData.title}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Project to Showcase'}
      </button>
    </form>
  )
}