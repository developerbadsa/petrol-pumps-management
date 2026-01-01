import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { getToken } from '@/lib/auth/cookies';
import { env } from '@/lib/env';
import { mockApiFetch } from '@/lib/mockApi';

export async function GET() {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

    if (env.dataMode === 'mock') {
      const mock = mockApiFetch('/me', { method: 'GET', auth: true });
      if (mock.status >= 400) {
        return NextResponse.json(mock.data ?? { message: 'Server error' }, { status: mock.status });
      }
      return NextResponse.json(mock.data);
    }

    const user = await apiFetch<any>('/me', { auth: true });
    return NextResponse.json(user);
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json(e?.data ?? { message: 'Server error' }, { status });
  }
}
