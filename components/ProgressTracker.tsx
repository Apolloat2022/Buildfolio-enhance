// components/ProgressTracker.tsx
'use client'

interface ProgressTrackerProps {
  totalSteps: number
  completedSteps?: number
}

export default function ProgressTracker({ 
  totalSteps, 
  completedSteps = 0 
}: ProgressTrackerProps) {
  const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Learning Progress</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          percentage === 100 ? 'bg-green-100 text-green-800' :
          percentage >= 50 ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {percentage}% Complete
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedSteps} / {totalSteps} steps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: percentage === 100 ? '#10b981' : 
                              percentage >= 50 ? '#3b82f6' : 
                              '#f59e0b'
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{completedSteps}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{totalSteps - completedSteps}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>
      
      {percentage === 100 ? (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Project Completed!</span>
          </div>
          <button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Generate Certificate
          </button>
        </div>
      ) : percentage >= 50 ? (
        <div className="mt-4 text-sm text-blue-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Great progress! You're more than halfway there.
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm text-yellow-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Keep going! You're making steady progress.
          </div>
        </div>
      )}
    </div>
  )
}
