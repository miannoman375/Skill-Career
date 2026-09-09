import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AdminSession {
  email: string;
  token: string;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    if (token && email) {
      setSession({ token, email });
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}