import { useState, useEffect, useCallback } from 'react';

const ADMIN_STORAGE_KEY = 'noir_admin_session_auth';
const MASTER_PASSWORD = 'noir2026';

export interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => { success: boolean; error?: string };
  logout: () => void;
  lastLoginTime: string | null;
  masterPasswordHint: string;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastLoginTime, setLastLoginTime] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.authenticated && parsed?.token === 'authorized_session') {
          setIsAuthenticated(true);
          setLastLoginTime(parsed?.timestamp || null);
        }
      }
    } catch {
      // In case of corrupt session storage
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((password: string): { success: boolean; error?: string } => {
    const trimmed = password.trim();
    if (!trimmed) {
      return { success: false, error: 'لطفاً رمز عبور مدیریت را وارد فرمایید.' };
    }

    if (trimmed === MASTER_PASSWORD || trimmed === 'admin@noir' || trimmed === 'noir-admin') {
      const now = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      const sessionData = {
        authenticated: true,
        token: 'authorized_session',
        timestamp: now,
      };
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));
      setIsAuthenticated(true);
      setLastLoginTime(now);
      return { success: true };
    }

    return { success: false, error: 'رمز عبور وارد شده نامعتبر است. دسترسی مجاز نیست.' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setLastLoginTime(null);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    lastLoginTime,
    masterPasswordHint: MASTER_PASSWORD,
  };
};
