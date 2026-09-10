import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import AuthLink from '@/components/AuthLink';

type Mode = 'login' | 'signup';

interface AuthPageProps {
  mode: Mode;
}

interface FieldState {
  email: string;
  password: string;
  showPassword: boolean;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<FieldState>({
    email: '',
    password: '',
    showPassword: false,
  });
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  useEffect(() => {
    setStatus({ kind: 'idle' });
  }, [mode]);

  // Agar already login hai (token localStorage mein maujood hai) to home pe bhej dein
  useEffect(() => {
    let active = true;
    (async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active && res.ok) {
          navigate('/', { replace: true });
        }
      } catch {
        // token invalid ho sakta hai, chup chap ignore karein
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setStatus({ kind: 'error', message: 'Please enter your email and password.' });
      return;
    }
    if (password.length < 6) {
      setStatus({ kind: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setStatus({ kind: 'loading' });

    try {
      const endpoint = mode === 'signup' ? 'signup' : 'login';
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || 'Something went wrong. Please try again.');
      }

      // Token backend se save karein (SignupPage.tsx wale hi naam use kar rahe hain)
      if (data?.token) {
        localStorage.setItem('userToken', data.token);
        if (data?.name) localStorage.setItem('userName', data.name);
        if (data?.email) localStorage.setItem('userEmail', data.email);
      }

      if (mode === 'signup') {
        setStatus({
          kind: 'success',
          message: 'Account created! Welcome aboard — redirecting you now.',
        });
        setTimeout(() => navigate('/', { replace: true }), 1200);
      } else {
        setStatus({ kind: 'success', message: 'Welcome back! Redirecting you now.' });
        const dest = (location.state as { from?: string } | null)?.from ?? '/';
        setTimeout(() => navigate(dest, { replace: true }), 800);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      const friendly = message
        .replace('User already registered', 'An account with this email already exists.')
        .replace('User already exists', 'An account with this email already exists.')
        .replace('Invalid login credentials', 'Incorrect email or password.')
        .replace('Invalid credentials', 'Incorrect email or password.');
      setStatus({ kind: 'error', message: friendly });
    }
  };

  const isLogin = mode === 'login';
  const heading = isLogin ? 'Welcome back' : 'Create your account';
  const subheading = isLogin
    ? 'Log in to continue your career journey.'
    : 'Join learners worldwide and find your path.';
  const cta = isLogin ? 'Log in' : 'Sign up';
  const switchTo = isLogin ? 'signup' : 'login';
  const switchLabel = isLogin ? 'Sign up' : 'Log in';
  const switchPrompt = isLogin
    ? "Don't have an account yet?"
    : 'Already have an account?';

  return (
    <div className="w-full">
      <div className="card p-7 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink">{heading}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{subheading}</p>
        </div>

        <div
          role="tablist"
          aria-label="Authentication mode"
          className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-canvas-tint p-1"
        >
          <AuthLink
            to="/login"
            role="tab"
            aria-selected={isLogin}
            className={`rounded-lg py-2 text-center text-sm font-semibold transition-all ${
              isLogin
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Log in
          </AuthLink>
          <AuthLink
            to="/signup"
            role="tab"
            aria-selected={!isLogin}
            className={`rounded-lg py-2 text-center text-sm font-semibold transition-all ${
              !isLogin
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Sign up
          </AuthLink>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="input-base !pl-11"
                    disabled={status.kind === 'loading'}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="password"
                    type={form.showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    placeholder={isLogin ? 'Your password' : 'At least 6 characters'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="input-base !pl-11 !pr-11"
                    disabled={status.kind === 'loading'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, showPassword: !f.showPassword }))}
                    aria-label={form.showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-indigo-500"
                  >
                    {form.showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {status.kind === 'success' && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{status.message}</span>
                </div>
              )}

              {status.kind === 'error' && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm font-medium text-coral-700"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status.kind === 'loading'}
                className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status.kind === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait…
                  </>
                ) : (
                  <>
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          {switchPrompt}{' '}
          <AuthLink
            to={`/${switchTo}`}
            className="font-semibold text-coral-400 transition-colors hover:text-coral-500"
          >
            {switchLabel}
          </AuthLink>
        </p>
      </div>

      <p className="mt-5 text-center text-xs font-medium text-white/90">
        Join learners worldwide — your first assessment is always free.
      </p>
    </div>
  );
}