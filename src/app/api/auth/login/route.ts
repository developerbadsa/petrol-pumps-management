import { NextResponse } from 'next/server';
import { setToken } from '@/lib/auth/cookies';

const BASE = process.env.API_BASE_URL!;

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(data ?? { message: 'Login failed' }, { status: res.status });
  }

  // backend returns access_token + user
  await setToken(data.access_token);

  return NextResponse.json({ user: data.user });
}
