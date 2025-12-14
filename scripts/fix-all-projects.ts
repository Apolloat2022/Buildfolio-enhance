// scripts/normalize-all-projects-corrected.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Remove fake YouTube links (set to null for now)
const REMOVE_FAKE_VIDEOS = true

// Real YouTube embed links (similar to E-commerce) or null
const REAL_EMBED_LINKS: Record<string, string[]> = {
  'weather-app': [
    null, // No video for step 1
    null, // No video for step 2
    null, // No video for step 3
    null, // No video for step 4
    null, // No video for step 5
    null, // No video for step 6
    null  // No video for step 7
  ],
  'todo-app': [
    null, null, null, null, null, null, null
  ],
  'social-dashboard': [
    null, null, null, null, null, null, null
  ],
  'recipe-finder': [
    null, null, null, null, null, null, null
  ],
  'portfolio-builder': [
    null, null, null, null, null, null, null
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
function structureHints(simpleHints: any): any[] {
  if (!simpleHints) {
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
  
  // If it's already an array of structured hints, return as-is
  if (Array.isArray(simpleHints) && simpleHints.length > 0) {
    if (typeof simpleHints[0] === 'object' && 'level' in simpleHints[0]) {
      return simpleHints
    }
    
    // Convert simple strings to structured hints
    return simpleHints.map((hint: string, index: number) => ({
      level: index + 1,
      content: hint,
      unlockMinutes: (index + 1) * 5
    }))
  }
  
  // Fallback
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
    
    // 1. Fix video URL (remove fake ones)
    if (REMOVE_FAKE_VIDEOS && step.videoUrl?.includes('XYZ-')) {
      updateData.videoUrl = null
      console.log(`   Step ${step.order}: Removed fake YouTube link`)
    } else if (realLinks && realLinks[stepIndex]) {
      updateData.videoUrl = realLinks[stepIndex]
    }
    
    // 2. Structure code snippets like E-commerce
    const structuredCode = structureCodeSnippets(step.codeSnippets)
    if (JSON.stringify(structuredCode) !== JSON.stringify(step.codeSnippets)) {
      updateData.codeSnippets = structuredCode
      console.log(`   Step ${step.order}: Structured code snippets`)
    }
    
    // 3. Structure hints like E-commerce
    const structuredHints = structureHints(step.hints)
    if (JSON.stringify(structuredHints) !== JSON.stringify(step.hints)) {
      updateData.hints = structuredHints
      console.log(`   Step ${step.order}: Structured hints`)
    }
    
    // 4. Ensure pitfalls is an array
    if (!Array.isArray(step.pitfalls) || step.pitfalls.length === 0) {
      updateData.pitfalls = [
        'Common mistake 1: Not testing the code',
        'Common mistake 2: Missing error handling',
        'Common mistake 3: Forgetting to save changes'
      ]
      console.log(`   Step ${step.order}: Added pitfalls`)
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

async function fixAllProjects() {
  console.log('🚀 Fixing all projects (simplified version)')
  console.log('='.repeat(80))
  
  // First fix E-commerce hints if they're missing or null
  console.log('\n🔧 Checking E-commerce project...')
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: 'ecommerce-store' },
    include: {
      steps: {
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (ecommerce) {
    for (const step of ecommerce.steps) {
      // Check if hints is null or empty array
      if (!step.hints || (Array.isArray(step.hints) && step.hints.length === 0)) {
        const fixedHints = structureHints(step.hints)
        await prisma.step.update({
          where: { id: step.id },
          data: { hints: fixedHints }
        })
        console.log(`   Step ${step.order}: Fixed missing hints`)
      }
    }
  }
  
  // Then normalize all other projects
  const projectsToFix = [
    'weather-app',
    'todo-app',
    'social-dashboard',
    'recipe-finder',
    'portfolio-builder'
  ]
  
  for (const slug of projectsToFix) {
    await normalizeProject(slug)
  }
  
  console.log('\n🎉 All projects fixed!')
  console.log('\n📋 Summary of fixes:')
  console.log('1. ✅ Removed fake YouTube links (XYZ- links)')
  console.log('2. ✅ Structured all code snippets consistently')
  console.log('3. ✅ Structured all hints consistently')
  console.log('4. ✅ Added categories to projects')
  console.log('5. ✅ Fixed any missing hints in E-commerce')
  
  // Verify
  console.log('\n🔍 Verification:')
  const allProjects = [...projectsToFix, 'ecommerce-store']
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
    
    let hasFakeVideos = 0
    let hasMissingHints = 0
    
    for (const step of project.steps) {
      if (step.videoUrl?.includes('XYZ-')) hasFakeVideos++
      if (!step.hints || (Array.isArray(step.hints) && step.hints.length === 0)) hasMissingHints++
    }
    
    if (hasFakeVideos === 0 && hasMissingHints === 0) {
      console.log(`  ✅ All steps OK`)
    } else {
      console.log(`  ⚠️  ${hasFakeVideos} fake videos, ${hasMissingHints} missing hints`)
    }
  }
  
  await prisma.$disconnect()
}

fixAllProjects().catch(async (e: any) => {
  console.error('❌ Error:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
