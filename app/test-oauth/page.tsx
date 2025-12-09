'use client'

import { signIn } from 'next-auth/react'

export default function TestOAuth() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test OAuth</h1>
      <div className="space-y-4">
        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 block w-full"
        >
          Sign in with GitHub (Client Button)
        </button>

        <a
          href="/api/auth/signin?provider=github"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 block w-full text-center"
        >
          Sign in with GitHub (Direct Link)
        </a>

        <a
          href="/api/auth/providers"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 block w-full text-center"
        >
          Check Providers
        </a>
      </div>
    </div>
  )
}