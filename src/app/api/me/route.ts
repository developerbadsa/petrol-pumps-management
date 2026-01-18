import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  return NextResponse.json(auth.user, { status: 200 });
}
