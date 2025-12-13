import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const existing = await prisma.projectTemplate.count()
    if (existing >= 6) {
      return NextResponse.json({ message: 'Already seeded', count: existing })
    }

    const projects = [
      { slug: 'todo-app', title: 'Build a To-Do App', description: 'Create a task management app with React, TypeScript, and local storage.', difficulty: 'beginner', timeEstimate: '8-10 hours', technologies: ['React', 'TypeScript', 'Tailwind CSS'], learningOutcomes: ['React hooks', 'Local storage', 'State management'], steps: [
        { order: 1, title: 'Setup', description: 'Initialize project', estimatedTime: '1-2 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 90 },
        { order: 2, title: 'Components', description: 'Build task components', estimatedTime: '2-3 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 150 },
        { order: 3, title: 'State', description: 'Add CRUD operations', estimatedTime: '2-3 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 150 }
      ]},
      { slug: 'weather-app', title: 'Build a Weather App', description: 'Create a weather dashboard with real-time data from OpenWeather API.', difficulty: 'beginner', timeEstimate: '10-12 hours', technologies: ['React', 'TypeScript', 'API'], learningOutcomes: ['API integration', 'Async operations', 'Error handling'], steps: [
        { order: 1, title: 'API Setup', description: 'Get API key', estimatedTime: '1 hour', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 60 },
        { order: 2, title: 'Fetch Data', description: 'Call weather API', estimatedTime: '3-4 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 210 },
        { order: 3, title: 'Display', description: 'Show weather info', estimatedTime: '3-4 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 210 }
      ]},
      { slug: 'social-dashboard', title: 'Build a Social Media Dashboard', description: 'Create a social feed with posts, likes, and comments.', difficulty: 'intermediate', timeEstimate: '20-25 hours', technologies: ['Next.js', 'Prisma', 'PostgreSQL'], learningOutcomes: ['Database design', 'Auth', 'CRUD'], steps: [
        { order: 1, title: 'Database', description: 'Design schema', estimatedTime: '3-4 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 210 },
        { order: 2, title: 'Auth', description: 'User login', estimatedTime: '4-5 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 270 },
        { order: 3, title: 'Posts', description: 'Create posts', estimatedTime: '5-6 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 330 }
      ]},
      { slug: 'recipe-finder', title: 'Build a Recipe Finder', description: 'Search recipes and create meal plans using API.', difficulty: 'beginner', timeEstimate: '12-15 hours', technologies: ['React', 'API', 'TypeScript'], learningOutcomes: ['API calls', 'Search', 'Favorites'], steps: [
        { order: 1, title: 'API', description: 'Setup API', estimatedTime: '1-2 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 90 },
        { order: 2, title: 'Search', description: 'Recipe search', estimatedTime: '4-5 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 270 },
        { order: 3, title: 'Details', description: 'Show recipe', estimatedTime: '3-4 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 210 }
      ]},
      { slug: 'portfolio-builder', title: 'Build a Portfolio Website', description: 'Create a professional portfolio with projects and blog.', difficulty: 'beginner', timeEstimate: '15-18 hours', technologies: ['Next.js', 'MDX', 'Tailwind'], learningOutcomes: ['SSG', 'MDX', 'SEO'], steps: [
        { order: 1, title: 'Setup', description: 'Init Next.js', estimatedTime: '2-3 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 150 },
        { order: 2, title: 'Pages', description: 'Build pages', estimatedTime: '3-4 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 210 },
        { order: 3, title: 'Blog', description: 'MDX blog', estimatedTime: '3-4 hours', codeSnippets: {}, pitfalls: [], hints: {}, estimatedMinutes: 210 }
      ]}
    ]

    for (const p of projects) {
      await prisma.projectTemplate.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          title: p.title,
          slug: p.slug,
          description: p.description,
          difficulty: p.difficulty,
          timeEstimate: p.timeEstimate,
          technologies: p.technologies,
          learningOutcomes: p.learningOutcomes,
          steps: { create: p.steps }
        }
      })
    }

    const total = await prisma.projectTemplate.count()
    return NextResponse.json({ success: true, count: total })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
