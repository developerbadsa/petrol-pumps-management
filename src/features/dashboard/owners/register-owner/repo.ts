import type { RegisterOwnerInput, RegisterOwnerResult } from './types';

async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(' ') : null) ||
      res.statusText ||
      'Request failed';

    const err: any = new Error(msg);
    err.status = res.status;
    err.errors = data?.errors ?? null;
    throw err;
  }

  return data;
}

export async function registerOwnerRepo(input: RegisterOwnerInput): Promise<RegisterOwnerResult> {
  const res = await fetch('/api/station-owners/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await readJsonOrThrow(res);

  // API route returns { id, owner }
  const id = data?.id ?? data?.owner?.id ?? data?.owner?.station_owner?.id;
  if (!id) throw new Error('Registration succeeded but id missing');

  return { id: String(id) };
}
