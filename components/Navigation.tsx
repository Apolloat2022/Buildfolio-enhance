// components/Navigation.tsx - CORRECT: No "Certificates" in top bar
"use client"

import Link from "next/link"
import { auth } from "@/app/auth"
import { Home, FolderKanban, LayoutDashboard, LogOut } from "lucide-react"

export default async function Navigation() {
  const session = await auth()

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT: BuildFolio Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              BuildFolio
            </span>
          </Link>

          {/* RIGHT: Navigation Links (NO Certificates here) */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link href="/projects" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <FolderKanban className="h-4 w-4" />
              <span>Projects</span>
            </Link>
            
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            {/* User/Sign Out */}
            {session ? (
              <form action="/auth/signout" method="POST">
                <button 
                  type="submit" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            ) : (
              <Link href="/auth/signin" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
