// app/dashboard/subscription/page.tsx - Subscription Management
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import SubscriptionAnalytics from '@/components/SubscriptionAnalytics'

export default async function SubscriptionPage() {
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Please sign in to view subscriptions</h1>
          <p className="text-gray-600 mt-2">You need to be authenticated to access this page.</p>
        </div>
      </div>
    )
  }

  // Get user's subscription data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: true,
    },
  })

  const currentSubscription = user?.subscriptions[0] || null

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your subscription plan and billing information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Subscription Status */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Plan</h2>
              
              {currentSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {currentSubscription.plan === 'PRO' ? 'Pro Plan' : 'Free Plan'}
                      </h3>
                      <p className="text-gray-600">
                        {currentSubscription.plan === 'PRO' 
                          ? 'Full access to all features' 
                          : 'Basic features only'}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      currentSubscription.plan === 'PRO'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentSubscription.plan === 'PRO' ? 'Active' : 'Free Tier'}
                    </span>
                  </div>
                  
                  {currentSubscription.plan === 'PRO' && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600">
                        Renews on: {new Date(currentSubscription.expiresAt).toLocaleDateString()}
                      </p>
                      <button className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
                        Cancel Subscription
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You are currently on the free plan</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Billing History</h2>
              <div className="text-center py-8 text-gray-500">
                No billing history available
              </div>
            </div>
          </div>

          {/* Right Column - Analytics & Actions */}
          <div className="space-y-8">
            {/* Subscription Analytics Component */}
            <SubscriptionAnalytics />

            {/* Upgrade Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Unlock All Features</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited Projects
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority Support
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced Analytics
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Upgrade Now - $19/month
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Have questions about your subscription? We're here to help.
              </p>
              <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}