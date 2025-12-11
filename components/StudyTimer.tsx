'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'

type TimerMode = 'work' | 'break'

export default function StudyTimer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [totalStudyTime, setTotalStudyTime] = useState(0) // in seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Work: 25min, Break: 5min
  const WORK_TIME = 25 * 60
  const BREAK_TIME = 5 * 60

  useEffect(() => {
    // Load total study time from localStorage
    const saved = localStorage.getItem('totalStudyTime')
    if (saved) setTotalStudyTime(parseInt(saved))
    
    // Create audio element for timer completion
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2m98OScTgwOUKjo87RgGwU7k9n0yHgrBSJ1xe/glEILElyx6OyrWBUIRp/h9L1rIAUsgs/z2YgyBxhqvfDlm00MDFCn4/O2YRoFOpPZ9MZ3KwUfc8Tv4pVEDBJcsejtrFgUCEaf4PG+aiEGLILP8tiFMwcXa73w5ZtNDAxPqOT0t2AbBTmT2fTHdyoFH3LF8OCRPwsSXLHp7axYFAhGnt/wv2wiBiyBz/PYhzQIGGm88OWaTAwMT6jk9LdgGgU5k9n0yHYpBR9yxvDgkj8LE1yx6OurVxQIRZ3f8MBrIQYrgs/z2Ic0CBhpvO/lmkwMDE+o5PO3YBoGOpPY9Mh2KQUfccXw4JI/CxJcsejrqlYUB0Sd3u++ayEGK4LP8tiHMwgYabzv5ZpMDAw/qOPzt2EaBjqT2PTIdikFH3HF8N+SPwsTW7Hn7KpWFAdEnd7vvmshBiuCz/LYhjQIF2m+7+SbSwwNT6nj87dgGgU5k9n0yHYqBR9xxfDgkUALE1ux6OurVhQHRJ3e7r5rIgYrgs/y2IYzCBdpvu/km0sMDU+p5POyXxoFOpPZ9Mh1KgUfccXw35I/ChNbseftrFYUCESd3u6/ayEGLILP8tiGMwgXab7v5JtLDA1PqeTzsV8aBTqT2PTHdioFH3HF8OCRPwwSW7Hn7KpWEwhEnd7uv2wiBiuBzvLYhjMIF2m+7+SbSwwNT6nk87JgGgY6k9j0yHUqBR9xxfDfkj8LE1qx5+yrVhMIQ53e7r9sIQYsgc7y2IY0CBdpvO/km0oMDU+p5POyYBoGOpPY9Mh1KgUfccbw4JE/DBNbseftrFYUCEOd3u6/bCEGLIHO8tiGMwgXabzv5JpLDA1PqeLzsmAaBjqT2PTIdSoFH3HG8N+SPwwTW7Hn7axWFAhDnd3vv2wiBiyBzvLYhjQIF2m87+SaSgwNT6ni87JfGgU6k9j0yHUqBR9xxu/gkj4LE1ux5+2sVhQIQ53d7r9rIgYsgc7y2IU0CBZpvO/kmkoMDU+p4vKyXxoFOpPY9Mh1KgUfccbv4JI+CxNbseftq1YTCESd3e6/bCIGK4HO8tiGMwgXabzv5JpKDA1Pp+LysmAaBjqT2PTIdCkFH3HG7+CRPw==')
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete()
            return mode === 'work' ? WORK_TIME : BREAK_TIME
          }
          return prev - 1
        })
        
        // Track study time (only during work mode)
        if (mode === 'work') {
          setTotalStudyTime(prev => {
            const newTotal = prev + 1
            localStorage.setItem('totalStudyTime', newTotal.toString())
            return newTotal
          })
        }
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft, mode])

  const handleTimerComplete = () => {
    setIsRunning(false)
    audioRef.current?.play()
    
    // Switch mode
    if (mode === 'work') {
      setMode('break')
      setTimeLeft(BREAK_TIME)
    } else {
      setMode('work')
      setTimeLeft(WORK_TIME)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const progress = mode === 'work' 
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          Study Timer
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          mode === 'work' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {mode === 'work' ? '🎯 Focus' : '☕ Break'}
        </span>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="relative">
          <svg className="w-full h-48" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={mode === 'work' ? '#3b82f6' : '#10b981'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
              transform="rotate(-90 100 100)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">
                {mode === 'work' ? 'Stay focused!' : 'Take a break!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={toggleTimer}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          <RotateCcw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Total Study Time */}
      <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
        <div className="text-sm text-purple-600 mb-1">Total Study Time</div>
        <div className="text-2xl font-bold text-purple-900">
          {formatStudyTime(totalStudyTime)}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Work: 25 min • Break: 5 min
      </div>
    </div>
  )
}