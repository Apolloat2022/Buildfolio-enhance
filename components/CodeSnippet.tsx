// components/CodeSnippet.tsx
'use client'

import { useState } from 'react'

interface CodeSnippetProps {
  language: string
  code: string
}

export default function CodeSnippet({ language, code }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const languageColors: Record<string, string> = {
    typescript: 'bg-blue-100 text-blue-800',
    javascript: 'bg-yellow-100 text-yellow-800',
    prisma: 'bg-purple-100 text-purple-800',
    bash: 'bg-gray-100 text-gray-800',
    html: 'bg-red-100 text-red-800',
    css: 'bg-indigo-100 text-indigo-800',
    python: 'bg-green-100 text-green-800',
    sql: 'bg-cyan-100 text-cyan-800',
    json: 'bg-gray-800 text-gray-100',
    yaml: 'bg-pink-100 text-pink-800',
    dockerfile: 'bg-blue-900 text-blue-100',
    markdown: 'bg-gray-800 text-gray-100',
    rust: 'bg-orange-100 text-orange-800',
    go: 'bg-cyan-100 text-cyan-800',
    java: 'bg-red-100 text-red-800',
    csharp: 'bg-green-100 text-green-800',
    php: 'bg-indigo-100 text-indigo-800',
    ruby: 'bg-red-100 text-red-800',
    swift: 'bg-orange-100 text-orange-800',
    kotlin: 'bg-purple-100 text-purple-800'
  }

  // Format code with line numbers
  const codeLines = code.split('\n')
  
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
      {/* Header with language and copy button */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded text-xs font-medium ${languageColors[language.toLowerCase()] || 'bg-gray-700 text-gray-300'}`}>
            {language.toUpperCase()}
          </div>
          <span className="text-xs text-gray-400 ml-3">
            {codeLines.length} line{codeLines.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${
            copied 
              ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600'
          }`}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content with line numbers */}
      <div className="overflow-x-auto">
        <pre className="text-sm font-mono text-gray-100 p-4">
          <code className="block">
            {codeLines.map((line, index) => (
              <div key={index} className="flex hover:bg-gray-800/50">
                <div className="text-gray-500 select-none pr-4 text-right w-12 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 whitespace-pre-wrap pl-2">
                  {line || ' '}
                </div>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Syntax highlighting indicators (visual only) */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl</kbd> + 
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs mx-1">C</kbd> to copy
          </span>
          <span className="text-gray-500">
            • Ready
          </span>
        </div>
      </div>
    </div>
  )
}