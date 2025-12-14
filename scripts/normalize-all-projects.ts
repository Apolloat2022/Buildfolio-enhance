// scripts/normalize-all-projects.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Remove fake YouTube links (set to null for now)
const REMOVE_FAKE_VIDEOS = true

// Real YouTube embed links (similar to E-commerce) or null
const REAL_EMBED_LINKS: Record<string, string[]> = {
  'weather-app': [
    'https://www.youtube.com/embed/GXrDEA3SIOQ', // Weather app tutorial
    'https://www.youtube.com/embed/UjeXpct3p7s', // API integration
    'https://www.youtube.com/embed/GuA0_Z1llYU', // UI design
    'https://www.youtube.com/embed/KqFAs5d3Yl8', // Charts
    'https://www.youtube.com/embed/Reny0cTTv24', // Search
    'https://www.youtube.com/embed/AUOzvFzdIk4', // localStorage
    'https://www.youtube.com/embed/7KVWg-NQMPQ'  // Deployment
  ],
  'todo-app': [
    'https://www.youtube.com/embed/Rh3tobg7hEo', // Todo tutorial
    'https://www.youtube.com/embed/0ZJgIjIuY7U', // State management
    'https://www.youtube.com/embed/fqup7PXd7fE', // CRUD operations
    'https://www.youtube.com/embed/aibtHnbeuio', // Categories
    'https://www.youtube.com/embed/lC9aQp5Y-es', // Dates
    'https://www.youtube.com/embed/-MfTv5VRM0A', // Drag & drop
    'https://www.youtube.com/embed/K8YELRmUb5o'  // Persistence
  ],
  'social-dashboard': [
    'https://www.youtube.com/embed/1RHDhtbqo94', // Dashboard tutorial
    'https://www.youtube.com/embed/wm5gMKuwSYk', // Authentication
    'https://www.youtube.com/embed/1MTyCvS05V8', // CRUD
    'https://www.youtube.com/embed/tBr-PybP_9c', // WebSockets
    'https://www.youtube.com/embed/3HNyXCPDQ7Q', // Profiles
    'https://www.youtube.com/embed/ZbX4Ok9YX94', // Notifications
    'https://www.youtube.com/embed/mTz0GXj8NN0'  // Admin panel
  ],
  'recipe-finder': [
    'https://www.youtube.com/embed/xc4uOzlndAk', // Recipe app
    'https://www.youtube.com/embed/LY-c8RgqQyY', // API integration
    'https://www.youtube.com/embed/9PkVN1MvHl8', // Cards
    'https://www.youtube.com/embed/9yv1G4i7J0s', // Filters
    'https://www.youtube.com/embed/SjXCr4b_w_E', // Meal planner
    'https://www.youtube.com/embed/P7iPzK_jSPs', // Ratings
    'https://www.youtube.com/embed/i_xykr9J1w0'  // Export
  ],
  'portfolio-builder': [
    'https://www.youtube.com/embed/MFuwkrseXVE', // Portfolio
    'https://www.youtube.com/embed/5rFJf2k2h5U', // Hero
    'https://www.youtube.com/embed/m9W__jN20hI', // Projects
    'https://www.youtube.com/embed/tG4p8_2c1ck', // Gallery
    'https://www.youtube.com/embed/sPq0C73vqIU', // Contact
    'https://www.youtube.com/embed/2kg0PI-9-1c', // Blog
    'https://www.youtube.com/embed/x7mwVn2z3Sk'  // SEO
  ]
}

// Convert simple code strings to structured objects like E-commerce
function structureCodeSnippets(simpleCode: any, language = "typescript"): any[] {
  if (!simpleCode) {
    return [{
      code: "// Add your code here",
      language: "typescript"
    }]
  }
  
  if (Array.isArray(simpleCode)) {
    // If it's already structured like E-commerce, return as-is
    if (simpleCode.length > 0 && typeof simpleCode[0] === 'object' && 'code' in simpleCode[0]) {
      return simpleCode
    }
    
    // Convert array of strings to structured objects
    return simpleCode.map((code: string, index: number) => ({
      code: code,
      language: index === 0 && code.includes('npm install') ? 'bash' : language
    }))
  }
  
  // Single string
  return [{
    code: simpleCode,
    language: language
  }]
}

// Structure hints like E-commerce (with level, content, unlockMinutes)
function structureHints(simpleHints: any[]): any[] {
  if (!Array.isArray(simpleHints) || simpleHints.length === 0) {
    return [
      {
        level: 1,
        content: 'Review the step instructions carefully',
        unlockMinutes: 5
      },
      {
        level: 2,
        content: 'Check the code snippet for implementation details',
        unlockMinutes: 10
      },
      {
        level: 3,
        content: 'Refer to documentation or search for similar patterns',
        unlockMinutes: 15
      }
    ]
  }
  
  // If already structured (has level property), return as-is
  if (simpleHints[0] && typeof simpleHints[0] === 'object' && 'level' in simpleHints[0]) {
    return simpleHints
  }
  
  // Convert simple strings to structured hints
  return simpleHints.map((hint: string, index: number) => ({
    level: index + 1,
    content: hint,
    unlockMinutes: (index + 1) * 5
  }))
}

