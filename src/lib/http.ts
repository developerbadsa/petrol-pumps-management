type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

type RequestOptions = {
  method?: HttpMethod;
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  signal?: AbortSignal;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

function buildUrl(path: string, params?: RequestOptions['params']) {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    params,
    body,
    headers,
    token,
    cache = 'no-store',
    next,
    signal,
  } = opts;

  const res = await fetch(buildUrl(path, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache,
    next,
    signal,
  });

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    const err: ApiError = {
      status: res.status,
      message:
        (payload && typeof payload === 'object' && 'message' in payload && String((payload as any).message)) ||
        res.statusText ||
        'Request failed',
      details: payload,
    };
    throw err;
  }

  return (await parseJsonSafe(res)) as T;
}
