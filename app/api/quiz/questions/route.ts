import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'

export async function GET(request: NextRequest) {
  console.log('🔍 QUIZ API CALLED')
  
  try {
    const { searchParams } = new URL(request.url)
    const stepId = searchParams.get('stepId')
    
    console.log('Step ID from request:', stepId)
    
    // Validate stepId
    if (!stepId || stepId.trim() === '') {
      console.log('Invalid stepId, returning empty array')
      return NextResponse.json({ questions: [] })
    }
    
    // Optional: Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      console.log('No authenticated session')
      return NextResponse.json({ questions: [] })
    }
    
    console.log(`Fetching questions for step: ${stepId}`)
    
    // Fetch questions from database
    const questions = await prisma.quizQuestion.findMany({
      where: { 
        stepId: stepId 
      },
      orderBy: { 
        order: 'asc' 
      },
      select: {
        id: true,
        question: true,
        options: true,
        correctIndex: true,
        explanation: true,
        order: true,
        difficulty: true
      }
    })
    
    console.log(`Found ${questions.length} questions for step ${stepId}`)
    
    // ALWAYS return { questions: array } - NEVER undefined
    return NextResponse.json({ 
      questions: questions || []  // Ensure it's never undefined
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
    
  } catch (error) {
    console.error('❌ Quiz API ERROR:', error)
    
    // Return empty array on ANY error
    return NextResponse.json({ 
      questions: [] 
    }, { 
      status: 200,  // Still return 200 to avoid fetch errors
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
