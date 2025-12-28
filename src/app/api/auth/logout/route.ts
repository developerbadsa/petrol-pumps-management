import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { clearToken, getToken } from '@/lib/auth/cookies';

export async function POST() {
  try {
    const token = await getToken();
    if (token) {
      await apiFetch('/logout', { method: 'POST', auth: true });
    }
  } finally {
    clearToken();
  }

  return NextResponse.json({ message: 'Logged out' });
}
