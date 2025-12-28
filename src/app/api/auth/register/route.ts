import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { setToken } from '@/lib/auth/cookies';

export async function POST(req: Request) {
  try {
    // IMPORTANT: register may be multipart if avatar exists.
    // For now, assume JSON (no avatar).
    const body = await req.json();

    const data = await apiFetch<any>('/register', {
      method: 'POST',
      body,
      auth: false,
    });

    // backend returns access_token (your doc shows it does)
    if (data?.access_token) setToken(data.access_token);

    return NextResponse.json({ ok: true, user: data?.user ?? null }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      e?.data ?? { message: 'Registration failed' },
      { status: e?.status ?? 500 }
    );
  }
}
