
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Project Definitions
const PROJECTS = [
  {
    slug: 'ecommerce-store',
    title: 'Build a Modern E-commerce Store',
    description: 'Create a full-stack e-commerce platform with product listings, shopping cart, and checkout functionality.',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
    emoji: '🛒'
  },
  {
    slug: 'todo-app',
    title: 'Advanced Task Manager',
    description: 'Build a production-ready task management app with drag-and-drop, categories, and progress tracking.',
    technologies: ['Next.js', 'React DnD', 'Prisma', 'Auth.js', 'Tailwind'],
    emoji: '✅'
  },
  {
    slug: 'weather-app',
    title: 'Real-time Weather Dashboard',
    description: 'Create a beautiful weather dashboard using external APIs, geolocation, and dynamic charts.',
    technologies: ['Next.js', 'OpenWeather API', 'Recharts', 'Geocoding', 'Tailwind'],
    emoji: '☀️'
  },
  {
    slug: 'social-dashboard',
    title: 'Social Analytics Dashboard',
    description: 'Build a comprehensive analytics dashboard with data visualization, dark mode, and export capabilities.',
    technologies: ['Next.js', 'Tremor', 'Postgres', 'Data Viz', 'Tailwind'],
    emoji: '📊'
  },
  {
    slug: 'recipe-finder',
    title: 'AI Recipe Finder',
    description: 'Create a smart recipe search engine that generates meal plans using AI.',
    technologies: ['Next.js', 'OpenAI API', 'Framer Motion', 'Postgres', 'Tailwind'],
    emoji: '🍳'
  },
  {
    slug: 'portfolio-builder',
    title: 'Developer Portfolio Builder',
    description: 'Build a dynamic portfolio generator that connects to GitHub and LinkedIn.',
    technologies: ['Next.js', 'GitHub API', 'PDF Generation', 'Markdown', 'Tailwind'],
    emoji: '💼'
  }
]

// Reusable Step Templates
const GENERIC_STEPS = [
  {
    order: 1,
    title: 'Project Setup & Configuration',
    description: 'Initialize the Next.js application, configure TypeScript/Tailwind, and set up the development environment.',
    estimatedTime: '2 hours',
    videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg',
    hints: [
      { level: 1, content: 'Ensure Node.js v18+ is installed', unlockMinutes: 5 },
      { level: 2, content: 'Use "npx create-next-app@latest" for the most recent template', unlockMinutes: 10 }
    ],
    codeSnippets: [
      { language: 'bash', code: 'npx create-next-app@latest my-project --typescript --tailwind --eslint' }
    ],
    pitfalls: ['Not selecting the "src" directory option if preferred', 'Ignoring peer dependency warnings']
  },
  {
    order: 2,
    title: 'Core UI Layout & Navigation',
    description: 'Build the main application shell, responsive navigation bar, and layout structure.',
    estimatedTime: '3 hours',
    videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs',
    hints: [
      { level: 1, content: 'Use next/link for client-side navigation', unlockMinutes: 5 }
    ],
    codeSnippets: [
      { language: 'tsx', code: 'export default function Layout({ children }) {\n  return (\n    <div className="min-h-screen">\n      <Navbar />\n      <main>{children}</main>\n    </div>\n  )\n}' }
    ],
    pitfalls: ['Forgetting "use client" on interactive navbar components']
  },
  {
    order: 3,
    title: 'Database Schema Design',
    description: 'Design and implement the Prisma schema for your application data requirements.',
    estimatedTime: '2-3 hours',
    videoUrl: 'https://www.youtube.com/embed/lATafp15HWA',
    hints: [
      { level: 1, content: 'Run "npx prisma format" to clean up your schema', unlockMinutes: 5 }
    ],
    codeSnippets: [
      { language: 'prisma', code: 'model User {\n  id    String @id @default(cuid())\n  email String @unique\n}' }
    ],
    pitfalls: [' forgetting "npx prisma db push" to sync the database']
  },
  {
    order: 4,
    title: 'Core Feature Implementation',
    description: 'Implement the primary functionality of the application.',
    estimatedTime: '5-6 hours',
    videoUrl: 'https://www.youtube.com/embed/1r-F3FIONl8',
    hints: [
      { level: 1, content: 'Break down complex logic into smaller hooks', unlockMinutes: 10 }
    ],
    codeSnippets: [
      { language: 'tsx', code: 'const { data, error } = useSWR("/api/data", fetcher);' }
    ],
    pitfalls: ['Not handling loading and error states']
  },
  {
    order: 5,
    title: 'State Management & Interactions',
    description: 'Add interactivity and manage global state using tools like Zustand or Context.',
    estimatedTime: '4 hours',
    videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
    codeSnippets: [
      { language: 'typescript', code: 'const useStore = create((set) => ({ count: 0, inc: () => set((state) => ({ count: state.count + 1 })) }))' }
    ],
    pitfalls: ['Over-optimizing state before it is necessary']
  },
  {
    order: 6,
    title: 'Advanced Features & Optimization',
    description: 'Implement search, filtering, pagination, or performance improvements.',
    estimatedTime: '3-4 hours',
    videoUrl: 'https://www.youtube.com/embed/mZvKPtH9Fzo',
    codeSnippets: [
      { language: 'tsx', code: 'import { Suspense } from "react";\n<Suspense fallback={<Loading />}>\n  <HeavyComponent />\n</Suspense>' }
    ],
    pitfalls: ['Fetching too much data at once']
  },
  {
    order: 7,
    title: 'Deployment to Vercel',
    description: 'Prepare the application for production and deploy to Vercel.',
    estimatedTime: '2 hours',
    videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA',
    hints: [
      { level: 1, content: 'Check your build logs for errors', unlockMinutes: 5 }
    ],
    codeSnippets: [
      { language: 'bash', code: 'vercel --prod' }
    ],
    pitfalls: ['Missing environment variables in production']
  }
]

