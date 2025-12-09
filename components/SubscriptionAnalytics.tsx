// components/SubscriptionAnalytics.tsx - Shows business thinking
'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  userCount: number
  activeSubscriptions: number
  mrr: number
  conversionRate: number
  churnRate: number
}

export default function SubscriptionAnalytics({ userId }: { userId: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userCount: 124,
    activeSubscriptions: 8,
    mrr: 79.92,
    conversionRate: 6.5,
    churnRate: 2.1
  })

  // In production, this would fetch real data
  const simulateGrowth = () => {
    setAnalytics(prev => ({
      userCount: prev.userCount + Math.floor(Math.random() * 10),
      activeSubscriptions: prev.activeSubscriptions + (Math.random() > 0.7 ? 1 : 0),
      mrr: prev.activeSubscriptions * 9.99,
      conversionRate: (prev.activeSubscriptions / prev.userCount) * 100,
      churnRate: 2.1
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Business Metrics Dashboard</h3>
        <button 
          onClick={simulateGrowth}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
        >
          Simulate Growth
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Users" 
          value={analytics.userCount} 
          change="+12 this week"
          icon="👥"
        />
        <MetricCard 
          title="Active Subs" 
          value={analytics.activeSubscriptions} 
          change={`${analytics.conversionRate.toFixed(1)}% conversion`}
          icon="💰"
        />
        <MetricCard 
          title="Monthly Revenue" 
          value={`$${analytics.mrr.toFixed(2)}`} 
          change="MRR"
          icon="📈"
        />
        <MetricCard 
          title="Churn Rate" 
          value={`${analytics.churnRate}%`} 
          change="Industry avg: 3-5%"
          icon="📉"
          positive={false}
        />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">💡 Business Insights</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Current conversion rate: <strong>{analytics.conversionRate.toFixed(1)}%</strong></li>
          <li>• Projected annual revenue: <strong>${(analytics.mrr * 12).toFixed(0)}</strong></li>
          <li>• Customer acquisition cost target: <strong>$30</strong></li>
          <li>• Break-even at: <strong>{Math.ceil(3000 / analytics.mrr)} months</strong></li>
        </ul>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon, positive = true }: any) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-xs mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}