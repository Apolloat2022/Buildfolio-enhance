"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Home, FolderKanban, LayoutDashboard, LogOut, Sparkles } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  
  const handleTestNavigation = (path: string) => {
    router.push(path)
  }

  if (pathname === '/auth/signin' || pathname === '/auth/error') return null

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT: BuildFolio Logo */}
          <div 
            onClick={() => handleTestNavigation('/')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Image 
              src="/buildfolio-logo.png"
              alt="BuildFolio Logo" 
              width={150} 
              height={40} 
              className="object-contain"
              priority
            />
          </div>

          {/* RIGHT: Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 ${pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/projects" 
              className={`flex items-center space-x-2 ${pathname === '/projects' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              <FolderKanban className="h-4 w-4" />
              <span>Projects</span>
            </Link>

            {/* NEW: Showcase Link */}
            <Link 
              href="/showcase" 
              className={`flex items-center space-x-2 ${pathname === '/showcase' ? 'text-white' : 'text-purple-400 hover:text-purple-300 font-medium'}`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Showcase</span>
            </Link>
            
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-2 ${pathname === '/dashboard' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            {session ? (
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link 
                href="/auth/signin" 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}