// app/api/showcase/like/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { showcaseId } = await req.json()

    await prisma.showcase.update({
      where: { id: showcaseId },
      data: { likes: { increment: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error liking showcase:', error)
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 })
  }
}