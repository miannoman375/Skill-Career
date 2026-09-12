import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { API_URL, clearStoredSession, getStoredEmail, getStoredToken, storeSession, verifyAdminToken } from '@/lib/api';

interface AdminSession {
  email: string;
  token: string;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  session: null,
  loading: true,
  login: async () => {},
  signOut: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Page load/refresh par localStorage se token restore karo aur backend se
  // confirm karo. Token valid hai → logged-in rehna hai. Sirf tabhi logout
  // karte hain jab backend clearly "invalid/expired" bole — taake network
  // girne par bhi user ko baar-baar password na mangwana pade.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getStoredToken();
      const email = getStoredEmail();
      if (!token || !email) {
        setLoading(false);
        return;
      }
      // Pehle session dikhao (fast), phir background mein verify karo
      setSession({ token, email });

      const result = await verifyAdminToken();
      if (cancelled) return;
      if (result === 'invalid') {
        clearStoredSession();
        setSession(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
    } catch {
      throw new Error(
        `Backend se connect nahi ho paya (${API_URL.replace('/api', '')}). Check karein ke live site par VITE_API_URL sahi backend URL par point karta hai.`
      );
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !(data as { token?: string }).token) {
      throw new Error((data as { message?: string }).message || 'Incorrect email or password.');
    }
    const adminEmail = (data as { email?: string }).email || email.trim().toLowerCase();
    storeSession((data as { token: string }).token, adminEmail);
    setSession({ token: (data as { token: string }).token, email: adminEmail });
  }, []);

  const signOut = useCallback(async () => {
    clearStoredSession();
    setSession(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ session, loading, login, signOut }),
    [session, loading, login, signOut]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}