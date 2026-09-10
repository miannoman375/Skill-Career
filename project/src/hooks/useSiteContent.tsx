import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { apiGet } from '@/lib/api';
import type {
  SiteContent,
  HeroRow,
  SegmentRow,
  TrackRow,
  WebinarRow,
  StoryRow,
  StepRow,
  StatRow,
  MythRow,
  PageHeadingsRow,
  FooterRow,
} from '@/types/content';
import * as fallback from '@/data/content';

// MongoDB documents come back with `_id` instead of `id` — normalize them
// so the rest of the app can keep using `.id` everywhere.
function normalizeId<T extends { _id?: string; id?: string }>(row: T): T & { id: string } {
  const { _id, ...rest } = row;
  return { ...(rest as T), id: (row.id ?? _id ?? '') as string };
}

async function fetchCollection<T extends { _id?: string; id?: string }>(
  path: string
): Promise<T[] | null> {
  try {
    const data = await apiGet<T[]>(path);
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.map(normalizeId);
  } catch {
    return null;
  }
}

// Hero /api/hero ek single object return karta hai, array nahi — is liye
// isko fetchCollection ki bajaye alag se fetch karte hain.
async function fetchOne<T extends { _id?: string; id?: string }>(
  path: string
): Promise<T | null> {
  try {
    const data = await apiGet<T>(path);
    if (!data || typeof data !== 'object') return null;
    return normalizeId(data);
  } catch {
    return null;
  }
}

const fallbackContent: SiteContent = {
  hero: {
    id: fallback.hero.id,
    eyebrow: fallback.hero.eyebrow,
    headline: fallback.hero.headline,
    subtext: fallback.hero.subtext,
    primary_cta_text: fallback.hero.primaryCtaText,
    primary_cta_link: fallback.hero.primaryCtaLink,
    secondary_cta_text: fallback.hero.secondaryCtaText,
    secondary_cta_link: fallback.hero.secondaryCtaLink,
    image_url: fallback.hero.image,
    rating: fallback.hero.rating,
    learner_count_text: fallback.hero.learnerCountText,
  },
  segments: fallback.segments.map((s) => ({
    id: s.id,
    label: s.label,
    blurb: s.blurb,
    icon: s.icon,
    sort_order: 0,
  })),
  tracks: fallback.tracks.map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    category_label: t.categoryLabel,
    pay_range: t.payRange,
    time_to_income: t.timeToIncome,
    duration: t.duration,
    level: t.level,
    thumbnail: t.thumbnail,
    video_url: '',
    description: t.description,
    suitable_for: t.suitableFor,
    segment_id: t.segment,
    featured: t.featured ?? false,
    sort_order: 0,
  })),
  webinars: fallback.webinars.map((w) => ({
    id: w.id,
    title: w.title,
    date: w.date,
    time: w.time,
    segment_tag: w.segmentTag,
    speaker: w.speaker,
    category: w.category ?? null,
    sort_order: 0,
  })),
  stories: fallback.stories.map((s) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    location: s.location,
    quote: s.quote,
    outcome: s.outcome,
    avatar: s.avatar,
    sort_order: 0,
  })),
  steps: fallback.steps.map((s) => ({
    id: s.id,
    step: s.step,
    label: s.label,
    title: s.title,
    detail: s.detail,
    icon: s.icon,
    sort_order: s.step,
  })),
  stats: fallback.stats.map((s) => ({
    id: s.id,
    value: s.value,
    label: s.label,
    sort_order: 0,
  })),
  myths: fallback.myths.map((m) => ({
    id: m.id,
    myth: m.myth,
    truth: m.truth,
    sort_order: 0,
  })),
  pageHeadings: fallback.pageHeadings as PageHeadingsRow,
  footer: fallback.footer as FooterRow,
};

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: fallbackContent,
  loading: true,
  error: null,
  refetch: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hero, seg, tr, wb, st, sp, stat, my, ph, ft] = await Promise.all([
        fetchOne<HeroRow>('/hero'),
        fetchCollection<SegmentRow>('/segments'),
        fetchCollection<TrackRow>('/tracks'),
        fetchCollection<WebinarRow>('/webinars'),
        fetchCollection<StoryRow>('/stories'),
        fetchCollection<StepRow>('/steps'),
        fetchCollection<StatRow>('/stats'),
        fetchCollection<MythRow>('/myths'),
        fetchOne<PageHeadingsRow>('/page-headings'),
        fetchOne<FooterRow>('/footer'),
      ]);

      const next: SiteContent = { ...fallbackContent };
      if (hero) next.hero = hero;
      if (seg) next.segments = seg;
      if (tr) next.tracks = tr;
      if (wb) next.webinars = wb;
      if (st) next.stories = st;
      if (sp) next.steps = sp;
      if (stat) next.stats = stat;
      if (my) next.myths = my;
      // Merge onto defaults so any heading not yet returned by an older
      // backend still falls back to its default text instead of blank.
      if (ph) next.pageHeadings = { ...fallbackContent.pageHeadings, ...ph };
      if (ft) next.footer = { ...fallbackContent.footer, ...ft };
      setContent(next);
    } catch {
      // Keep fallback content — page stays usable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const onFocus = () => fetchAll();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchAll]);

  return (
    <SiteContentContext.Provider value={{ content, loading, error, refetch: fetchAll }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}