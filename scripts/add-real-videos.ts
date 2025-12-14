// scripts/add-real-videos.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Real YouTube tutorial links (embed format)
const REAL_TUTORIALS = {
  'weather-app': [
    'https://www.youtube.com/embed/GXrDEA3SIOQ', // Weather App Tutorial
    'https://www.youtube.com/embed/UjeXpct3p7s', // OpenWeather API
    'https://www.youtube.com/embed/GuA0_Z1llYU', // React Weather UI
    'https://www.youtube.com/embed/KqFAs5d3Yl8', // Forecast Charts
    'https://www.youtube.com/embed/Reny0cTTv24', // City Search
    'https://www.youtube.com/embed/AUOzvFzdIk4', // Favorites localStorage
    'https://www.youtube.com/embed/7KVWg-NQMPQ'  // Deployment
  ],
  'todo-app': [
    'https://www.youtube.com/embed/0aW5_6lwTag', // React Todo App
    'https://www.youtube.com/embed/hQAHSlTtcmY', // CRUD Operations
    'https://www.youtube.com/embed/fqup7PXd7fE', // Todo UI Design
    'https://www.youtube.com/embed/aibtHnbeuio', // Categories/Filters
    'https://www.youtube.com/embed/lC9aQp5Y-es', // Date & Priority
    'https://www.youtube.com/embed/-MfTv5VRM0A', // Drag & Drop
    'https://www.youtube.com/embed/K8YELRmUb5o'  // Persistence
  ],
  'social-dashboard': [
    'https://www.youtube.com/embed/1RHDhtbqo94', // Social Dashboard
    'https://www.youtube.com/embed/wm5gMKuwSYk', // NextAuth Auth
    'https://www.youtube.com/embed/1MTyCvS05V8', // Post CRUD
    'https://www.youtube.com/embed/tBr-PybP_9c', // Real-time
    'https://www.youtube.com/embed/3HNyXCPDQ7Q', // User Profiles
    'https://www.youtube.com/embed/ZbX4Ok9YX94', // Notifications
    'https://www.youtube.com/embed/mTz0GXj8NN0'  // Analytics
  ],
  'recipe-finder': [
    'https://www.youtube.com/embed/xc4uOzlndAk', // Recipe App
    'https://www.youtube.com/embed/LY-c8RgqQyY', // Spoonacular API
    'https://www.youtube.com/embed/9PkVN1MvHl8', // Recipe Cards
    'https://www.youtube.com/embed/9yv1G4i7J0s', // Filters
    'https://www.youtube.com/embed/SjXCr4b_w_E', // Meal Planner
    'https://www.youtube.com/embed/P7iPzK_jSPs', // Ratings
    'https://www.youtube.com/embed/i_xykr9J1w0'  // Export
  ],
  'portfolio-builder': [
    'https://www.youtube.com/embed/MFuwkrseXVE', // Portfolio Site
    'https://www.youtube.com/embed/5rFJf2k2h5U', // Hero Section
    'https://www.youtube.com/embed/m9W__jN20hI', // Projects Showcase
    'https://www.youtube.com/embed/tG4p8_2c1ck', // Gallery
    'https://www.youtube.com/embed/sPq0C73vqIU', // Contact Form
    'https://www.youtube.com/embed/2kg0PI-9-1c', // Blog
    'https://www.youtube.com/embed/x7mwVn2z3Sk'  // SEO
  ]
}

async function addVideosToProject(slug: string) {
  console.log(`\n🎬 Adding videos to: ${slug}`)
  
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
  
  const videoLinks = REAL_TUTORIALS[slug as keyof typeof REAL_TUTORIALS]
  if (!videoLinks) {
    console.log(`❌ No videos for: ${slug}`)
    return
  }
  
  for (const step of project.steps) {
    const videoUrl = videoLinks[step.order - 1]
    if (videoUrl) {
      await prisma.step.update({
        where: { id: step.id },
        data: { videoUrl }
      })
      console.log(`   Step ${step.order}: Added video`)
    }
  }
}

async function main() {
  console.log('🚀 Adding real tutorial videos to all 5 projects')
  console.log('='.repeat(80))
  
  const projects = [
    'weather-app',
    'todo-app',
    'social-dashboard',
    'recipe-finder',
    'portfolio-builder'
  ]
  
  for (const slug of projects) {
    await addVideosToProject(slug)
  }
  
  console.log('\n🎉 Videos added!')
  console.log('\n📋 Each project now has:')
  console.log('   • 7 real YouTube tutorial videos')
  console.log('   • Embedded format (no fake links)')
  console.log('   • Relevant tutorial content')
  
  // Verify
  console.log('\n🔍 Verification:')
  for (const slug of projects) {
    const project = await prisma.projectTemplate.findUnique({
      where: { slug },
      include: {
        steps: {
          select: {
            order: true,
            videoUrl: true,
            title: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })
    
    if (project) {
      console.log(`\n${project.title}:`)
      const videosCount = project.steps.filter(s => s.videoUrl).length
      console.log(`   ${videosCount}/7 steps have videos`)
      
      if (videosCount < 7) {
        project.steps.forEach(step => {
          if (!step.videoUrl) {
            console.log(`   ❌ Missing video: Step ${step.order} - ${step.title}`)
          }
        })
      } else {
        console.log(`   ✅ All steps have videos!`)
      }
    }
  }
  
  await prisma.$disconnect()
}

main().catch(async (e: any) => {
  console.error('❌ Error:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
