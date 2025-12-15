import Link from 'next/link'
import { auth } from './auth'

import { Briefcase, CheckCircle, Award, Rocket, Target, ShieldCheck } from "lucide-react";
export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Build Real Projects.<br />Earn Real Skills.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Learn by building production-ready applications with AI-powered guidance, 
              step-by-step tutorials, and earn verified certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Link href="/projects" className="btn-primary text-lg px-8 py-4">
                  Browse Projects
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin" className="btn-primary text-lg px-8 py-4">
                    Get Started Free
                  </Link>
                  <Link href="/projects" className="glass px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all">
                    View Projects
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-in">
            <div className="glass-dark p-6 rounded-2xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">35+</div>
              <div className="text-gray-400 mt-2">Quiz Questions</div>
            </div>
            <div className="glass-dark p-6 rounded-2xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">100%</div>
              <div className="text-gray-400 mt-2">Hands-On Learning</div>
            </div>
            <div className="glass-dark p-6 rounded-2xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Free</div>
              <div className="text-gray-400 mt-2">Verified Certificates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why BuildFolio?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-modern group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Project-Based</h3>
              <p className="text-gray-400">Build real applications, not toy examples. Every project is production-ready.</p>
            </div>

            <div className="card-modern group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Verified Learning</h3>
              <p className="text-gray-400">Pass quizzes, validate your code, earn certificates that prove your skills.</p>
            </div>

            <div className="card-modern group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Career Ready</h3>
              <p className="text-gray-400">Build a portfolio that gets you hired. Real projects, real impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join developers building real projects and earning verified skills.
          </p>
          {!session && (
            <Link href="/auth/signin" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl">
              Start Learning Free
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}


