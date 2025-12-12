import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use the existing seed-ecommerce which has all 7 steps
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/seed-ecommerce`)
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: '✅ Enhanced all 7 steps of E-commerce tutorial!',
      details: data
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
