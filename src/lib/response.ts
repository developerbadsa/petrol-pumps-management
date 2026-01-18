import { NextResponse } from 'next/server';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status: number, errors?: Record<string, string[]> | null) {
  return NextResponse.json(errors ? { message, errors } : { message }, { status });
}
