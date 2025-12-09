// app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

type Difficulty = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

type Project = {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tech: string[];
  timeEstimate: string;
  resumeScore: number;
};

// Default projects data
const projects = [
  {
    id: 1,
    title: 'Todo List App',
    description: 'A simple todo list with React and localStorage.',
    difficulty: 'Beginner',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    timeEstimate: '4-6 hours',
    resumeScore: 3,
  },
  {
    id: 2,
    title: 'Weather Dashboard',
    description: 'Weather app with API integration and charts.',
    difficulty: 'Intermediate',
    tech: ['Next.js', 'TypeScript', 'Chart.js', 'API'],
    timeEstimate: '8-12 hours',
    resumeScore: 4,
  },
  {
    id: 3,
    title: 'E-commerce Store',
    description: 'Full-stack e-commerce with cart and payments.',
    difficulty: 'Advanced',
    tech: ['Next.js', 'Prisma', 'Stripe', 'PostgreSQL'],
    timeEstimate: '20-30 hours',
    resumeScore: 5,
  },
  {
    id: 4,
    title: 'Blog Platform',
    description: 'Markdown blog with authentication and comments.',
    difficulty: 'Intermediate',
    tech: ['Next.js', 'NextAuth', 'MDX', 'PostgreSQL'],
    timeEstimate: '10-15 hours',
    resumeScore: 4,
  },
  {
    id: 5,
    title: 'Expense Tracker',
    description: 'Track expenses with charts and categories.',
    difficulty: 'Beginner',
    tech: ['React', 'Chart.js', 'CSS'],
    timeEstimate: '6-8 hours',
    resumeScore: 3,
  },
  {
    id: 6,
    title: 'Real-time Chat',
    description: 'Chat application with WebSockets and rooms.',
    difficulty: 'Advanced',
    tech: ['Socket.io', 'Node.js', 'React', 'MongoDB'],
    timeEstimate: '15-20 hours',
    resumeScore: 5,
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [activeFilter, setActiveFilter] = useState<Difficulty>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (activeFilter !== 'All') {
      result = result.filter(project => project.difficulty === activeFilter);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tech.some(tech => tech.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  const projectCounts = {
    All: projects.length,
    Beginner: projects.filter(p => p.difficulty === 'Beginner').length,
    Intermediate: projects.filter(p => p.difficulty === 'Intermediate').length,
    Advanced: projects.filter(p => p.difficulty === 'Advanced').length,
  };

  const allTechnologies = [...new Set(projects.flatMap(p => p.tech))];
  const popularTech = allTechnologies.slice(0, 6);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Auth */}
              {/* Header with Auth */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              🚀 BuildFolio
              <span className="block text-lg md:text-xl text-gray-600 font-normal mt-1">
                by Apollo Technologies
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-2">
              Build portfolio projects that get you hired
            </p>
          </div>
          
          {/* ... rest of auth buttons ... */}
          
          {status === 'loading' ? (
            <div className="px-6 py-2 bg-gray-100 rounded-full">
              <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-700">
                  {session.user?.name || session.user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user?.email}
                </p>
              </div>
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => signIn('github')}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Sign in with GitHub
              </button>
              <Link
                href="/projects"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Browse Projects
              </Link>
            </div>
          )}
        </div>

        {/* Hero Section for Non-Authenticated Users */}
        {!session && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Build Real Projects. Get Hired.
              </h2>
              <p className="text-blue-100 mb-6 text-lg">
                Stop just following tutorials. Start building real, deployable applications 
                that impress hiring managers. Our platform gives you the tools to actually 
                build portfolio-worthy projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => signIn('github')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Start Building for Free
                </button>
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors text-center"
                >
                  Explore Project Catalog
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* For Authenticated Users */}
        {session && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Welcome back, {session.user?.name?.split(' ')[0] || 'Developer'}! 🎉</h3>
                <p className="text-gray-600 mb-4">
                  Ready to continue building? You have access to our complete platform with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="font-bold text-blue-600 mb-1">Interactive IDE</div>
                    <div className="text-sm text-gray-600">Build projects right in your browser</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="font-bold text-blue-600 mb-1">Step-by-Step Guides</div>
                    <div className="text-sm text-gray-600">Follow along with detailed tutorials</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="font-bold text-blue-600 mb-1">Auto Deployment</div>
                    <div className="text-sm text-gray-600">Deploy to Vercel with one click</div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Go to Your Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects by title, tech, or description..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Tech Filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-sm text-gray-600 mr-2 self-center">Quick filters:</span>
            {popularTech.map((tech) => (
              <button
                key={tech}
                onClick={() => setSearchQuery(tech)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === filter
                    ? filter === 'All'
                      ? 'bg-gray-800 text-white shadow-lg'
                      : filter === 'Beginner'
                      ? 'bg-green-600 text-white shadow-lg'
                      : filter === 'Intermediate'
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                <span>{filter}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeFilter === filter
                    ? 'bg-white/20'
                    : filter === 'Beginner'
                    ? 'bg-green-100 text-green-800'
                    : filter === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : filter === 'Advanced'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {projectCounts[filter]}
                </span>
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="bg-white inline-flex flex-wrap justify-center items-center gap-6 px-6 py-4 rounded-xl shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredProjects.length}</div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{projectCounts.Beginner}</div>
              <div className="text-sm text-gray-600">Beginner</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{projectCounts.Intermediate}</div>
              <div className="text-sm text-gray-600">Intermediate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{projectCounts.Advanced}</div>
              <div className="text-sm text-gray-600">Advanced</div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">Try a different search or filter</p>
            <button
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header with title and difficulty */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{project.title}</h2>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-800'
                        : project.difficulty === 'Intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {project.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-3">{project.description}</p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer with time and score */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{project.timeEstimate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Impact:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < project.resumeScore ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  {session ? (
                    <Link
                      href={`/projects/${project.id}`}
                      className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Start Building
                    </Link>
                  ) : (
                    <button
                      onClick={() => signIn('github')}
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Sign in to Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

               {/* Footer CTA */}
        <div className="text-center mt-12">
          <div className="inline-block p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-700 font-medium">
              🚀 Ready to build your portfolio? 
              {!session && ' Sign in to get started!'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              {!session && (
                <>
                  <button
                    onClick={() => signIn('github')}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Sign in with GitHub
                  </button>
                  <p className="text-sm text-gray-500">No credit card required</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Company Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🚀 BuildFolio
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    by Apollo Technologies
                  </span>
                </h2>
                <p className="text-gray-600 mb-4">
                  The ultimate platform for developers to build, deploy, and showcase 
                  portfolio-worthy projects that impress hiring managers.
                </p>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <a href="tel:+14695549909" className="hover:text-blue-600 transition-colors">
                      (469) 554-9909
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Prosper, TX USA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <a href="mailto:contact@apollotechnologies.com" className="hover:text-blue-600 transition-colors">
                      Robinpandey@apollotechnologies.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/projects" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Project Catalog
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Your Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Interactive Browser IDE
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    One-Click Deployment
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Resume Builder Integration
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    GitHub Integration
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                © {new Date().getFullYear()} BuildFolio by Apollo Technologies US. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Built with ❤️ in Prosper, Texas | (469) 554-9909
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}