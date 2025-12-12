import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ hasCertificates: false })
    }

    const count = await prisma.startedProject.count({
      where: {
        userId: session.user.id,
        certificateEligible: true
      }
    })

    return NextResponse.json({ hasCertificates: count > 0 })
  } catch (error) {
    return NextResponse.json({ hasCertificates: false })
  }
}
