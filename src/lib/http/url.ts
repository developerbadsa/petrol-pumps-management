export function toAbsoluteUrl(origin: string, pathOrUrl?: string | null) {
  if (!pathOrUrl) return '';
  if (/^data:/i.test(pathOrUrl) || /^blob:/i.test(pathOrUrl)) return pathOrUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin.replace(/\/+$/, '')}${p}`;
}

export function laravelOrigin() {
  const o = process.env.NEXT_PUBLIC_LARAVEL_ORIGIN;
  if (!o) throw new Error('NEXT_PUBLIC_LARAVEL_ORIGIN is missing');
  return o;
}
