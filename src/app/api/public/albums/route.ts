import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const albums = await prisma.album.findMany({
    include: { images: true },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(albums, { status: 200 });
}
