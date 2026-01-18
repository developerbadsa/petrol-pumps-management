export function resolveMethod(req: Request) {
  if (req.method !== 'POST') {
    return req.method;
  }
  const url = new URL(req.url);
  const override = url.searchParams.get('_method');
  if (override && override.toUpperCase() === 'PUT') {
    return 'PUT';
  }
  return 'POST';
}
