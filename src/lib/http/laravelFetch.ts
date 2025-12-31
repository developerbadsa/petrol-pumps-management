import 'server-only';

import {getToken} from '@/lib/auth/cookies';

export type LaravelValidationErrors = Record<string, string[]>;

export class LaravelHttpError extends Error {
   status: number;
   errors?: LaravelValidationErrors;

   constructor(
      status: number,
      message: string,
      errors?: LaravelValidationErrors
   ) {
      super(message);
      this.status = status;
      this.errors = errors;
   }
}

function joinUrl(base: string, path: string) {
   const b = base.replace(/\/+$/, '');
   const p = path.startsWith('/') ? path : `/${path}`;
   return `${b}${p}`;
}

async function safeJson(res: Response) {
   const text = await res.text();
   if (!text) return null;
   try {
      return JSON.parse(text);
   } catch {
      return null;
   }
}

export async function laravelFetch<T>(
   path: string,
   init: RequestInit & {auth?: boolean} = {}
): Promise<T> {
   const base =
      process.env.API_BASE_URL ?? 'https://admin.petroleumstationbd.com/api';
   const url = joinUrl(base, path);
   const token = await getToken();
   const auth = init.auth ?? true;

   // Optional but recommended: fail fast
   if (auth && !token) {
      throw new LaravelHttpError(401, 'Unauthenticated');
   }

   const headers = new Headers(init.headers);
   headers.set('Accept', 'application/json');

   if (
      init.body &&
      !(init.body instanceof FormData) &&
      !headers.has('Content-Type')
   ) {
      headers.set('Content-Type', 'application/json');
   }

   if (auth && token) {
      headers.set('Authorization', `Bearer ${token}`);
   }

   const res = await fetch(url, {
      ...init,
      body: init.body,
      headers,
      cache: init.cache ?? 'no-store',
   });

   const data = await safeJson(res);

   if (!res.ok) {
      throw new LaravelHttpError(
         res.status,
         data?.message ?? res.statusText,
         data?.errors
      );
   }

   return data as T;
}
