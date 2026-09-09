import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import AuthLink from '@/components/AuthLink';

interface FieldState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FieldState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const name = form.name.trim();

    if (!name || !email || !password) {
      setStatus({ kind: 'error', message: 'Please fill in all fields.' });
      return;
    }
    if (password.length < 6) {
      setStatus({ kind: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== form.confirmPassword) {
      setStatus({ kind: 'error', message: 'Passwords do not match.' });
      return;
    }

    setStatus({ kind: 'loading' });

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);

      setStatus({
        kind: 'success',
        message: 'Account created! Welcome aboard — redirecting you now.',
      });
      setTimeout(() => navigate('/', { replace: true }), 1200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setStatus({ kind: 'error', message });
    }
  };

  return (
    <div className="w-full">
      <div className="card p-7 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            Join learners worldwide and find your path.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Authentication mode"
          className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-canvas-tint p-1"
        >
          <AuthLink
            to="/login"
            role="tab"
            className="rounded-lg py-2 text-center text-sm font-semibold text-ink-muted transition-all hover:text-ink"
          >
            Log in
          </AuthLink>
          <AuthLink
            to="/signup"
            role="tab"
            aria-selected
            className="rounded-lg bg-white py-2 text-center text-sm font-semibold text-ink shadow-sm"
          >
            Sign up
          </AuthLink>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
                  Full name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-base !pl-11"
                    disabled={status.kind === 'loading'}
                    required
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
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

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-ink">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="confirmPassword"
                    type={form.showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    className="input-base !pl-11"
                    disabled={status.kind === 'loading'}
                    required
                  />
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
                    Sign up
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <AuthLink
            to="/login"
            className="font-semibold text-coral-400 transition-colors hover:text-coral-500"
          >
            Log in
          </AuthLink>
        </p>
      </div>

      <p className="mt-5 text-center text-xs font-medium text-white/90">
        Join learners worldwide — your first assessment is always free.
      </p>
    </div>
  );
}