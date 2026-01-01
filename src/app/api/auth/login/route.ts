import { NextResponse } from 'next/server';
import { setToken } from '@/lib/auth/cookies';
import { env } from '@/lib/env';
import { mockApiFetch } from '@/lib/mockApi';

const BASE = process.env.API_BASE_URL;

export async function POST(req: Request) {
  const body = await req.json();

  if (env.dataMode === 'mock') {
    const mock = mockApiFetch('/login', { method: 'POST', body, auth: false });
    if (mock.status >= 400) {
      return NextResponse.json(mock.data ?? { message: 'Login failed' }, { status: mock.status });
    }
    if (mock.data?.access_token) await setToken(mock.data.access_token);
    return NextResponse.json({ user: mock.data?.user ?? null });
  }

  if (!BASE) {
    return NextResponse.json({ message: 'Missing API_BASE_URL' }, { status: 500 });
  }

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
