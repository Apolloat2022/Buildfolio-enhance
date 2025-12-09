'use client'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubSignIn = async () => {
  // 🔴 DEBUG LINES ADDED HERE:
  console.log('🔴 DEBUG: Button clicked!')
  console.log('🔴 DEBUG: signIn function exists?', typeof signIn)
  console.log('🔴 DEBUG: signIn function:', signIn)
  
  setIsLoading(true)
  
  try {
    console.log('🔴 DEBUG: Calling signIn("github")...')
    
    // 🔥 UPDATED LINE: Changed '/' to '/dashboard'
    const result = await signIn('github', {
      callbackUrl: '/dashboard',  // ← THIS IS THE FIX
      redirect: true,
    })
    
    console.log('🔴 DEBUG: signIn returned:', result)
    
  } catch (error) {
    console.error('🔴 DEBUG: Sign in error:', error)
    setIsLoading(false)
  }
}

  const handleGoogleSignIn = () => {
    console.log('Google sign-in not implemented yet')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-600 mt-2">Choose your sign-in method</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Redirecting to GitHub...</span>
              </>
            ) : (
              <>
                <FaGithub className="w-5 h-5" />
                <span>Sign in with GitHub</span>
              </>
            )}
          </button>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg border border-gray-300 transition"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Check browser console (F12) for debug messages
          </p>
        </div>
      </div>
    </div>
  )
}