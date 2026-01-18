import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const divisions = await prisma.division.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(divisions, { status: 200 });
}