const getQuestions = () => [
  { stepOrder: 1, question: 'What command creates a new Next.js project?', options: ['npm create next-app', 'npx create-next-app', 'npm install next', 'next init'], correctIndex: 1, explanation: 'npx runs packages without installing globally.', order: 1 },
  { stepOrder: 1, question: 'Which file is the entry point for global styles?', options: ['styles.css', 'globals.css', 'app.css', 'main.css'], correctIndex: 1, explanation: 'Conventionally globals.css in the app directory.', order: 2 },
  { stepOrder: 1, question: 'What does npx prisma generate do?', options: ['Creates database', 'Generates TypeScript types', 'Runs migrations', 'Starts Studio'], correctIndex: 1, explanation: 'Generates Prisma Client with types.', order: 3 },
  { stepOrder: 1, question: 'Where should secrets like API keys be stored?', options: ['package.json', '.env file', 'public folder', 'code'], correctIndex: 1, explanation: '.env keeps secrets out of git.', order: 4 },
  { stepOrder: 1, question: 'What is the default port for Next.js dev server?', options: ['8080', '3000', '5000', '4200'], correctIndex: 1, explanation: 'localhost:3000 is the default.', order: 5 },
  { stepOrder: 2, question: 'Which component is used for client-side navigation?', options: ['<a>', '<Link>', '<NavLink>', '<Router>'], correctIndex: 1, explanation: 'next/link handles client-side transitions.', order: 1 },
  { stepOrder: 2, question: 'How do you mark a component as a Client Component?', options: ['"use client"', '"client-side"', 'import Client', 'No need'], correctIndex: 0, explanation: 'Add "use client" directive at the top.', order: 2 },
  { stepOrder: 2, question: 'What is the benefit of Server Components?', options: ['Interactivity', 'Direct database access', 'Browser APIs', 'OnClickListener'], correctIndex: 1, explanation: 'Server components can access backend resources securely.', order: 3 },
  { stepOrder: 2, question: 'Which Tailwind class adds padding on all sides?', options: ['m-4', 'p-4', 'pad-4', 'sp-4'], correctIndex: 1, explanation: 'p-4 adds 1rem padding.', order: 4 },
  { stepOrder: 2, question: 'How do you make a layout responsive in Tailwind?', options: ['media-queries', 'prefixed modifiers', 'flex-responsive', 'grid-auto'], correctIndex: 1, explanation: 'Using modifiers like md:flex changes styles at breakpoints.', order: 5 },
  { stepOrder: 3, question: 'What file defines your Prisma schema?', options: ['schema.sql', 'schema.prisma', 'database.js', 'models.ts'], correctIndex: 1, explanation: 'schema.prisma contains the data model definition.', order: 1 },
  { stepOrder: 3, question: 'Which command applies schema changes to the DB during dev?', options: ['prisma push', 'prisma db push', 'prisma migrate', 'prisma apply'], correctIndex: 1, explanation: 'db push checks for compatibility and updates the schema.', order: 2 },
  { stepOrder: 3, question: 'How do you define a unique field in Prisma?', options: ['@unique', 'unique=true', '@id', '@primary'], correctIndex: 0, explanation: 'The @unique attribute enforces uniqueness.', order: 3 },
  { stepOrder: 3, question: 'What mapping represents a one-to-many relation?', options: ['Object / Array', 'String / Int', 'Boolean / Float', 'None'], correctIndex: 0, explanation: 'One side has the Object relation, the other has the Array.', order: 4 },
  { stepOrder: 3, question: 'Why use environment variables for DB URL?', options: ['Security', 'Speed', 'Required by SQL', 'Easier typing'], correctIndex: 0, explanation: 'To prevent exposing credentials in code.', order: 5 },
  { stepOrder: 4, question: 'What is the best way to fetch data in a Server Component?', options: ['useEffect', 'async/await', 'axios', 'XHR'], correctIndex: 1, explanation: 'Server Components are async, so you can await data directly.', order: 1 },
  { stepOrder: 4, question: 'How do you handle "Not Found" pages dynamically?', options: ['return 404', 'notFound() function', 'Error Component', 'Redirect'], correctIndex: 1, explanation: 'Import notFound from next/navigation.', order: 2 },
  { stepOrder: 4, question: 'What is ISR?', options: ['Incremental Static Regeneration', 'Internal Server Rendering', 'Immediate State React', 'None'], correctIndex: 0, explanation: 'Allows updating static pages after build.', order: 3 },
  { stepOrder: 4, question: 'How do you create a dynamic route?', options: ['[slug]', '{slug}', ':slug', '*slug*'], correctIndex: 0, explanation: 'Brackets [param] denote dynamic segments.', order: 4 },
  { stepOrder: 4, question: 'Where do API routes live in App Router?', options: ['pages/api', 'app/api/route.ts', 'server/api', 'backend/index.js'], correctIndex: 1, explanation: 'In app directory, usually route.ts files.', order: 5 },
  { stepOrder: 5, question: 'Which hook manages complex state logic?', options: ['useState', 'useReducer', 'useEffect', 'useRef'], correctIndex: 1, explanation: 'useReducer is better for complex state transitions.', order: 1 },
  { stepOrder: 5, question: 'What library is popular for global state in React?', options: ['JQuery', 'Zustand', 'Moments', 'Lodash'], correctIndex: 1, explanation: 'Zustand is a small, fast state management solution.', order: 2 },
  { stepOrder: 5, question: 'How do you persist state across reloads?', options: ['Session State', 'Cookies/LocalStorage', 'Global Variable', 'RAM'], correctIndex: 1, explanation: 'LocalStorage persists after browser close.', order: 3 },
  { stepOrder: 5, question: 'What is "Prop Drilling"?', options: ['Passing data deeply', 'Building props', 'Deleting props', 'Type checking'], correctIndex: 0, explanation: 'Passing props through many layers of components.', order: 4 },
  { stepOrder: 5, question: 'How to avoid Prop Drilling?', options: ['Context API', 'More props', 'Global variables', 'Ignore it'], correctIndex: 0, explanation: 'Context allows sharing values without explicitly passing props.', order: 5 },
  { stepOrder: 6, question: 'What is "Debouncing"?', options: ['Removing bugs', 'Delaying execution', 'Speeding up', 'Caching'], correctIndex: 1, explanation: 'Delaying a function (like search) until typing stops.', order: 1 },
  { stepOrder: 6, question: 'Why use separate "loading.tsx"?', options: ['Required by React', 'Show fallback UI instantly', 'Fixes bugs', 'Better CSS'], correctIndex: 1, explanation: 'Next.js automatically shows this while async page loads.', order: 2 },
  { stepOrder: 6, question: 'What is "Optimization"?', options: ['Writing less code', 'Improving performance', 'Using TypeScript', 'Deploying'], correctIndex: 1, explanation: 'Making the app faster and more efficient.', order: 3 },
  { stepOrder: 6, question: 'How do you optimize images in Next.js?', options: ['<img> tag', '<Image> component', 'CSS background', 'SVG'], correctIndex: 1, explanation: 'Next/Image handles resizing and compression automatically.', order: 4 },
  { stepOrder: 6, question: 'What is Code Splitting?', options: ['Deleting code', 'Loading only needed code', 'Formatting code', 'Comments'], correctIndex: 1, explanation: 'Splitting bundles to load only what is needed for the page.', order: 5 },
  { stepOrder: 7, question: 'What does "npm run build" do?', options: ['Starts server', 'Creates production optimized version', 'Installs deps', 'Runs tests'], correctIndex: 1, explanation: 'Compiles the app for production.', order: 1 },
  { stepOrder: 7, question: 'Why use Environment Variables in Vercel?', options: ['Convenience', 'Security & Config', 'Speed', 'Required'], correctIndex: 1, explanation: 'To manage secrets and config for different environments.', order: 2 },
  { stepOrder: 7, question: 'What is a "Cold Start"?', options: ['Server turning on', 'Function waking up', 'Slow network', 'First render'], correctIndex: 1, explanation: 'Delay when a serverless function starts after inactivity.', order: 3 },
  { stepOrder: 7, question: 'How do you check build errors?', options: ['Guess', 'Check Logs', 'Ignore them', 'Ask AI'], correctIndex: 1, explanation: 'Build logs show exact errors during compilation.', order: 4 },
  { stepOrder: 7, question: 'What is a "Preview Deployment"?', options: ['Live site', 'Test version for PRs', 'Localhost', 'Mockup'], correctIndex: 1, explanation: 'A deployment created for a specific branch or PR.', order: 5 }
]

