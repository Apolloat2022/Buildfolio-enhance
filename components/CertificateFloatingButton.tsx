// components/CertificateFloatingButton.tsx - SIMPLE VERSION
"use client"

import Link from "next/link"
import { Award } from "lucide-react"

export default function CertificateFloatingButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link
        href="/certificates"
        className="group flex flex-col items-center"
      >
        {/* Main button with icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300">
          <Award className="h-8 w-8 text-white" />
        </div>
        
        {/* Red notification badge */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-slate-900">
          1
        </div>
        
        {/* Text label below */}
        <div className="mt-2 text-center">
          <div className="text-sm font-semibold text-white bg-gray-900/80 px-3 py-1 rounded-full">
            🎓 View Certificate (1)
          </div>
        </div>
      </Link>
    </div>
  )
}
