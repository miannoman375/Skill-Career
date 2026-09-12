import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import LibraryPage from '@/pages/LibraryPage';
import SuccessStoriesPage from '@/pages/SuccessStoriesPage';
import AboutPage from '@/pages/AboutPage';
import { AdminAuthProvider, useAdminAuth } from '@/admin/AdminAuthContext';
import AdminLogin from '@/admin/AdminLogin';
import AdminDashboard from '@/admin/AdminDashboard';
import { SiteContentProvider } from '@/hooks/useSiteContent';
import { Loader2 } from 'lucide-react';

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
    </div>
  );
}

// /admin ke andar har page tabhi khulenga jab admin logged-in hai — warna
// seedha login page par bhej diya jata hai.
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminAuth();
  if (loading) return <FullPageLoader />;
  if (!session) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

// /admin/login par agar already logged-in hain to /admin par redirect.
function RedirectIfLoggedIn({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminAuth();
  if (loading) return <FullPageLoader />;
  if (session) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

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
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <SiteContentProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/stories" element={<SuccessStoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        {/* Footer SiteContentProvider ke andar hona zaroori hai — warna ye
            hamesha default/fallback data dikhayega, admin panel ka live
            saved data kabhi nahi (Footer bhi useSiteContent() use karta hai). */}
        <Footer />
      </SiteContentProvider>
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
              <RedirectIfLoggedIn>
                <AdminLogin />
              </RedirectIfLoggedIn>
            </AdminLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            </AdminLayout>
          }
        />
        <Route path="/*" element={<SiteLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
