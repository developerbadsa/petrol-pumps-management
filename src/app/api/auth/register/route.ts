import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { setToken } from '@/lib/auth/cookies';

export async function POST(req: Request) {
  const body = await req.json();

  const data = await apiFetch<{ access_token: string; user: any }>('/register', {
    method: 'POST',
    body,
  });

  setToken(data.access_token);
  return NextResponse.json({ user: data.user });
}