async function main() {
  console.log('🌱 Starting comprehensive data seed for ALL projects...')
  const questions = getQuestions()

  for (const projectConfig of PROJECTS) {
    console.log(`\n📦 Processing Project: ${projectConfig.title} (${projectConfig.slug})...`)

    // 1. Upsert Project
    const project = await prisma.projectTemplate.upsert({
      where: { slug: projectConfig.slug },
      update: {
        title: projectConfig.title,
        description: projectConfig.description,
        technologies: projectConfig.technologies,
        resumeImpact: 5,
        category: 'Full-Stack',
        timeEstimate: '20-30 hours',
        difficulty: 'intermediate'
      },
      create: {
        slug: projectConfig.slug,
        title: projectConfig.title,
        description: projectConfig.description,
        technologies: projectConfig.technologies,
        resumeImpact: 5,
        category: 'Full-Stack',
        timeEstimate: '20-30 hours',
        difficulty: 'intermediate'
      }
    })

    console.log(`   - Project ID: ${project.id}`)

    // 2. Check/Create Steps
    const existingSteps = await prisma.step.count({ where: { projectTemplateId: project.id } })
    if (existingSteps === 0) {
      console.log(`   - Creating ${GENERIC_STEPS.length} steps...`)
      for (const stepTmpl of GENERIC_STEPS) {
        await prisma.step.create({
          data: {
            projectTemplateId: project.id,
            ...stepTmpl,
          }
        })
      }
    } else {
      console.log(`   - ${existingSteps} steps already exist. Skipping step creation.`)
    }

    // 3. Seed Quiz Questions
    const steps = await prisma.step.findMany({
      where: { projectTemplateId: project.id },
      orderBy: { order: 'asc' }
    })

    let questionCount = 0
    for (const q of questions) {
      // Find the corresponding step ID for this project
      const step = steps.find(s => s.order === q.stepOrder)
      if (!step) continue

      // Use Upsert to handle collisions on (stepId, order)
      await prisma.quizQuestion.upsert({
        where: {
          stepId_order: {
            stepId: step.id,
            order: q.order
          }
        },
        update: {
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          difficulty: 'medium'
        },
        create: {
          stepId: step.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          order: q.order,
          difficulty: 'medium'
        }
      })
      questionCount++
    }
    console.log(`   - Seeded ${questionCount} new questions.`)
  }

  const totalQ = await prisma.quizQuestion.count()
  console.log(`\n✅ Final Quiz Question Count: ${totalQ}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
