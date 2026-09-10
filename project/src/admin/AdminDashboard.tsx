import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  Footprints,
  BarChart3,
  Lightbulb,
  Image,
  Type,
  LogOut,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  AlertCircle,
  ExternalLink,
  Link2,
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import { pageHeadings as defaultPageHeadings, footer as defaultFooter } from '@/data/content';
import { useAdminAuth } from '@/admin/AdminAuthContext';
import {
  type SiteContent,
  type HeroRow,
  type SegmentRow,
  type TrackRow,
  type WebinarRow,
  type StoryRow,
  type StepRow,
  type StatRow,
  type MythRow,
  type PageHeadingsRow,
  type FooterRow,
} from '@/types/content';

type TabId = 'overview' | 'hero' | 'segments' | 'tracks' | 'webinars' | 'stories' | 'steps' | 'stats' | 'myths' | 'headings' | 'footer';

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Section', icon: Image },
  { id: 'headings', label: 'Page Headings', icon: Type },
  { id: 'segments', label: 'Segments', icon: Users },
  { id: 'tracks', label: 'Career Tracks', icon: Briefcase },
  { id: 'webinars', label: 'Webinars', icon: Calendar },
  { id: 'stories', label: 'Success Stories', icon: Footprints },
  { id: 'steps', label: 'How It Works', icon: Footprints },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'myths', label: 'Myths', icon: Lightbulb },
  { id: 'footer', label: 'Footer', icon: Link2 },
];

const emptyHero: HeroRow = {
  id: '',
  eyebrow: '',
  headline: '',
  subtext: '',
  primary_cta_text: '',
  primary_cta_link: '',
  secondary_cta_text: '',
  secondary_cta_link: '',
  image_url: '',
  rating: 0,
  learner_count_text: '',
};

const emptyContent: SiteContent = {
  hero: emptyHero,
  segments: [], tracks: [], webinars: [], stories: [], steps: [], stats: [], myths: [],
  pageHeadings: {
    id: '',
    home_segments_eyebrow: '', home_segments_heading: '', home_segments_subtext: '',
    home_how_eyebrow: '', home_how_heading: '', home_how_subtext: '',
    home_tracks_eyebrow: '', home_tracks_heading: '', home_tracks_subtext: '',
    home_webinars_eyebrow: '', home_webinars_heading: '', home_webinars_subtext: '',
    home_stories_eyebrow: '', home_stories_heading: '', home_stories_subtext: '',
    home_trust_heading: '',
    about_hero_badge: '', about_hero_heading: '',
    about_why_eyebrow: '', about_why_heading: '',
    about_funnel_eyebrow: '', about_funnel_heading: '',
    about_segments_eyebrow: '', about_segments_heading: '',
    about_mentors_eyebrow: '', about_mentors_heading: '',
    about_values_eyebrow: '', about_values_heading: '',
    about_cta_heading: '',
    library_hero_badge: '', library_hero_heading: '',
    library_all_heading: '',
    library_myths_eyebrow: '', library_myths_heading: '',
    library_cta_heading: '',
    library_webinars_eyebrow: '',
    stories_hero_badge: '', stories_hero_heading: '',
    stories_all_heading: '',
    stories_cta_heading: '',
    stories_submit_eyebrow: '', stories_submit_heading: '',
  },
  footer: defaultFooter as FooterRow,
};

// ============ API HELPERS ============
function authHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetchJson<T>(path: string): Promise<T[]> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const data = await res.json();
  return (data ?? []).map((item: any) => ({ ...item, id: item.id ?? item._id }));
}

async function apiSave(path: string, id: string, body: any) {
  const url = id ? `${API_URL}${path}/${id}` : `${API_URL}${path}`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Save failed');
  }
  return res.json();
}

// Hero /api/hero ek single object return karta hai, array nahi.
async function apiFetchOne<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const data = await res.json();
  return { ...data, id: data.id ?? data._id };
}

// Page headings ke liye alag se — agar backend mein abhi ye route nahi hai
// to poora dashboard error na de, sirf defaults dikha de.
async function apiFetchOneSafe<T>(path: string, fallback: T): Promise<T> {
  try {
    return await apiFetchOne<T>(path);
  } catch {
    return fallback;
  }
}

// Hero route mein :id nahi hai — hamesha PUT /hero call hota hai.
async function apiSaveHero(body: Partial<HeroRow>) {
  const res = await fetch(`${API_URL}/hero`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Save failed');
  }
  return res.json();
}

// Page Headings bhi hero jaisa hi ek single record hai — hamesha PUT /page-headings.
async function apiSavePageHeadings(body: Partial<PageHeadingsRow>) {
  const res = await fetch(`${API_URL}/page-headings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Save failed');
  }
  return res.json();
}

// Footer bhi hero/page-headings jaisa hi ek single record hai — hamesha PUT /footer.
async function apiSaveFooter(body: Partial<FooterRow>) {
  const res = await fetch(`${API_URL}/footer`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Save failed');
  }
  return res.json();
}

async function apiDelete(path: string, id: string) {
  const res = await fetch(`${API_URL}${path}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Delete failed');
  }
}

