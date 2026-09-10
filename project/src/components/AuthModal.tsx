import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface AuthModalProps {
  children: ReactNode;
}

export default function AuthModal({ children }: AuthModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: { pathname: string } } | null;

  const close = () => {
    if (state?.backgroundLocation) {
      navigate(state.backgroundLocation.pathname, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 py-10"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-md"
        onClick={close}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:text-coral-400"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
