import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';

export async function GET() {
  const user = await apiFetch<any>('/me', { auth: true });
  return NextResponse.json(user);
}