export default function AdminDashboard() {
  const { session, loading: authLoading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>('overview');
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [hero, seg, tr, wb, st, sp, stat, my, ph, ft] = await Promise.all([
        apiFetchOne<HeroRow>('/hero'),
        apiFetchJson<SegmentRow>('/segments'),
        apiFetchJson<TrackRow>('/tracks'),
        apiFetchJson<WebinarRow>('/webinars'),
        apiFetchJson<StoryRow>('/stories'),
        apiFetchJson<StepRow>('/steps'),
        apiFetchJson<StatRow>('/stats'),
        apiFetchJson<MythRow>('/myths'),
        apiFetchOneSafe<PageHeadingsRow>('/page-headings', defaultPageHeadings as PageHeadingsRow),
        apiFetchOneSafe<FooterRow>('/footer', defaultFooter as FooterRow),
      ]);
      setContent({
        hero, segments: seg, tracks: tr, webinars: wb, stories: st, steps: sp, stats: stat, myths: my,
        pageHeadings: ph,
        footer: ft,
      });
      setError(null);
    } catch {
      setError('Could not load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/admin/login', { replace: true });
    }
    if (session) fetchAll();
  }, [authLoading, session, navigate, fetchAll]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!session) return null;

  const counts = {
    segments: content.segments.length,
    tracks: content.tracks.length,
    webinars: content.webinars.length,
    stories: content.stories.length,
    steps: content.steps.length,
    stats: content.stats.length,
    myths: content.myths.length,
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-ink">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-indigo-500"
            >
              View site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-coral-200 hover:text-coral-500"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-6">
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <nav className="flex flex-wrap gap-1.5 lg:flex-col">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-indigo-500 text-white'
                        : 'text-ink-soft hover:bg-canvas-tint hover:text-ink'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                    <span
                      className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-canvas-tint text-ink-muted'
                      }`}
                    >
                      {counts[t.id as keyof typeof counts]}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main>
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm font-medium text-coral-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : tab === 'overview' ? (
              <Overview content={content} onTab={setTab} />
            ) : tab === 'hero' ? (
              <HeroManager item={content.hero} onChanged={fetchAll} />
            ) : tab === 'headings' ? (
              <PageHeadingsManager item={content.pageHeadings} onChanged={fetchAll} />
            ) : tab === 'segments' ? (
              <SegmentsManager items={content.segments} onChanged={fetchAll} />
            ) : tab === 'tracks' ? (
              <TracksManager items={content.tracks} segments={content.segments} onChanged={fetchAll} />
            ) : tab === 'webinars' ? (
              <WebinarsManager items={content.webinars} onChanged={fetchAll} />
            ) : tab === 'stories' ? (
              <StoriesManager items={content.stories} onChanged={fetchAll} />
            ) : tab === 'steps' ? (
              <StepsManager items={content.steps} onChanged={fetchAll} />
            ) : tab === 'stats' ? (
              <StatsManager items={content.stats} onChanged={fetchAll} />
            ) : tab === 'myths' ? (
              <MythsManager items={content.myths} onChanged={fetchAll} />
            ) : tab === 'footer' ? (
              <FooterManager item={content.footer} onChanged={fetchAll} />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

// ============ OVERVIEW ============
function Overview({
  content,
  onTab,
}: {
  content: SiteContent;
  onTab: (t: TabId) => void;
}) {
  const cards = [
    { id: 'headings' as TabId, label: 'Page Headings', count: 38, desc: 'Every section heading on Home, About, Library & Stories pages' },
    { id: 'segments' as TabId, label: 'Segments', count: content.segments.length, desc: 'Audience types shown on home page' },
    { id: 'tracks' as TabId, label: 'Career Tracks', count: content.tracks.length, desc: 'Skill tracks in the explainer library' },
    { id: 'webinars' as TabId, label: 'Webinars', count: content.webinars.length, desc: 'Upcoming live sessions' },
    { id: 'stories' as TabId, label: 'Success Stories', count: content.stories.length, desc: 'Learner success stories' },
    { id: 'steps' as TabId, label: 'How It Works Steps', count: content.steps.length, desc: 'The 4-step funnel' },
    { id: 'stats' as TabId, label: 'Stats', count: content.stats.length, desc: 'Numbers in the stats bar' },
    { id: 'myths' as TabId, label: 'Myths', count: content.myths.length, desc: 'Myth-busting section' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Welcome to your admin panel</h1>
      <p className="mt-2 text-ink-soft">
        Edit any content here and it will update on your live home page instantly. Click a section below to start editing.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onTab(c.id)}
            className="card group p-5 text-left hover:-translate-y-1 hover:border-indigo-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">{c.label}</h3>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-sm font-bold text-indigo-500">
                {c.count}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{c.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-coral-400 opacity-0 transition-opacity group-hover:opacity-100">
              Manage <Plus className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ REUSABLE UI ============
function SectionHeader({
  title,
  subtitle,
  onAdd,
  addLabel,
}: {
  title: string;
  subtitle: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      </div>
      <button type="button" onClick={onAdd} className="btn-primary">
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-coral-400 transition-colors hover:bg-coral-50 hover:border-coral-200"
      aria-label="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-indigo-500 transition-colors hover:bg-indigo-50 hover:border-indigo-200"
      aria-label="Edit"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );
}

interface EditorProps<T> {
  initial: T;
  saving: boolean;
  onSave: (row: T) => Promise<void>;
  onCancel: () => void;
}

function EditorShell({
  title,
  onCancel,
  children,
}: {
  title: string;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card mb-5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-canvas-tint"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function SaveBar({ saving }: { saving: boolean }) {
  return (
    <div className="mt-4 flex gap-2">
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save
      </button>
    </div>
  );
}

// ============ HERO ============
// Hero list nahi, ek hi record hai — is liye SectionHeader ki "Add" button
// yahan nahi chahiye, seedha form dikhate hain jo hamesha "editing" mode mein hai.
function HeroManager({
  item,
  onChanged,
}: {
  item: HeroRow;
  onChanged: () => void;
}) {
  const [form, setForm] = useState<HeroRow>(item);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm((f) => ({ ...f, image_url: data.url }));
    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setUploadingImage(false);
    }
  };

  // Agar dobara fetch ho kar naya data aaye (jaise page load par), form update kar dein.
  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiSaveHero({
        eyebrow: form.eyebrow,
        headline: form.headline,
        subtext: form.subtext,
        primary_cta_text: form.primary_cta_text,
        primary_cta_link: form.primary_cta_link,
        secondary_cta_text: form.secondary_cta_text,
        secondary_cta_link: form.secondary_cta_link,
        image_url: form.image_url,
        rating: Number(form.rating),
        learner_count_text: form.learner_count_text,
      });
      onChanged();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Hero Section</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Home page ka top banner — headline, subtext, buttons, aur image yahan se edit karein.
        </p>
      </div>

      <form onSubmit={handleSave} className="card space-y-4 p-6">
        <Field label="Eyebrow badge text">
          <input
            className="input"
            value={form.eyebrow}
            onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
          />
        </Field>

        <Field label="Headline">
          <textarea
            className="input"
            rows={2}
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
          />
        </Field>

        <Field label="Subtext">
          <textarea
            className="input"
            rows={3}
            value={form.subtext}
            onChange={(e) => setForm({ ...form, subtext: e.target.value })}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Primary button text">
            <input
              className="input"
              value={form.primary_cta_text}
              onChange={(e) => setForm({ ...form, primary_cta_text: e.target.value })}
            />
          </Field>
          <Field label="Primary button link">
            <input
              className="input"
              value={form.primary_cta_link}
              onChange={(e) => setForm({ ...form, primary_cta_link: e.target.value })}
              placeholder="/signup"
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Secondary button text">
            <input
              className="input"
              value={form.secondary_cta_text}
              onChange={(e) => setForm({ ...form, secondary_cta_text: e.target.value })}
            />
          </Field>
          <Field label="Secondary button link">
            <input
              className="input"
              value={form.secondary_cta_link}
              onChange={(e) => setForm({ ...form, secondary_cta_link: e.target.value })}
              placeholder="/library"
            />
          </Field>
        </div>

        <Field label="Hero image">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="input"
            disabled={uploadingImage}
          />
          {uploadingImage && <p className="mt-1 text-xs text-indigo-500">Uploading...</p>}
        </Field>

        {form.image_url && (
          <img
            src={form.image_url}
            alt="Hero preview"
            className="h-40 w-full rounded-xl border border-line object-cover"
          />
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rating (e.g. 4.8)">
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="input"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            />
          </Field>
          <Field label="Learner count text">
            <input
              className="input"
              value={form.learner_count_text}
              onChange={(e) => setForm({ ...form, learner_count_text: e.target.value })}
              placeholder="2,400+ learners"
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving || uploadingImage} className="btn-primary disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">Saved — live on the home page.</span>
          )}
        </div>
      </form>
    </div>
  );
}

// ============ PAGE HEADINGS ============
// Ek hi record hai (jaise Hero) — Home, About, Library, aur Success
// Stories pages ke tamam section headings/eyebrows/subtext yahan se
// edit hote hain, grouped by page with collapsible sections.
type HeadingField = { key: keyof PageHeadingsRow; label: string; multiline?: boolean };
type HeadingGroup = { title: string; fields: HeadingField[] };

const headingGroups: HeadingGroup[] = [
  {
    title: 'Home Page',
    fields: [
      { key: 'home_segments_eyebrow', label: '"Who is this for" — eyebrow' },
      { key: 'home_segments_heading', label: '"Who is this for" — heading' },
      { key: 'home_segments_subtext', label: '"Who is this for" — subtext', multiline: true },
      { key: 'home_how_eyebrow', label: '"How it works" — eyebrow' },
      { key: 'home_how_heading', label: '"How it works" — heading' },
      { key: 'home_how_subtext', label: '"How it works" — subtext', multiline: true },
      { key: 'home_tracks_eyebrow', label: '"Career tracks" — eyebrow' },
      { key: 'home_tracks_heading', label: '"Career tracks" — heading' },
      { key: 'home_tracks_subtext', label: '"Career tracks" — subtext', multiline: true },
      { key: 'home_webinars_eyebrow', label: '"Webinars" — eyebrow' },
      { key: 'home_webinars_heading', label: '"Webinars" — heading' },
      { key: 'home_webinars_subtext', label: '"Webinars" — subtext', multiline: true },
      { key: 'home_stories_eyebrow', label: '"Success stories" — eyebrow' },
      { key: 'home_stories_heading', label: '"Success stories" — heading' },
      { key: 'home_stories_subtext', label: '"Success stories" — subtext', multiline: true },
      { key: 'home_trust_heading', label: 'Trust banner heading' },
    ],
  },
  {
    title: 'About Us Page',
    fields: [
      { key: 'about_hero_badge', label: 'Top badge text' },
      { key: 'about_hero_heading', label: 'Main heading' },
      { key: 'about_why_eyebrow', label: '"Why we exist" — eyebrow' },
      { key: 'about_why_heading', label: '"Why we exist" — heading' },
      { key: 'about_funnel_eyebrow', label: '"The funnel" — eyebrow' },
      { key: 'about_funnel_heading', label: '"The funnel" — heading' },
      { key: 'about_segments_eyebrow', label: '"Our segments" — eyebrow' },
      { key: 'about_segments_heading', label: '"Our segments" — heading' },
      { key: 'about_mentors_eyebrow', label: '"Mentors" — eyebrow' },
      { key: 'about_mentors_heading', label: '"Mentors" — heading' },
      { key: 'about_values_eyebrow', label: '"Our values" — eyebrow' },
      { key: 'about_values_heading', label: '"Our values" — heading' },
      { key: 'about_cta_heading', label: 'Bottom CTA heading' },
    ],
  },
  {
    title: 'Career Explainer (Library) Page',
    fields: [
      { key: 'library_hero_badge', label: 'Top badge text' },
      { key: 'library_hero_heading', label: 'Main heading' },
      { key: 'library_all_heading', label: '"All skill tracks" heading' },
      { key: 'library_myths_eyebrow', label: '"Myth-busting" — eyebrow' },
      { key: 'library_myths_heading', label: '"Myth-busting" — heading' },
      { key: 'library_cta_heading', label: 'Bottom CTA heading' },
      { key: 'library_webinars_eyebrow', label: 'Related webinars — eyebrow' },
    ],
  },
  {
    title: 'Success Stories Page',
    fields: [
      { key: 'stories_hero_badge', label: 'Top badge text' },
      { key: 'stories_hero_heading', label: 'Main heading' },
      { key: 'stories_all_heading', label: '"All stories" heading' },
      { key: 'stories_cta_heading', label: 'Bottom CTA heading' },
      { key: 'stories_submit_eyebrow', label: '"Submit your story" — eyebrow' },
      { key: 'stories_submit_heading', label: '"Submit your story" — heading' },
    ],
  },
];

function PageHeadingsManager({
  item,
  onChanged,
}: {
  item: PageHeadingsRow;
  onChanged: () => void;
}) {
  const [form, setForm] = useState<PageHeadingsRow>(item);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openGroup, setOpenGroup] = useState<string>(headingGroups[0].title);

  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { id: _id, ...rest } = form;
      await apiSavePageHeadings(rest);
      onChanged();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Page Headings</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Har page (Home, About Us, Career Explainer, Success Stories) ke section headings,
          eyebrows aur subtext yahan se edit karein — save karte hi live site pe update ho jayega.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-3">
          {headingGroups.map((group) => {
            const isOpen = openGroup === group.title;
            return (
              <div key={group.title} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? '' : group.title)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-bold text-ink">{group.title}</span>
                  <span className="text-xs font-semibold text-ink-muted">
                    {isOpen ? 'Hide' : `Edit (${group.fields.length})`}
                  </span>
                </button>

                {isOpen && (
                  <div className="space-y-3 border-t border-line px-5 py-5">
                    {group.fields.map((f) => (
                      <Field key={f.key} label={f.label}>
                        {f.multiline ? (
                          <textarea
                            className="input"
                            rows={2}
                            value={form[f.key]}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          />
                        ) : (
                          <input
                            className="input"
                            value={form[f.key]}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          />
                        )}
                      </Field>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">Saved — live across every page.</span>
          )}
        </div>
      </form>
    </div>
  );
}

// ============ SEGMENTS ============
function SegmentsManager({
  items,
  onChanged,
}: {
  items: SegmentRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<SegmentRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const blank: SegmentRow = {
    id: '', label: '', blurb: '', icon: 'graduation-cap', sort_order: items.length + 1,
  };

  const handleSave = async (row: SegmentRow) => {
    setSaving(true);
    try {
      await apiSave('/segments', row.id, {
        label: row.label, blurb: row.blurb, icon: row.icon, sort_order: row.sort_order,
      });
      setEditing(null); setAdding(false); onChanged();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this segment?')) return;
    try {
      await apiDelete('/segments', id);
      onChanged();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Segments"
        subtitle="The three audience types on the home page."
        onAdd={() => setAdding(true)}
        addLabel="Add segment"
      />

      {(adding || editing) && (
        <EditorShell
          title={editing ? 'Edit segment' : 'New segment'}
          onCancel={() => { setEditing(null); setAdding(false); }}
        >
          <SegmentForm
            initial={editing ?? blank}
            saving={saving}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setAdding(false); }}
          />
        </EditorShell>
      )}

      <div className="grid gap-3">
        {items.map((s) => (
          <div key={s.id} className="card flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{s.label}</p>
              <p className="truncate text-sm text-ink-soft">{s.blurb}</p>
            </div>
            <span className="text-xs text-ink-muted">Order: {s.sort_order}</span>
            <EditButton onClick={() => setEditing(s)} />
            <DeleteButton onClick={() => handleDelete(s.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SegmentForm({
  initial,
  saving,
  onSave,
}: EditorProps<SegmentRow>) {
  const [form, setForm] = useState<SegmentRow>(initial);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Label">
          <input className="input-base" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        </Field>
        <Field label="Icon">
          <select className="input-base" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            <option value="graduation-cap">Graduation Cap</option>
            <option value="home">Home</option>
            <option value="store">Store</option>
          </select>
        </Field>
      </div>
      <Field label="Blurb">
        <textarea className="input-base resize-none" rows={2} value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} required />
      </Field>
      <Field label="Sort order">
        <input type="number" className="input-base" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      </Field>
      <SaveBar saving={saving} />
    </form>
  );
}

// ============ TRACKS ============
function TracksManager({
  items,
  segments,
  onChanged,
}: {
  items: TrackRow[];
  segments: SegmentRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<TrackRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const blank: TrackRow = {
    id: '', title: '', category: 'tech', category_label: 'Tech',
    pay_range: '', time_to_income: '', duration: '', level: '',
    thumbnail: '', video_url: '', description: '', suitable_for: [],
    segment_id: segments[0]?.id ?? null, featured: false,
    sort_order: items.length + 1,
  };

  const handleSave = async (row: TrackRow) => {
    setSaving(true);
    try {
      await apiSave('/tracks', row.id, {
        title: row.title,
        category: row.category,
        category_label: row.category_label,
        pay_range: row.pay_range,
        time_to_income: row.time_to_income,
        duration: row.duration,
        level: row.level,
        thumbnail: row.thumbnail,
        video_url: row.video_url,
        description: row.description,
        suitable_for: row.suitable_for,
        segment_id: row.segment_id,
        featured: row.featured,
        sort_order: row.sort_order,
      });
      setEditing(null); setAdding(false); onChanged();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this track?')) return;
    try {
      await apiDelete('/tracks', id);
      onChanged();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Career Tracks"
        subtitle="Skill tracks shown in the explainer library and home page."
        onAdd={() => setAdding(true)}
        addLabel="Add track"
      />

      {(adding || editing) && (
        <EditorShell
          title={editing ? 'Edit track' : 'New track'}
          onCancel={() => { setEditing(null); setAdding(false); }}
        >
          <TrackForm
            initial={editing ?? blank}
            segments={segments}
            saving={saving}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setAdding(false); }}
          />
        </EditorShell>
      )}

      <div className="grid gap-3">
        {items.map((t) => (
          <div key={t.id} className="card flex items-center gap-4 p-4">
            <img src={t.thumbnail} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{t.title}</p>
              <p className="truncate text-sm text-ink-soft">
                {t.category_label} · {t.pay_range} · {t.duration}
              </p>
            </div>
            {t.featured && (
              <span className="chip bg-coral-50 text-coral-500">Featured</span>
            )}
            <EditButton onClick={() => setEditing(t)} />
            <DeleteButton onClick={() => handleDelete(t.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
function TrackForm({
  initial,
  segments,
  saving,
  onSave,
}: EditorProps<TrackRow> & { segments: SegmentRow[] }) {
  const [form, setForm] = useState<TrackRow>(initial);
  const [tagsStr, setTagsStr] = useState(initial.suitable_for.join(', '));
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleFileUpload = async (file: File, field: 'thumbnail' | 'video_url') => {
    const setUploading = field === 'thumbnail' ? setUploadingThumb : setUploadingVideo;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm((f) => ({ ...f, [field]: data.url }));
    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          suitable_for: tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
        });
      }}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title">
          <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </Field>
        <Field label="Level">
          <input className="input-base" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} required />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Category (key)">
          <select className="input-base" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="tech">tech</option>
            <option value="creative">creative</option>
            <option value="marketing">marketing</option>
            <option value="business">business</option>
            <option value="freelancing">freelancing</option>
          </select>
        </Field>
        <Field label="Category label (display)">
          <input className="input-base" value={form.category_label} onChange={(e) => setForm({ ...form, category_label: e.target.value })} required />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Pay range">
          <input className="input-base" value={form.pay_range} onChange={(e) => setForm({ ...form, pay_range: e.target.value })} required />
        </Field>
        <Field label="Duration">
          <input className="input-base" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
        </Field>
        <Field label="Time to income">
          <input className="input-base" value={form.time_to_income} onChange={(e) => setForm({ ...form, time_to_income: e.target.value })} required />
        </Field>
      </div>

      <Field label="Thumbnail image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'thumbnail');
          }}
          className="input-base"
          disabled={uploadingThumb}
        />
        {uploadingThumb && <p className="mt-1 text-xs text-indigo-500">Uploading...</p>}
        {form.thumbnail && (
          <img src={form.thumbnail} alt="Thumbnail preview" className="mt-2 h-24 w-40 rounded-lg object-cover" />
        )}
      </Field>

      <Field label="Video (optional)">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'video_url');
          }}
          className="input-base"
          disabled={uploadingVideo}
        />
        {uploadingVideo && <p className="mt-1 text-xs text-indigo-500">Uploading...</p>}
        {form.video_url && (
          <video src={form.video_url} controls className="mt-2 h-24 w-40 rounded-lg object-cover" />
        )}
      </Field>

      <Field label="Description">
        <textarea className="input-base resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Segment">
          <select className="input-base" value={form.segment_id ?? ''} onChange={(e) => setForm({ ...form, segment_id: e.target.value || null })}>
            <option value="">None</option>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Sort order">
          <input type="number" className="input-base" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </Field>
      </div>

      <Field label="Suitable for (comma-separated)">
        <input className="input-base" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} />
      </Field>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="h-4 w-4 rounded border-line"
        />
        <span className="text-sm font-semibold text-ink">Featured track</span>
      </label>

      <SaveBar saving={saving || uploadingThumb || uploadingVideo} />
    </form>
  );
}

// ============ WEBINARS ============
function WebinarsManager({
  items,
  onChanged,
}: {
  items: WebinarRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<WebinarRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const blank: WebinarRow = {
    id: '', title: '', date: '', time: '', segment_tag: '', speaker: '',
    category: null, sort_order: items.length + 1,
  };

  const handleSave = async (row: WebinarRow) => {
    setSaving(true);
    try {
      await apiSave('/webinars', row.id, {
        title: row.title, date: row.date, time: row.time,
        segment_tag: row.segment_tag, speaker: row.speaker,
        category: row.category, sort_order: row.sort_order,
      });
      setEditing(null); setAdding(false); onChanged();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webinar?')) return;
    try {
      await apiDelete('/webinars', id);
      onChanged();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Webinars"
        subtitle="Upcoming live sessions shown on the home page."
        onAdd={() => setAdding(true)}
        addLabel="Add webinar"
      />

      {(adding || editing) && (
        <EditorShell
          title={editing ? 'Edit webinar' : 'New webinar'}
          onCancel={() => { setEditing(null); setAdding(false); }}
        >
          <WebinarForm initial={editing ?? blank} saving={saving} onSave={handleSave} onCancel={() => { setEditing(null); setAdding(false); }} />
        </EditorShell>
      )}

      <div className="grid gap-3">
        {items.map((w) => (
          <div key={w.id} className="card flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{w.title}</p>
              <p className="truncate text-sm text-ink-soft">
                {w.date} · {w.time} · {w.speaker}
              </p>
            </div>
            <EditButton onClick={() => setEditing(w)} />
            <DeleteButton onClick={() => handleDelete(w.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WebinarForm({
  initial, saving, onSave,
}: EditorProps<WebinarRow>) {
  const [form, setForm] = useState<WebinarRow>(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <Field label="Title">
        <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date (e.g. Aug 7)">
          <input className="input-base" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </Field>
        <Field label="Time (e.g. 5:00 PM IST)">
          <input className="input-base" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Segment tag">
          <input className="input-base" value={form.segment_tag} onChange={(e) => setForm({ ...form, segment_tag: e.target.value })} required />
        </Field>
        <Field label="Speaker">
          <input className="input-base" value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} required />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Category (optional)">
          <select className="input-base" value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value || null })}>
            <option value="">None</option>
            <option value="tech">tech</option>
            <option value="creative">creative</option>
            <option value="marketing">marketing</option>
            <option value="business">business</option>
            <option value="freelancing">freelancing</option>
          </select>
        </Field>
        <Field label="Sort order">
          <input type="number" className="input-base" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </Field>
      </div>
      <SaveBar saving={saving} />
    </form>
  );
}

// ============ STORIES ============
function StoriesManager({
  items,
  onChanged,
}: {
  items: StoryRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<StoryRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const blank: StoryRow = {
    id: '', name: '', role: '', location: '', quote: '', outcome: '',
    avatar: '', sort_order: items.length + 1,
  };

  const handleSave = async (row: StoryRow) => {
    setSaving(true);
    try {
      await apiSave('/stories', row.id, {
        name: row.name, role: row.role, location: row.location,
        quote: row.quote, outcome: row.outcome, avatar: row.avatar,
        sort_order: row.sort_order,
      });
      setEditing(null); setAdding(false); onChanged();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    try {
      await apiDelete('/stories', id);
      onChanged();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Success Stories"
        subtitle="Learner stories shown on the home page."
        onAdd={() => setAdding(true)}
        addLabel="Add story"
      />

      {(adding || editing) && (
        <EditorShell
          title={editing ? 'Edit story' : 'New story'}
          onCancel={() => { setEditing(null); setAdding(false); }}
        >
          <StoryForm initial={editing ?? blank} saving={saving} onSave={handleSave} onCancel={() => { setEditing(null); setAdding(false); }} />
        </EditorShell>
      )}

      <div className="grid gap-3">
        {items.map((s) => (
          <div key={s.id} className="card flex items-center gap-4 p-4">
            <img src={s.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{s.name}</p>
              <p className="truncate text-sm text-ink-soft">
                {s.role} · {s.location}
              </p>
            </div>
            <EditButton onClick={() => setEditing(s)} />
            <DeleteButton onClick={() => handleDelete(s.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryForm({
  initial, saving, onSave,
}: EditorProps<StoryRow>) {
  const [form, setForm] = useState<StoryRow>(initial);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm((f) => ({ ...f, avatar: data.url }));
    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input className="input-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Role">
          <input className="input-base" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Location">
          <input className="input-base" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        </Field>
        <Field label="Avatar photo">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }}
            className="input-base"
            disabled={uploadingAvatar}
          />
          {uploadingAvatar && <p className="mt-1 text-xs text-indigo-500">Uploading...</p>}
          {form.avatar && (
            <img src={form.avatar} alt="Avatar preview" className="mt-2 h-16 w-16 rounded-full object-cover" />
          )}
        </Field>
      </div>
      <Field label="Quote">
        <textarea className="input-base resize-none" rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
      </Field>
      <Field label="Outcome">
        <input className="input-base" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} required />
      </Field>
      <Field label="Sort order">
        <input type="number" className="input-base" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      </Field>
      <SaveBar saving={saving} />
    </form>
  );
}

// ============ STEPS ============
function StepsManager({
  items,
  onChanged,
}: {
  items: StepRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<StepRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const blank: StepRow = {
    id: '', step: items.length + 1, label: '', title: '', detail: '',
    icon: 'radio', sort_order: items.length + 1,
  };

  const handleSave = async (row: StepRow) => {
    setSaving(true);
    try {
      await apiSave('/steps', row.id, {
        step: row.step, label: row.label, title: row.title,
        detail: row.detail, icon: row.icon, sort_order: row.sort_order,
      });
      setEditing(null); setAdding(false); onChanged();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this step?')) return;
    try {
      await apiDelete('/steps', id);
      onChanged();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div>
      <SectionHeader
        title="How It Works Steps"
        subtitle="The 4-step funnel on the home page."
        onAdd={() => setAdding(true)}
        addLabel="Add step"
      />

      {(adding || editing) && (
        <EditorShell
          title={editing ? 'Edit step' : 'New step'}
          onCancel={() => { setEditing(null); setAdding(false); }}
        >
          <StepForm initial={editing ?? blank} saving={saving} onSave={handleSave} onCancel={() => { setEditing(null); setAdding(false); }} />
        </EditorShell>
      )}

      <div className="grid gap-3">
        {items.map((s) => (
          <div key={s.id} className="card flex items-center gap-4 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-500">
              {s.step}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{s.title}</p>
              <p className="truncate text-sm text-ink-soft">{s.label} · {s.detail}</p>
            </div>
            <EditButton onClick={() => setEditing(s)} />
            <DeleteButton onClick={() => handleDelete(s.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepForm({
  initial, saving, onSave,
}: EditorProps<StepRow>) {
  const [form, setForm] = useState<StepRow>(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Step number">
          <input type="number" className="input-base" value={form.step} onChange={(e) => setForm({ ...form, step: parseInt(e.target.value) || 1 })} />
        </Field>
        <Field label="Label">
          <input className="input-base" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        </Field>
        <Field label="Icon">
          <select className="input-base" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            <option value="radio">radio</option>
            <option value="compass">compass</option>
            <option value="users">users</option>
            <option value="graduation-cap">graduation-cap</option>
          </select>
        </Field>
      </div>
      <Field label="Title">
        <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </Field>
      <Field label="Detail">
        <textarea className="input-base resize-none" rows={3} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} required />
      </Field>
      <Field label="Sort order">
        <input type="number" className="input-base" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      </Field>
      <SaveBar saving={saving} />
    </form>
  );
}

// ============ STATS ============
function StatsManager({
  items,
  onChanged,
}: {
  items: StatRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<StatRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const blank: StatRow = {
    id: '', value: '', label: '', sort_order: items.length + 1,
  };

  const handleSave = async (row: StatRow) => {
    setSaving(true);
    try {
      await apiSave('/stats', row.id, {
        value: row.value, label: row.label, sort_order: row.sort_order,
      });
      setEditing(null); setAdding(false); onChanged();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return;
    try {
      await apiDelete('/stats', id);
      onChanged();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Stats"
        subtitle="Numbers shown in the stats bar on the home page."
        onAdd={() => setAdding(true)}
        addLabel="Add stat"
      />

      {(adding || editing) && (
        <EditorShell
          title={editing ? 'Edit stat' : 'New stat'}
          onCancel={() => { setEditing(null); setAdding(false); }}
        >
          <StatForm initial={editing ?? blank} saving={saving} onSave={handleSave} onCancel={() => { setEditing(null); setAdding(false); }} />
        </EditorShell>
      )}

      <div className="grid gap-3">
        {items.map((s) => (
          <div key={s.id} className="card flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{s.value}</p>
              <p className="text-sm text-ink-soft">{s.label}</p>
            </div>
            <EditButton onClick={() => setEditing(s)} />
            <DeleteButton onClick={() => handleDelete(s.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatForm({
  initial, saving, onSave,
}: EditorProps<StatRow>) {
  const [form, setForm] = useState<StatRow>(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Value (e.g. 24 or 18,000+)">
          <input className="input-base" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
        </Field>
        <Field label="Label">
          <input className="input-base" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        </Field>
      </div>
      <Field label="Sort order">
        <input type="number" className="input-base" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      </Field>
      <SaveBar saving={saving} />
    </form>
  );
}

// ============ MYTHS ============
function MythsManager({
  items,
  onChanged,
}: {
  items: MythRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<MythRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const blank: MythRow = {
    id: '', myth: '', truth: '', sort_order: items.length + 1,
  };

  const handleSave = async (row: MythRow) => {
    setSaving(true);
    try {
      await apiSave('/myths', row.id, {
        myth: row.myth, truth: row.truth, sort_order: row.sort_order,
      });
      setEditing(null); setAdding(false); onChanged();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this myth?')) return;
    try {
      await apiDelete('/myths', id);
      onChanged();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Myths"
        subtitle="Myth-busting section on the library page."
        onAdd={() => setAdding(true)}
        addLabel="Add myth"
      />

      {(adding || editing) && (
        <EditorShell
          title={editing ? 'Edit myth' : 'New myth'}
          onCancel={() => { setEditing(null); setAdding(false); }}
        >
          <MythForm initial={editing ?? blank} saving={saving} onSave={handleSave} onCancel={() => { setEditing(null); setAdding(false); }} />
        </EditorShell>
      )}

      <div className="grid gap-3">
        {items.map((m) => (
          <div key={m.id} className="card flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink line-through decoration-coral-300/70">{m.myth}</p>
              <p className="truncate text-sm text-ink-soft">Truth: {m.truth}</p>
            </div>
            <EditButton onClick={() => setEditing(m)} />
            <DeleteButton onClick={() => handleDelete(m.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MythForm({
  initial, saving, onSave,
}: EditorProps<MythRow>) {
  const [form, setForm] = useState<MythRow>(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <Field label="Myth">
        <textarea className="input-base resize-none" rows={2} value={form.myth} onChange={(e) => setForm({ ...form, myth: e.target.value })} required />
      </Field>
      <Field label="Truth">
        <textarea className="input-base resize-none" rows={3} value={form.truth} onChange={(e) => setForm({ ...form, truth: e.target.value })} required />
      </Field>
      <Field label="Sort order">
        <input type="number" className="input-base" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      </Field>
      <SaveBar saving={saving} />
    </form>
  );
}

// ============ FOOTER ============
// Footer bhi hero jaisa ek hi record hai (list nahi) — contact info, social
// links aur footer ke columns (Explore/Company/Support jaisa) sab yahin se
// edit hote hain aur save karte hi live footer par turant reflect ho jaate hain.
function FooterManager({
  item,
  onChanged,
}: {
  item: FooterRow;
  onChanged: () => void;
}) {
  const [form, setForm] = useState<FooterRow>(item);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { id: _id, ...rest } = form;
      await apiSaveFooter(rest);
      onChanged();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const updateColumnTitle = (colIndex: number, title: string) => {
    setForm((f) => {
      const columns = [...f.columns];
      columns[colIndex] = { ...columns[colIndex], title };
      return { ...f, columns };
    });
  };

  const updateLink = (colIndex: number, linkIndex: number, field: 'label' | 'to', value: string) => {
    setForm((f) => {
      const columns = [...f.columns];
      const links = [...columns[colIndex].links];
      links[linkIndex] = { ...links[linkIndex], [field]: value };
      columns[colIndex] = { ...columns[colIndex], links };
      return { ...f, columns };
    });
  };

  const addLink = (colIndex: number) => {
    setForm((f) => {
      const columns = [...f.columns];
      columns[colIndex] = {
        ...columns[colIndex],
        links: [...columns[colIndex].links, { label: '', to: '' }],
      };
      return { ...f, columns };
    });
  };

  const removeLink = (colIndex: number, linkIndex: number) => {
    setForm((f) => {
      const columns = [...f.columns];
      columns[colIndex] = {
        ...columns[colIndex],
        links: columns[colIndex].links.filter((_, i) => i !== linkIndex),
      };
      return { ...f, columns };
    });
  };

  const addColumn = () => {
    setForm((f) => ({
      ...f,
      columns: [...f.columns, { title: 'New column', links: [] }],
    }));
  };

  const removeColumn = (colIndex: number) => {
    setForm((f) => ({
      ...f,
      columns: f.columns.filter((_, i) => i !== colIndex),
    }));
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Footer Settings</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Website ke footer ki har cheez — contact info, social links, address aur columns ke
          links — yahan se edit karein. Save karte hi live footer par turant nazar aa jayega.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="card space-y-4 p-6">
          <h3 className="text-sm font-bold text-ink">Contact &amp; description</h3>

          <Field label="Description (footer ke pehle column ke neeche)">
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Email">
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="hello@example.com"
              />
            </Field>
            <Field label="Phone">
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 90000 12345"
              />
            </Field>
            <Field label="Address">
              <input
                className="input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="City · City · City"
              />
            </Field>
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="text-sm font-bold text-ink">Social links</h3>
          <p className="text-xs text-ink-soft">
            Jis platform ka URL khali chodenge, wo icon footer par nahi dikhega.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Facebook URL">
              <input
                className="input"
                value={form.social_facebook}
                onChange={(e) => setForm({ ...form, social_facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </Field>
            <Field label="Instagram URL">
              <input
                className="input"
                value={form.social_instagram}
                onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="LinkedIn URL">
              <input
                className="input"
                value={form.social_linkedin}
                onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })}
                placeholder="https://linkedin.com/..."
              />
            </Field>
            <Field label="YouTube URL">
              <input
                className="input"
                value={form.social_youtube}
                onChange={(e) => setForm({ ...form, social_youtube: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </Field>
            <Field label="TikTok URL">
              <input
                className="input"
                value={form.social_tiktok}
                onChange={(e) => setForm({ ...form, social_tiktok: e.target.value })}
                placeholder="https://tiktok.com/@..."
              />
            </Field>
          </div>
        </div>

        <div className="card space-y-3 p-6">
          <h3 className="text-sm font-bold text-ink">Copyright line</h3>
          <Field label="Text jo © {year} ke baad aata hai">
            <input
              className="input"
              value={form.copyright_text}
              onChange={(e) => setForm({ ...form, copyright_text: e.target.value })}
              placeholder="Company Name. All rights reserved."
            />
          </Field>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Footer columns &amp; links</h3>
            <button
              type="button"
              onClick={addColumn}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-indigo-200 hover:text-indigo-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Add column
            </button>
          </div>

          {form.columns.map((col, colIndex) => (
            <div key={colIndex} className="card space-y-3 p-6">
              <div className="flex items-center gap-3">
                <input
                  className="input flex-1 font-bold"
                  value={col.title}
                  onChange={(e) => updateColumnTitle(colIndex, e.target.value)}
                  placeholder="Column title"
                />
                <button
                  type="button"
                  onClick={() => removeColumn(colIndex)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-coral-50 hover:text-coral-500"
                  aria-label="Remove column"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {col.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center gap-2">
                    <input
                      className="input"
                      value={link.label}
                      onChange={(e) => updateLink(colIndex, linkIndex, 'label', e.target.value)}
                      placeholder="Link label"
                    />
                    <input
                      className="input"
                      value={link.to}
                      onChange={(e) => updateLink(colIndex, linkIndex, 'to', e.target.value)}
                      placeholder="/path or https://..."
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(colIndex, linkIndex)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-coral-50 hover:text-coral-500"
                      aria-label="Remove link"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addLink(colIndex)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-indigo-200 hover:text-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add link
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">Saved — live on the footer.</span>
          )}
        </div>
      </form>
    </div>
  );
}
