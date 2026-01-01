import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { clearToken, getToken } from '@/lib/auth/cookies';
import { env } from '@/lib/env';
import { mockApiFetch } from '@/lib/mockApi';

export async function POST() {
  try {
    const token = await getToken();
    if (token && env.dataMode === 'mock') {
      mockApiFetch('/logout', { method: 'POST', auth: true });
    }
    if (token && env.dataMode !== 'mock') {
      // backend invalidates token
      await apiFetch('/logout', { method: 'POST', auth: true });
    }
  } catch {
    // even if backend fails, we still clear cookie locally
  } finally {
    clearToken();
  }

  return NextResponse.json({ ok: true });
}
