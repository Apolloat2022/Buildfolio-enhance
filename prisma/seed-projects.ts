import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding projects...')

  // Check if E-commerce already exists
  const existing = await prisma.projectTemplate.findFirst({
    where: { slug: 'ecommerce-store' }
  })

  if (existing) {
    console.log('✅ E-commerce already exists, skipping...')
  }

  // Project 1: To-Do App
  const todo = await prisma.projectTemplate.upsert({
    where: { slug: 'todo-app' },
    update: {},
    create: {
      title: 'Build a To-Do App',
      slug: 'todo-app',
      description: 'Create a task management app with React, TypeScript, and local storage persistence.',
      difficulty: 'beginner',
      estimatedHours: 8,
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Local Storage'],
      learningOutcomes: [
        'React hooks and state management',
        'TypeScript interfaces',
        'Local storage API',
        'CRUD operations'
      ],
      steps: {
        create: [
          {
            order: 1,
            title: 'Project Setup',
            description: 'Initialize React app with TypeScript and Tailwind',
            estimatedTime: '1-2 hours',
            codeSnippets: { bash: 'npx create-react-app todo-app --template typescript' },
            pitfalls: ['Forget to install Tailwind', 'Missing TypeScript config'],
            hints: {},
            estimatedMinutes: 90
          },
          {
            order: 2,
            title: 'Task Component',
            description: 'Create reusable task component with TypeScript types',
            estimatedTime: '2-3 hours',
            codeSnippets: {},
            pitfalls: ['Not typing props correctly', 'Missing key prop in lists'],
            hints: {},
            estimatedMinutes: 150
          },
          {
            order: 3,
            title: 'State Management',
            description: 'Implement add, delete, and toggle task functionality',
            estimatedTime: '2-3 hours',
            codeSnippets: {},
            pitfalls: ['Direct state mutation', 'Missing unique IDs'],
            hints: {},
            estimatedMinutes: 150
          },
          {
            order: 4,
            title: 'Local Storage',
            description: 'Persist tasks using localStorage API',
            estimatedTime: '2-3 hours',
            codeSnippets: {},
            pitfalls: ['Not parsing JSON correctly', 'Forgetting to save on changes'],
            hints: {},
            estimatedMinutes: 150
          }
        ]
      }
    }
  })
  console.log('✅ To-Do App created')

  // Project 2: Weather App
  const weather = await prisma.projectTemplate.upsert({
    where: { slug: 'weather-app' },
    update: {},
    create: {
      title: 'Build a Weather App',
      slug: 'weather-app',
      description: 'Create a weather dashboard with real-time data from OpenWeather API.',
      difficulty: 'beginner',
      estimatedHours: 10,
      technologies: ['React', 'TypeScript', 'OpenWeather API', 'Axios'],
      learningOutcomes: [
        'API integration',
        'Async/await patterns',
        'Environment variables',
        'Error handling'
      ],
      steps: {
        create: [
          {
            order: 1,
            title: 'Setup & API Key',
            description: 'Get OpenWeather API key and configure environment',
            estimatedTime: '1 hour',
            codeSnippets: {},
            pitfalls: ['Exposing API key', 'CORS issues'],
            hints: {},
            estimatedMinutes: 60
          },
          {
            order: 2,
            title: 'API Integration',
            description: 'Fetch weather data using Axios',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['Not handling loading states', 'Missing error handling'],
            hints: {},
            estimatedMinutes: 210
          },
          {
            order: 3,
            title: 'Weather Display',
            description: 'Show temperature, conditions, and forecast',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['Wrong temperature conversion', 'Missing icons'],
            hints: {},
            estimatedMinutes: 210
          },
          {
            order: 4,
            title: 'Search & Favorites',
            description: 'Add city search and save favorites',
            estimatedTime: '2-3 hours',
            codeSnippets: {},
            pitfalls: ['No input validation', 'Duplicate favorites'],
            hints: {},
            estimatedMinutes: 150
          }
        ]
      }
    }
  })
  console.log('✅ Weather App created')

  // Project 3: Social Media Dashboard
  const social = await prisma.projectTemplate.upsert({
    where: { slug: 'social-dashboard' },
    update: {},
    create: {
      title: 'Build a Social Media Dashboard',
      slug: 'social-dashboard',
      description: 'Create a social media feed with posts, likes, comments, and user profiles.',
      difficulty: 'intermediate',
      estimatedHours: 20,
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth'],
      learningOutcomes: [
        'Database design',
        'Authentication',
        'Real-time updates',
        'File uploads'
      ],
      steps: {
        create: [
          {
            order: 1,
            title: 'Database Schema',
            description: 'Design User, Post, Comment, and Like models',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['Wrong relationships', 'Missing indexes'],
            hints: {},
            estimatedMinutes: 210
          },
          {
            order: 2,
            title: 'Authentication',
            description: 'Set up NextAuth with email/password',
            estimatedTime: '4-5 hours',
            codeSnippets: {},
            pitfalls: ['Wrong callback URLs', 'Missing session config'],
            hints: {},
            estimatedMinutes: 270
          },
          {
            order: 3,
            title: 'Post Feed',
            description: 'Create, read, and display posts',
            estimatedTime: '5-6 hours',
            codeSnippets: {},
            pitfalls: ['N+1 queries', 'Missing pagination'],
            hints: {},
            estimatedMinutes: 330
          },
          {
            order: 4,
            title: 'Likes & Comments',
            description: 'Add interaction features',
            estimatedTime: '4-5 hours',
            codeSnippets: {},
            pitfalls: ['Duplicate likes', 'No optimistic updates'],
            hints: {},
            estimatedMinutes: 270
          },
          {
            order: 5,
            title: 'User Profiles',
            description: 'Create profile pages with edit functionality',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['Missing authorization', 'No image validation'],
            hints: {},
            estimatedMinutes: 210
          }
        ]
      }
    }
  })
  console.log('✅ Social Media Dashboard created')

  // Project 4: Recipe Finder
  const recipe = await prisma.projectTemplate.upsert({
    where: { slug: 'recipe-finder' },
    update: {},
    create: {
      title: 'Build a Recipe Finder',
      slug: 'recipe-finder',
      description: 'Search recipes, save favorites, and create meal plans using Spoonacular API.',
      difficulty: 'beginner',
      estimatedHours: 12,
      technologies: ['React', 'TypeScript', 'Spoonacular API', 'React Query'],
      learningOutcomes: [
        'Third-party API integration',
        'Data caching with React Query',
        'Complex search filters',
        'Favorites system'
      ],
      steps: {
        create: [
          {
            order: 1,
            title: 'API Setup',
            description: 'Get Spoonacular API key and test endpoints',
            estimatedTime: '1-2 hours',
            codeSnippets: {},
            pitfalls: ['Rate limit issues', 'Wrong API parameters'],
            hints: {},
            estimatedMinutes: 90
          },
          {
            order: 2,
            title: 'Recipe Search',
            description: 'Build search with filters (diet, cuisine, etc)',
            estimatedTime: '4-5 hours',
            codeSnippets: {},
            pitfalls: ['No debouncing', 'Poor filter UX'],
            hints: {},
            estimatedMinutes: 270
          },
          {
            order: 3,
            title: 'Recipe Details',
            description: 'Show ingredients, instructions, and nutrition',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['Missing nutritional data', 'Poor image handling'],
            hints: {},
            estimatedMinutes: 210
          },
          {
            order: 4,
            title: 'Favorites & Meal Plans',
            description: 'Save recipes and create weekly meal plans',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['No data persistence', 'Confusing UX'],
            hints: {},
            estimatedMinutes: 210
          }
        ]
      }
    }
  })
  console.log('✅ Recipe Finder created')

  // Project 5: Portfolio Builder
  const portfolio = await prisma.projectTemplate.upsert({
    where: { slug: 'portfolio-builder' },
    update: {},
    create: {
      title: 'Build a Portfolio Website',
      slug: 'portfolio-builder',
      description: 'Create a professional portfolio with projects showcase, blog, and contact form.',
      difficulty: 'beginner',
      estimatedHours: 15,
      technologies: ['Next.js', 'TypeScript', 'MDX', 'Tailwind CSS', 'Vercel'],
      learningOutcomes: [
        'Static site generation',
        'MDX for blog posts',
        'SEO optimization',
        'Contact forms'
      ],
      steps: {
        create: [
          {
            order: 1,
            title: 'Project Setup',
            description: 'Initialize Next.js with TypeScript and Tailwind',
            estimatedTime: '2-3 hours',
            codeSnippets: {},
            pitfalls: ['Wrong Next.js config', 'Missing metadata'],
            hints: {},
            estimatedMinutes: 150
          },
          {
            order: 2,
            title: 'Hero & About',
            description: 'Create landing page and about section',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['Poor responsive design', 'Missing animations'],
            hints: {},
            estimatedMinutes: 210
          },
          {
            order: 3,
            title: 'Projects Showcase',
            description: 'Display projects with images and descriptions',
            estimatedTime: '4-5 hours',
            codeSnippets: {},
            pitfalls: ['Slow image loading', 'No filtering'],
            hints: {},
            estimatedMinutes: 270
          },
          {
            order: 4,
            title: 'Blog with MDX',
            description: 'Set up MDX blog with syntax highlighting',
            estimatedTime: '3-4 hours',
            codeSnippets: {},
            pitfalls: ['MDX config issues', 'No RSS feed'],
            hints: {},
            estimatedMinutes: 210
          },
          {
            order: 5,
            title: 'Contact & Deploy',
            description: 'Add contact form and deploy to Vercel',
            estimatedTime: '2-3 hours',
            codeSnippets: {},
            pitfalls: ['No spam protection', 'Wrong Vercel config'],
            hints: {},
            estimatedMinutes: 150
          }
        ]
      }
    }
  })
  console.log('✅ Portfolio Builder created')

  // Project 6: Blog Platform (bonus)
  const blog = await prisma.projectTemplate.upsert({
    where: { slug: 'blog-platform' },
    update: {},
    create: {
      title: 'Build a Blog Platform',
      slug: 'blog-platform',
      description: 'Create a full-featured blog with markdown editor, comments, and SEO.',
      difficulty: 'intermediate',
      estimatedHours: 18,
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'TipTap', 'NextAuth'],
      learningOutcomes: [
        'Rich text editing',
        'SEO best practices',
        'Image optimization',
        'Comment system'
      ],
      steps: {
        create: [
          {
            order: 1,
            title: 'Database & Auth',
            description: 'Set up Prisma schema and authentication',
            estimatedTime: '4-5 hours',
            codeSnippets: {},
            pitfalls: ['Wrong relationships', 'Missing session config'],
            hints: {},
            estimatedMinutes: 270
          },
          {
            order: 2,
            title: 'Markdown Editor',
            description: 'Integrate TipTap rich text editor',
            estimatedTime: '5-6 hours',
            codeSnippets: {},
            pitfalls: ['Editor crashes', 'No image uploads'],
            hints: {},
            estimatedMinutes: 330
          },
          {
            order: 3,
            title: 'Blog Posts CRUD',
            description: 'Create, read, update, delete posts',
            estimatedTime: '4-5 hours',
            codeSnippets: {},
            pitfalls: ['Missing authorization', 'No drafts'],
            hints: {},
            estimatedMinutes: 270
          },
          {
            order: 4,
            title: 'Comments & SEO',
            description: 'Add comments and optimize for search engines',
            estimatedTime: '4-5 hours',
            codeSnippets: {},
            pitfalls: ['Missing meta tags', 'No spam protection'],
            hints: {},
            estimatedMinutes: 270
          }
        ]
      }
    }
  })
  console.log('✅ Blog Platform created')

  console.log('\n🎉 All 6 projects created!')
  console.log('📊 Summary:')
  console.log('  1. To-Do App (Beginner - 8 hours)')
  console.log('  2. Weather App (Beginner - 10 hours)')
  console.log('  3. E-commerce Store (Intermediate - 25 hours)')
  console.log('  4. Social Media Dashboard (Intermediate - 20 hours)')
  console.log('  5. Recipe Finder (Beginner - 12 hours)')
  console.log('  6. Portfolio Builder (Beginner - 15 hours)')
  console.log('  BONUS: Blog Platform (Intermediate - 18 hours)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
