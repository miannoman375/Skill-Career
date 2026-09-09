import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import AuthLink from '@/components/AuthLink';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Career Explainer Library', to: '/library' },
  { label: 'About Us', to: '/about' },
  { label: 'Success Stories', to: '/stories' },
];

// Public site ke Login/Signup buttons abhi ke liye chupaye gaye hain.
// Code delete nahi kiya gaya — future mein wapas dikhane ke liye is flag
// ko `true` kar dein. Ye sirf ye public Navbar affect karta hai;
// admin panel ka login (/admin/login) is se bilkul alag component hai
// aur is se koi taluq nahi rakhta.
const SHOW_PUBLIC_AUTH_BUTTONS = false;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isUser, setIsUser] = useState(false);

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const checkAuth = () => {
      setIsUser(!!localStorage.getItem('userToken'));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsUser(false);
    navigate('/');
  };

  if (isAuthRoute) {
    return (
      <header
        className={`sticky top-0 z-50 bg-indigo-700 transition-all duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
        <nav className="container-page flex h-16 items-center sm:h-20">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1.5 shadow-sm sm:h-12 sm:w-12">
              <img src="/images/logo.png" alt="Skill & Career logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Skill <span className="text-coral-300">&</span> Career
            </span>
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-indigo-700 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4 sm:h-20 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-8 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1.5 shadow-sm sm:h-12 sm:w-12">
            <img src="/images/logo.png" alt="Skill & Career logo" className="h-full w-full object-contain" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            Skill <span className="text-coral-300">&</span> Career
          </span>
        </Link>

        <ul className="hidden items-center justify-center gap-9 lg:flex">
          {links.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`relative text-[15px] font-semibold transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-white after:transition-all after:duration-200 hover:text-white hover:after:w-full ${
                    isActive ? 'text-white after:w-full' : 'text-white/80 after:w-0'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-end gap-2.5">
          {isUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden items-center gap-1.5 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 lg:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            SHOW_PUBLIC_AUTH_BUTTONS && (
              <div className="hidden items-center gap-2.5 lg:flex">
                <AuthLink to="/login" className="rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5">
                  Login
                </AuthLink>
                <AuthLink to="/signup" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:bg-coral-50 hover:-translate-y-0.5">
                  Sign up
                </AuthLink>
              </div>
            )
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/40 bg-white/10 text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-page border-t border-white/15 bg-indigo-700/95 py-5">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            {isUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              SHOW_PUBLIC_AUTH_BUTTONS && (
                <>
                  <AuthLink to="/login" className="rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20">
                    Login
                  </AuthLink>
                  <AuthLink to="/signup" className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-indigo-600 transition-all duration-200 hover:bg-coral-50">
                    Sign up
                  </AuthLink>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
