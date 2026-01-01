import 'server-only';
import '@/lib/http/undici-global';
import { getToken } from '@/lib/auth/cookies';
import { env } from '@/lib/env';
import { mockApiFetch } from '@/lib/mockApi';

const BASE = process.env.API_BASE_URL;
if (!BASE && env.dataMode !== 'mock') throw new Error('Missing env: API_BASE_URL');

type ApiFetchOpts = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
};

export async function apiFetch<T>(path: string, opts: ApiFetchOpts = {}): Promise<T> {
  if (env.dataMode === 'mock') {
    if (opts.auth) {
      const token = await getToken();
      if (!token) throw { status: 401, data: { message: 'Unauthenticated' }, url: path };
    }
    const mock = mockApiFetch(path, { method: opts.method, body: opts.body, auth: opts.auth });
    if (mock.status >= 400) throw { status: mock.status, data: mock.data, url: path };
    return mock.data as T;
  }

  const token = opts.auth ? await getToken() : null;

  const url = path.startsWith('http')
    ? path
    : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(30_000),
  });

  const ct = res.headers.get('content-type') ?? '';
  const data = ct.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) throw { status: res.status, data, url };
  return data as T;
}
