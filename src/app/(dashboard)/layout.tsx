import {redirect} from 'next/navigation';
import {getToken} from '@/lib/auth/cookies';
import {apiFetch} from '@/lib/http/apiFetch';
import {AuthProvider, type AuthUser} from '@/features/auth/AuthProvider';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const token = await getToken();
  if (!token) redirect('/login');

  // direct backend call server-side (fast, no extra client roundtrip)
  const user = await apiFetch<AuthUser | null>('/me', {auth: true});

  return (
    <AuthProvider initialUser={user}>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