// Fix E-commerce missing hints (steps 5,6,7)
function fixEcommerceHints(): any[] {
  return [
    {
      level: 1,
      content: 'Review the step instructions carefully',
      unlockMinutes: 5
    },
    {
      level: 2,
      content: 'Check the code snippet for implementation details',
      unlockMinutes: 10
    },
    {
      level: 3,
      content: 'Refer to documentation or search for similar patterns',
      unlockMinutes: 15
    }
  ]
}

async function normalizeProject(slug: string) {
  console.log(`\n🔄 Normalizing project: ${slug}`)
  
  const project = await prisma.projectTemplate.findUnique({
    where: { slug },
    include: {
      steps: {
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (!project) {
    console.log(`❌ Project not found: ${slug}`)
    return
  }
  
  const realLinks = REAL_EMBED_LINKS[slug]
  
  for (const step of project.steps) {
    const updateData: any = {}
    const stepIndex = step.order - 1
    
    // 1. Fix video URL (use real embed link or remove fake ones)
    if (realLinks && realLinks[stepIndex]) {
      updateData.videoUrl = realLinks[stepIndex]
      console.log(`   Step ${step.order}: Using real YouTube embed`)
    } else if (REMOVE_FAKE_VIDEOS && step.videoUrl?.includes('XYZ-')) {
      updateData.videoUrl = null
      console.log(`   Step ${step.order}: Removed fake YouTube link`)
    }
    
    // 2. Structure code snippets like E-commerce
    if (slug !== 'ecommerce-store') {
      updateData.codeSnippets = structureCodeSnippets(step.codeSnippets)
      console.log(`   Step ${step.order}: Structured code snippets`)
    }
    
    // 3. Structure hints like E-commerce
    updateData.hints = structureHints(step.hints as any[])
    
    // 4. Ensure pitfalls is an array
    if (!Array.isArray(step.pitfalls) || step.pitfalls.length === 0) {
      updateData.pitfalls = [
        'Common mistake 1',
        'Common mistake 2',
        'Common mistake 3'
      ]
    }
    
    // Apply updates
    if (Object.keys(updateData).length > 0) {
      await prisma.step.update({
        where: { id: step.id },
        data: updateData
      })
    }
  }
  
  // Also update category if null
  if (!project.category && slug !== 'ecommerce-store') {
    const categories: Record<string, string> = {
      'weather-app': 'api-integration',
      'todo-app': 'productivity',
      'social-dashboard': 'full-stack',
      'recipe-finder': 'search-ui',
      'portfolio-builder': 'design'
    }
    
    await prisma.projectTemplate.update({
      where: { slug },
      data: { category: categories[slug] || 'web-dev' }
    })
    console.log(`   Added category: ${categories[slug]}`)
  }
}

async function fixEcommerceMissingHints() {
  console.log('\n🔧 Fixing E-commerce missing hints...')
  
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: {
      steps: {
        where: {
          OR: [
            { hints: null },
            { hints: { equals: [] } }
          ]
        },
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (!ecommerce) return
  
  for (const step of ecommerce.steps) {
    await prisma.step.update({
      where: { id: step.id },
      data: { hints: fixEcommerceHints() }
    })
    console.log(`   Step ${step.order}: Added missing hints`)
  }
}

async function main() {
  console.log('🚀 Normalizing all projects to match E-commerce structure')
  console.log('='.repeat(80))
  
  // First, fix E-commerce missing hints
  await fixEcommerceMissingHints()
  
  // Then normalize all other projects
  const allProjects = [
    'weather-app',
    'todo-app',
    'social-dashboard',
    'recipe-finder',
    'portfolio-builder',
    'ecommerce-store' // Also normalize to ensure consistency
  ]
  
  for (const slug of allProjects) {
    await normalizeProject(slug)
  }
  
  console.log('\n🎉 All projects normalized!')
  console.log('\n📋 Changes made:')
  console.log('1. ✅ Removed fake YouTube links (or added real embed links)')
  console.log('2. ✅ Structured all code snippets like E-commerce (with language)')
  console.log('3. ✅ Structured all hints like E-commerce (with level, unlockMinutes)')
  console.log('4. ✅ Fixed E-commerce missing hints (steps 5,6,7)')
  console.log('5. ✅ Added categories to projects missing them')
  
  // Verify
  console.log('\n🔍 Verification:')
  const projects = await prisma.projectTemplate.findMany({
    where: { slug: { in: allProjects } },
    include: {
      steps: {
        select: {
          order: true,
          videoUrl: true,
          hints: true
        },
        orderBy: { order: 'asc' }
      }
    }
  })
  
  for (const project of projects) {
    console.log(`\n${project.title}:`)
    console.log(`  Category: ${project.category || 'none'}`)
    
    const stepsWithIssues = project.steps.filter(step => {
      const hasHints = Array.isArray(step.hints) && step.hints.length > 0
      const hasFakeVideo = step.videoUrl?.includes('XYZ-')
      return !hasHints || hasFakeVideo
    })
    
    if (stepsWithIssues.length === 0) {
      console.log(`  ✅ All steps normalized`)
    } else {
      console.log(`  ⚠️  ${stepsWithIssues.length} steps need attention`)
    }
  }
  
  await prisma.$disconnect()
}

main().catch(async (e: any) => {
  console.error('❌ Error:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
