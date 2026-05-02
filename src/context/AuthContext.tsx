import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, problemDetailMessage } from '../api/client';
import type { AuthResponse, User } from '../types/api';

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    fullname: string;
    email: string;
    password: string;
    role: 'CLIENT' | 'TRANSPORTER';
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'loban_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistAuth = useCallback((res: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setUser(null);
      setAuthLoading(false);
      return;
    }
    try {
      const { data } = await api.get<User>('/api/users/me');
      setUser(data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
        persistAuth(data);
      } catch (e) {
        setError(problemDetailMessage(e));
        throw e;
      }
    },
    [persistAuth],
  );

  const register = useCallback(
    async (payload: {
      fullname: string;
      email: string;
      password: string;
      role: 'CLIENT' | 'TRANSPORTER';
    }) => {
      setError(null);
      try {
        const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
        persistAuth(data);
      } catch (e) {
        setError(problemDetailMessage(e));
        throw e;
      }
    },
    [persistAuth],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading: authLoading,
      error,
      login,
      register,
      logout,
      refreshUser,
      clearError,
    }),
    [user, token, authLoading, error, login, register, logout, refreshUser, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
