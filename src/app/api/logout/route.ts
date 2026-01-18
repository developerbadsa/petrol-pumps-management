import { NextResponse } from 'next/server';
import { getBearerToken, revokeToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  await revokeToken(token);

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
