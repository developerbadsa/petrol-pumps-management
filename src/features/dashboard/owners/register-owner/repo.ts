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
  const profileImage = input.profileImage?.item(0) ?? null;
  const body =
    profileImage != null
      ? (() => {
          const payload = new FormData();
          payload.set('full_name', input.stationOwnerName);
          payload.set('email', input.email);
          payload.set('phone_number', input.phone);
          payload.set('password', input.password);
          payload.set('address', input.residentialAddress);
          payload.set('profile_image', profileImage);
          return payload;
        })()
      : JSON.stringify(input);

  const res = await fetch('/api/station-owners/register', {
    method: 'POST',
    headers:
      body instanceof FormData
        ? { Accept: 'application/json' }
        : { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
  });

  const data = await readJsonOrThrow(res);

  // API route returns { id, owner }
  const id = data?.id ?? data?.owner?.id ?? data?.owner?.station_owner?.id;
  if (!id) throw new Error('Registration succeeded but id missing');

  return { id: String(id) };
}
