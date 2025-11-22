// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Member 테이블에 잘 접속되는지만 확인 (1개만 세어보기)
    const count = await prisma.member.count();

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      memberCount: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error?.message || 'unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
