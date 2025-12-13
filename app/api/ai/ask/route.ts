import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question, stepId } = await req.json()

    if (!question || !stepId) {
      return NextResponse.json({ error: 'Missing question or stepId' }, { status: 400 })
    }

    // Get step context
    const step = await prisma.step.findUnique({
      where: { id: stepId },
      include: { projectTemplate: true }
    })

    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }

    // Build context-aware prompt
    const systemPrompt = `You are an expert coding tutor helping students build "${step.projectTemplate.title}".

Current Step: "${step.title}"
Step Description: ${step.description || 'Building this feature'}

Your role:
- Answer questions clearly and concisely
- Provide code examples when helpful
- Explain WHY things work, not just HOW
- Encourage best practices
- Be supportive and patient
- Keep responses under 300 words unless code examples are needed

Teaching style:
- Start with a clear answer
- Then explain the reasoning
- Provide an example if relevant
- End with a tip or best practice`

    // Call Groq API (FREE!)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Track usage (optional - for analytics)
    await prisma.aIUsage.create({
      data: {
        userId: session.user.id,
        stepId,
        question,
        answer: data.choices[0].message.content,
        provider: 'groq'
      }
    }).catch(() => {}) // Don't fail if tracking fails

    return NextResponse.json({
      answer: data.choices[0].message.content,
      model: 'llama-3.1-70b-versatile'
    })

  } catch (error) {
    console.error('AI Ask error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    )
  }
}
