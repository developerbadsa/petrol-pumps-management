import { redirect } from 'next/navigation';
import { getToken } from '@/lib/auth/cookies';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();

  // already logged in => no access to login/register pages
  if (token) redirect('/dashboard');

  return <>{children}</>;
}
