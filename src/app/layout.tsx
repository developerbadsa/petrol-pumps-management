import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Providers from './providers';
import './globals.css';

import { AuthProvider, type AuthUser } from '@/features/auth/AuthProvider';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';
import { getToken, clearToken } from '@/lib/auth/cookies';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LPG Association',
  description: 'LPG Association Website',
};

const SHOW_DASHBOARD_TEST_LINK = process.env.NEXT_PUBLIC_SHOW_DASHBOARD_TEST_LINK === '1';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token = await getToken();

  let user: AuthUser | null = null;

  if (token) {
    try {
      user = await laravelFetch<AuthUser>('/me', { method: 'GET', auth: true });
    } catch (e: any) {
      if (e instanceof LaravelHttpError && e.status === 401) {
        clearToken();
      }
      user = null;
    }
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {SHOW_DASHBOARD_TEST_LINK ? (
          <div className="w-full text-center">
            <span>see dashboard only testing mode </span>
            <Link className="font-bold text-blue-700" href="/dashboard">
              Dashboard
            </Link>
          </div>
        ) : null}

        <Providers>
          <AuthProvider initialUser={user}>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
