import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { created_at: 'desc' } });
  return NextResponse.json(videos, { status: 200 });
}
