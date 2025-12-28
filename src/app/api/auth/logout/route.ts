import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { clearToken } from '@/lib/auth/cookies';

export async function POST() {
  await apiFetch('/logout', { method: 'POST', auth: true });
  clearToken();
  return NextResponse.json({ ok: true });
}
