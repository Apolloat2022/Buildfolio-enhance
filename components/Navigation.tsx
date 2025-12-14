"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  if (pathname === '/auth/signin' || pathname === '/auth/error') return null

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-xl">🎓</span>
          <span>Certificates</span>
        </Link>
            <Image src="/buildfolio-logo.png" alt="BuildFolio" width={160} height={40} className="h-10 w-auto" />
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className={`text-gray-300 hover:text-white transition-colors ${pathname === '/' ? 'text-white font-semibold' : ''}`}>Home</Link>
            <Link href="/projects" className={`text-gray-300 hover:text-white transition-colors ${pathname === '/projects' ? 'text-white font-semibold' : ''}`}>Projects</Link>
            
            {session ? (
              <>
                <Link href="/dashboard" className={`text-gray-300 hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-white font-semibold' : ''}`}>Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold">Sign Out</button>
              </>
            ) : (
              <Link href="/auth/signin" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
