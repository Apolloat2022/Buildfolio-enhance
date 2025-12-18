import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function verify() {
  console.log('\n🔍 VERIFICATION CHECK\n')
  
  // 1. Check APIs exist (via count)
  const quizCount = await prisma.quizQuestion.count()
  console.log(`✅ Quiz questions in DB: ${quizCount}`)
  
  // 2. Check if user has progress
  const user = await prisma.user.findFirst({
    include: {
      startedProjects: {
        include: {
          projectTemplate: {
            include: { steps: true }
          }
        }
      }
    }
  })
  
  if (!user) {
    console.log('❌ No user found')
    return
  }
  
  console.log(`\n👤 User: ${user.email}`)
  console.log(`🎯 Points: ${user.points}`)
  console.log(`📊 Level: ${user.level}`)
  
  if (user.startedProjects.length === 0) {
    console.log('\n⚠️  No projects started yet')
    console.log('   Go to project page and click "Take Quiz & Mark Complete"')
  } else {
    user.startedProjects.forEach(sp => {
      console.log(`\n📦 Project: ${sp.projectTemplate.title}`)
      console.log(`   Progress: ${sp.progress}%`)
      console.log(`   Completed: ${sp.completedSteps.length}/${sp.projectTemplate.steps.length}`)
      console.log(`   Status: ${sp.status}`)
      console.log(`   Certificate: ${sp.certificateEligible ? '✅ ELIGIBLE' : '❌ Not yet'}`)
    })
  }
  
  console.log('\n✅ Verification complete!')
}

verify().then(() => process.exit(0))
