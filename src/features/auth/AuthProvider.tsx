'use client';

import React, {createContext, useContext, useMemo, useState, useCallback} from 'react';

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
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', {cache: 'no-store'});
      if (!res.ok) {
        setUser(null);
        return;
      }
      const u = (await res.json()) as AuthUser;
      setUser(u);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {method: 'POST'});
      setUser(null);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }, []);

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
