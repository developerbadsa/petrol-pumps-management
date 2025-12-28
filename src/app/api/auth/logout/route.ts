import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { clearToken, getToken } from '@/lib/auth/cookies';

export async function POST() {
  try {
    const token = await getToken();
    if (token) {
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
