'use client'

import { useState, useEffect } from 'react'
import { Search, Copy, Check, Code2, Filter } from 'lucide-react'

interface Snippet {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  category: string
  tags: string[]
  usageCount: number
}

export default function SnippetLibrary() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchSnippets()
  }, [])

  useEffect(() => {
    filterSnippets()
  }, [snippets, searchQuery, selectedLanguage, selectedCategory])

  const fetchSnippets = async () => {
    try {
      const res = await fetch('/api/snippets')
      const data = await res.json()
      setSnippets(data.snippets || [])
    } catch (error) {
      console.error('Failed to fetch snippets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSnippets = () => {
    let filtered = snippets

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(s => s.language === selectedLanguage)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    setFilteredSnippets(filtered)
  }

  const copyToClipboard = async (snippet: Snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopiedId(snippet.id)
      
      // Track usage
      fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippetId: snippet.id })
      })

      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const languages = ['all', ...new Set(snippets.map(s => s.language))]
  const categories = ['all', ...new Set(snippets.map(s => s.category))]

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Code2 className="w-8 h-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Code Snippet Library</h2>
          <p className="text-sm text-gray-600">Quick copy-paste solutions for common patterns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Language Filter */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>
              {lang === 'all' ? 'All Languages' : lang}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredSnippets.length} of {snippets.length} snippets
      </div>

      {/* Snippets Grid */}
      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No snippets found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{snippet.title}</h3>
                  {snippet.description && (
                    <p className="text-sm text-gray-600 mb-2">{snippet.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                      {snippet.language}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {snippet.category}
                    </span>
                    {snippet.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard(snippet)}
                  className="flex-shrink-0 ml-4 p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  title="Copy to clipboard"
                >
                  {copiedId === snippet.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Code Preview */}
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-white">
                  <code>{snippet.code}</code>
                </pre>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Used {snippet.usageCount} times
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}