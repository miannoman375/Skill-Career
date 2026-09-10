import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  type Location,
} from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SegmentSelector from '@/components/SegmentSelector';
import HowItWorks from '@/components/HowItWorks';
import CareerPreview from '@/components/CareerPreview';
import Webinars from '@/components/Webinars';
import SuccessStories from '@/components/SuccessStories';
import TrustBadge from '@/components/TrustBadge';
import StatsBar from '@/components/StatsBar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import LibraryPage from '@/pages/LibraryPage';
import SuccessStoriesPage from '@/pages/SuccessStoriesPage';
import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import SignupPage from '@/pages/SignupPage';
import { AdminAuthProvider } from '@/admin/AdminAuthContext';
import AdminLogin from '@/admin/AdminLogin';
import AdminDashboard from '@/admin/AdminDashboard';
import { SiteContentProvider } from '@/hooks/useSiteContent';

function HomePage() {
  return (
    <main>
      <Hero />
      <SegmentSelector />
      <HowItWorks />
      <CareerPreview />
      <Webinars />
      <SuccessStories />
      <TrustBadge />
      <StatsBar />
    </main>
  );
}

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    if (pathname !== '/') return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [hash, pathname]);

  return null;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}

function SiteLayout() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <SiteContentProvider>
        <Routes location={backgroundLocation ?? location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/stories" element={<SuccessStoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        {/* Footer SiteContentProvider ke andar hona zaroori hai — warna ye
            hamesha default/fallback data dikhayega, admin panel ka live
            saved data kabhi nahi (Footer bhi useSiteContent() use karta hai). */}
        {!isAuthRoute && <Footer />}
      </SiteContentProvider>

      {isAuthRoute && (
        <Routes>
          <Route
            path="/login"
            element={
              <AuthModal>
                <AuthPage mode="login" />
              </AuthModal>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthModal>
                <SignupPage />
              </AuthModal>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route
          path="/admin/login"
          element={
            <AdminLayout>
              <AdminLogin />
            </AdminLayout>
          }
        />
        <Route  path="/admin" element={<AdminLayout> <AdminDashboard /></AdminLayout>}
        />
        <Route path="/*" element={<SiteLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
