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

    if (!question) {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 })
    }

    if (!process.env.REQUESTY_API_KEY) {
      console.error('REQUESTY_API_KEY not found')
      return NextResponse.json({ 
        answer: 'AI is not configured. Please add REQUESTY_API_KEY to environment variables.' 
      })
    }

    const systemPrompt = 'You are a helpful coding tutor. Answer questions clearly and concisely with code examples when helpful. Keep responses under 300 words.'

    console.log('Calling Requesty API...')
    
    const response = await fetch('https://router.requesty.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REQUESTY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    console.log('Requesty response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Requesty API error:', response.status, errorText)
      return NextResponse.json({ 
        answer: `API Error (${response.status}): ${errorText.substring(0, 100)}` 
      })
    }

    const data = await response.json()
    console.log('Requesty response received')

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid Requesty response structure:', data)
      return NextResponse.json({ 
        answer: 'Received invalid response from AI. Please try again.' 
      })
    }

    return NextResponse.json({
      answer: data.choices[0].message.content
    })

  } catch (error) {
    console.error('AI Ask error:', error)
    return NextResponse.json({
      answer: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

