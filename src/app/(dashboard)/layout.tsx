import {redirect} from 'next/navigation';
import {getToken} from '@/lib/auth/cookies';
import {laravelFetch, LaravelHttpError} from '@/lib/http/laravelFetch';
import {AuthProvider, type AuthUser} from '@/features/auth/AuthProvider';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) redirect('/login');

  let user: AuthUser;

  try {
    user = await laravelFetch<AuthUser>('/me', { method: 'GET', auth: true });
  } catch (e) {
    if (e instanceof LaravelHttpError && e.status === 401) {
      redirect('/api/auth/logout?next=/login');
    }
    throw e;
  }

  return (
    <AuthProvider initialUser={user}>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
