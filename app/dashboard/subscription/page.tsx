// app/dashboard/subscription/page.tsx - Subscription Management
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import SubscriptionCard from '@/components/SubscriptionCard'
import SubscriptionAnalytics from '@/components/SubscriptionAnalytics'

export default async function SubscriptionPage() {
  const session = await auth()
  
  if (!session?.user) {
    return <div>Please sign in</div>
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      projects: true,
      startedProjects: true
    }
  })

  const metrics = {
    totalProjects: user?.projects.length || 0,
    completedProjects: user?.startedProjects.filter(p => p.status === 'completed').length || 0,
    projectCompletionRate: user?.projects.length ? 
      (user.startedProjects.filter(p => p.status === 'completed').length / user.projects.length) * 100 : 0
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription & Analytics</h1>
      <p className="text-gray-600 mb-8">
        Manage your subscription and track your learning progress
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-2">
          <SubscriptionCard 
            currentTier={user?.subscriptionTier || 'free'}
            status={user?.subscriptionStatus || 'inactive'}
            endsAt={user?.subscriptionEndsAt}
          />
        </div>

        {/* Quick Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Projects Created</span>
                <span className="font-medium">{metrics.totalProjects}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(metrics.totalProjects * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium">{metrics.projectCompletionRate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${metrics.projectCompletionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="mt-8">
        <SubscriptionAnalytics userId={session.user.id} />
      </div>

      {/* Case Study Documentation */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-4">💼 Business Case Study</h3>
        <div className="space-y-4 text-blue-800">
          <p>
            <strong>Monetization Strategy Implemented:</strong> Freemium SaaS model with Stripe integration
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Free Tier:</strong> 3 projects, basic features (user acquisition)</li>
            <li><strong>Pro Tier ($9.99/month):</strong> All features, AI optimization (revenue driver)</li>
            <li><strong>Conversion Goal:</strong> 5-10% free-to-paid conversion</li>
            <li><strong>LTV Target:</strong> $120+ per converting user</li>
          </ul>
          <p className="text-sm italic">
            This implementation demonstrates both technical skills (Stripe API, subscription logic) 
            and business acumen (pricing strategy, metrics tracking).
          </p>
        </div>
      </div>
    </div>
  )
}