// app/dashboard/subscription/page.tsx - WITH IMPORT FIXED
import { auth } from '@/app/auth'  // <-- ADD THIS LINE
import SubscriptionAnalytics from '@/components/SubscriptionAnalytics'

export default async function SubscriptionPage() {
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Please sign in</h1>
          <p className="text-gray-600 mt-2">Authentication required</p>
        </div>
      </div>
    )
  }

  // Safety check for user ID
  if (!session.user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Authentication Error</h1>
          <p className="text-gray-600 mt-2">User ID not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
          <p className="text-gray-600 mt-2">Manage your plans</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Plan</h2>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Free Plan - Basic features</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <SubscriptionAnalytics userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}