'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
   useEffect,
} from 'react';
import { useRouter } from 'next/navigation';

export type AuthUser = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role?: string;
};

type AuthState = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(false);

  // Prevent refresh() races
  const inFlight = useRef<Promise<void> | null>(null);

  const refresh = useCallback(async () => {
    if (inFlight.current) return inFlight.current;

    setLoading(true);

    const p = (async () => {
      let res: Response;
      try {
        res = await fetch('/api/auth/me', {
          method: 'GET',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          credentials: 'include',
        });
      } catch {
        // Network error: do NOT log out
        return;
      }

      if (res.status === 401) {
        // Only log out on explicit auth failure
        setUser(null);
        return;
      }

      if (!res.ok) {
        // Any other server error: keep current user
        return;
      }

      const u = (await res.json()) as AuthUser;
      setUser(u);
    })().finally(() => {
      inFlight.current = null;
      setLoading(false);
    });

    inFlight.current = p;
    return p;
  }, []);

//   useEffect(() => {
//   if (!initialUser) refresh();
// }, [initialUser, refresh]);


  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Even if this fails, we still clear local state and move to /login
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
    } finally {
      setUser(null);
      router.replace('/login');
      router.refresh();
      setLoading(false);
    }
  }, [router]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoggedIn: !!user,
      loading,
      refresh,
      setUser,
      logout,
    }),
    [user, loading, refresh, logout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
