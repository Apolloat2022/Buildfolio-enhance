// app/api/snippets/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET - List snippets with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (language) where.language = language
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    const snippets = await prisma.snippet.findMany({
      where,
      orderBy: { usageCount: 'desc' }
    })

    return NextResponse.json({ snippets })
  } catch (error) {
    console.error('Error fetching snippets:', error)
    return NextResponse.json({ error: 'Failed to fetch snippets' }, { status: 500 })
  }
}

// POST - Track snippet usage
export async function POST(req: NextRequest) {
  try {
    const { snippetId } = await req.json()

    await prisma.snippet.update({
      where: { id: snippetId },
      data: { usageCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating snippet:', error)
    return NextResponse.json({ error: 'Failed to update snippet' }, { status: 500 })
  }
}