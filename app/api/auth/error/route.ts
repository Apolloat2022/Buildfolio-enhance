// app/api/auth/error/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  
  return NextResponse.json({
    error: error || 'Unknown error',
    timestamp: new Date().toISOString(),
  });
}