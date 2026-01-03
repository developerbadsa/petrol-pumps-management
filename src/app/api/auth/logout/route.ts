import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { clearToken, getToken } from '@/lib/auth/cookies';

async function backendLogoutIfPossible() {
  const token = await getToken();
  if (token) {
    await apiFetch('/logout', { method: 'POST', auth: true });
  }
}

export async function POST() {
  try {
    await backendLogoutIfPossible();
  } catch {
  } finally {
    await clearToken();
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/login';

  try {
    await backendLogoutIfPossible();
  } catch {
  } finally {
    await clearToken();
  }

  return NextResponse.redirect(new URL(next, url));
}
