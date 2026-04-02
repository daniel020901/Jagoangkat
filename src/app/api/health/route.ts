// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'UP',
      timestamp: new Date().toISOString(),
      message: 'API is running smoothly' 
    },
    { status: 200 }
  );
}