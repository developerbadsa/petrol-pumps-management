import 'server-only';
import { cookies } from 'next/headers';

const NAME = process.env.AUTH_TOKEN_COOKIE ?? 'lpg_token';

export async function getToken(): Promise<string | null> {
  const c = await cookies();
  console.log(c.get(NAME))
  return c.get(NAME)?.value ?? null;
}

export async function setToken(token: string) {
  const c = await cookies();
  c.set(NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearToken() {
  const c = await cookies();
  c.set(NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}
