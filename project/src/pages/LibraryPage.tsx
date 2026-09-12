import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Play,
  Clock,
  Wallet,
  Timer,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Tag,
  Loader2,
} from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import Modal from '@/components/Modal';
import type { TrackRow, WebinarRow } from '@/types/content';

type FilterOption = { id: string; label: string };

const categoryFilters: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'tech', label: 'Tech' },
  { id: 'creative', label: 'Creative' },
  { id: 'marketing', label: 'Digital Marketing' },
  { id: 'business', label: 'Business' },
  { id: 'freelancing', label: 'Freelancing' },
];

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export default function LibraryPage() {
  const { content, loading } = useSiteContent();
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [mythIndex, setMythIndex] = useState(0);
  const [selected, setSelected] = useState<TrackRow | null>(null);

  const tracks = content.tracks;
  const myths = content.myths;
  const webinars = content.webinars;

  const segmentFilters: FilterOption[] = [
    { id: 'all', label: 'All' },
    ...content.segments.map((s) => ({ id: s.id, label: s.label })),
  ];

  const featured = tracks.find((t) => t.featured) ?? tracks[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tracks.filter((t) => {
      if (featured && t.id === featured.id) return false;
      if (segment !== 'all' && t.segment_id !== segment) return false;
      if (category !== 'all' && t.category !== category) return false;
      if (
        q &&
        !`${t.title} ${t.description} ${t.category_label}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [query, segment, category, featured, tracks]);

  const relatedWebinars = useMemo(() => {
    if (category === 'all') return webinars.slice(0, 3);
    const match = webinars.filter((w) => w.category === category);
    return match.length ? match : webinars.slice(0, 3);
  }, [category, webinars]);

  const hasFilters = segment !== 'all' || category !== 'all' || query.trim() !== '';

  const clearFilters = () => {
    setQuery('');
    setSegment('all');
    setCategory('all');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
      </div>
    );
  }

  if (!featured) {
    return (
      <div className="container-page py-20 text-center text-ink-soft">
        No career tracks available yet.
      </div>
    );
  }

  return (
    <div className="bg-canvas">
      <PageHeader query={query} setQuery={setQuery} />

      <Filters
        segmentFilters={segmentFilters}
        segment={segment}
        setSegment={setSegment}
        category={category}
        setCategory={setCategory}
        hasFilters={hasFilters}
        onClear={clearFilters}
        resultCount={filtered.length}
      />

      <FeaturedExplainer track={featured} onWatch={() => setSelected(featured)} />

      <SkillGrid
        tracks={filtered}
        onClear={clearFilters}
        hasFilters={hasFilters}
        onWatch={setSelected}
      />

      {myths.length > 0 && <MythBusting myths={myths} index={mythIndex} setIndex={setMythIndex} />}

      <CtaBanner />

      <RelatedWebinars webinars={relatedWebinars} category={category} />

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
              {selected.video_url && getYouTubeEmbedUrl(selected.video_url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(selected.video_url)!}
                  title={selected.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selected.video_url && isDirectVideoFile(selected.video_url) ? (
                <video
                  src={selected.video_url}
                  controls
                  autoPlay
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <img
                    src={selected.thumbnail}
                    alt={selected.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                </>
              )}
              <span className="absolute left-4 top-4 chip bg-white/90 text-ink backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
                {selected.category_label}
              </span>
            </div>

            <div className="p-6 sm:p-7">
              <h3 className="text-xl font-bold sm:text-2xl">{selected.title}</h3>
              <p className="mt-1 text-sm font-medium text-ink-muted">{selected.level}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{selected.description}</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <Wallet className="h-3.5 w-3.5 text-coral-500" />
                    Pay
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{selected.pay_range}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <Clock className="h-3.5 w-3.5 text-coral-500" />
                    Length
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{selected.duration}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <Timer className="h-3.5 w-3.5 text-coral-500" />
                    To income
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{selected.time_to_income}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selected.suitable_for.map((tag) => (
                  <span key={tag} className="chip border border-line bg-white text-ink-soft">
                    <CheckCircle2 className="h-3.5 w-3.5 text-coral-400" />
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                to="/#assessment"
                className="btn-primary mt-6 w-full text-base"
                onClick={() => setSelected(null)}
              >
                Start your assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PageHeader({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  const { content } = useSiteContent();
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-10 h-64 w-64 rounded-full bg-coral-100/50 blur-3xl"
      />
      <div className="container-page relative py-12 sm:py-16">
        <h1 className="text-balance text-4xl font-extrabold leading-[1.1] sm:text-5xl">
          {content.pageHeadings.library_hero_heading}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Short, honest video explainers for each skill track — pay, time to income, and who it
          suits. Watch before you commit to any course.
        </p>

        <div className="mt-7 max-w-xl">
          <label htmlFor="skill-search" className="sr-only">
            Search skills
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
            <input
              id="skill-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a skill, e.g. “web development”"
              className="w-full rounded-xl border border-line bg-white py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-coral-300 focus:outline-none focus:ring-2 focus:ring-coral-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Filters({
  segmentFilters,
  segment,
  setSegment,
  category,
  setCategory,
  hasFilters,
  onClear,
  resultCount,
}: {
  segmentFilters: FilterOption[];
  segment: string;
  setSegment: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  hasFilters: boolean;
  onClear: () => void;
  resultCount: number;
}) {
  return (
    <section className="border-b border-line bg-canvas-card">
      <div className="container-page py-5">
        <div className="space-y-4">
          <FilterRow label="Who" options={segmentFilters} value={segment} onChange={setSegment} />
          <FilterRow
            label="Category"
            options={categoryFilters}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-medium text-ink-muted">
            {resultCount} skill{resultCount === 1 ? '' : 's'} found
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs font-semibold text-coral-400 hover:text-coral-500"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-ink-muted sm:w-20">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                active
                  ? 'bg-indigo-500 text-white'
                  : 'border border-line bg-white text-ink-soft hover:border-coral-200 hover:text-coral-500'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FeaturedExplainer({ track, onWatch }: { track: TrackRow; onWatch: () => void }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="card overflow-hidden lg:grid lg:grid-cols-2">
          <div className="relative aspect-video overflow-hidden lg:aspect-auto">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent lg:bg-gradient-to-r" />
            <span className="absolute left-4 top-4 chip bg-coral-400 text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Featured
            </span>
            <button
              type="button"
              aria-label="Play featured explainer"
              onClick={onWatch}
              className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-coral-500 shadow-lg transition-transform hover:scale-110"
            >
              <Play className="h-7 w-7 fill-indigo-500" />
            </button>
            <span className="absolute bottom-4 left-4 chip bg-white/90 text-ink backdrop-blur">
              <Clock className="h-3.5 w-3.5" />
              45-second explainer
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span className="chip w-fit border border-line bg-canvas-tint text-coral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
              {track.category_label}
            </span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{track.title}</h2>
            <p className="mt-3 text-ink-soft">{track.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Metric icon={Wallet} label="Pay" value={track.pay_range} />
              <Metric icon={Timer} label="Time to income" value={track.time_to_income} />
              <Metric icon={Clock} label="Course length" value={track.duration} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {track.suitable_for.map((tag) => (
                <span key={tag} className="chip border border-line bg-white text-ink-soft">
                  <CheckCircle2 className="h-3.5 w-3.5 text-coral-400" />
                  {tag}
                </span>
              ))}
            </div>

            <button type="button" onClick={onWatch} className="btn-primary mt-7 w-fit text-base">
              <Play className="h-4 w-4 fill-white" />
              Watch the 45-second explainer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
        <Icon className="h-3.5 w-3.5 text-coral-500" />
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function SkillGrid({
  tracks: list,
  hasFilters,
  onClear,
  onWatch,
}: {
  tracks: TrackRow[];
  hasFilters: boolean;
  onClear: () => void;
  onWatch: (t: TrackRow) => void;
}) {
  const { content } = useSiteContent();
  return (
    <section className="py-4 sm:py-6">
      <div className="container-page">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">{content.pageHeadings.library_all_heading}</h2>
        </div>

        {list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-canvas-card p-10 text-center">
            <p className="text-base font-semibold text-ink">No skills match those filters.</p>
            <p className="mt-1 text-sm text-ink-soft">
              Try clearing a filter or searching for something broader.
            </p>
            <button type="button" onClick={onClear} className="btn-ghost mt-5">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((track) => (
              <SkillCard key={track.id} track={track} onWatch={onWatch} />
            ))}
          </div>
        )}

        {!hasFilters && (
          <p className="mt-8 text-center text-sm text-ink-muted">
            Can’t find a skill?{' '}
            <Link to="/#assessment" className="font-semibold text-coral-500 hover:text-coral-400">
              Take the assessment
            </Link>{' '}
            and we will suggest tracks that fit you.
          </p>
        )}
      </div>
    </section>
  );
}

function SkillCard({ track, onWatch }: { track: TrackRow; onWatch: (t: TrackRow) => void }) {
  return (
    <article className="card group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-coral-200">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={track.thumbnail}
          alt={track.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
        <span className="absolute left-3 top-3 chip bg-white/90 text-ink backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
          {track.category_label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug">{track.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {track.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-coral-500" />
            {track.pay_range}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5 text-coral-500" />
            {track.time_to_income}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {track.suitable_for.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-canvas-tint px-2 py-0.5 text-[11px] font-medium text-coral-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onWatch(track)}
          className="btn-primary mt-5 w-full text-sm"
        >
          <Play className="h-4 w-4 fill-white" />
          Watch explainer
        </button>
      </div>
    </article>
  );
}

function MythBusting({
  myths,
  index,
  setIndex,
}: {
  myths: { id: string; myth: string; truth: string }[];
  index: number;
  setIndex: (i: number) => void;
}) {
  const myth = myths[index];
  const { content } = useSiteContent();
  const go = (dir: number) => {
    const next = (index + dir + myths.length) % myths.length;
    setIndex(next);
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="rounded-2xl bg-coral-50 p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
                {content.pageHeadings.library_myths_eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {content.pageHeadings.library_myths_heading}
              </h2>
              <p className="mt-3 text-sm text-ink-soft">
                The worries that stop people before they start — and what is actually true.
              </p>
            </div>

            <div className="flex-1 lg:max-w-2xl">
              <div className="rounded-xl border border-coral-200 bg-white p-6">
                <p className="font-display text-lg font-bold text-ink line-through decoration-coral-300/70">
                  {myth.myth}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  <span className="font-semibold text-coral-400">Truth: </span>
                  {myth.truth}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {myths.map((m, i) => (
                      <button
                        key={m.id}
                        type="button"
                        aria-label={`Go to myth ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? 'w-6 bg-indigo-500' : 'w-2 bg-indigo-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Previous myth"
                      onClick={() => go(-1)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-ink-soft transition-colors hover:border-coral-200 hover:text-coral-500"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next myth"
                      onClick={() => go(1)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-ink-soft transition-colors hover:border-coral-200 hover:text-coral-500"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  const { content } = useSiteContent();
  return (
    <section className="py-8 sm:py-12">
      <div className="container-page">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-coral-200 bg-coral-50 p-8 text-center sm:p-12">
          <h2 className="max-w-xl text-balance text-2xl font-bold sm:text-3xl">
            {content.pageHeadings.library_cta_heading}
          </h2>
          <p className="max-w-lg text-ink-soft">
            Take the free assessment and get a clear plan in 12 minutes — before you spend on any course.
          </p>
          <a href="#assessment" className="btn-coral text-base">
            Take the free assessment
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function RelatedWebinars({
  webinars: list,
  category,
}: {
  webinars: WebinarRow[];
  category: string;
}) {
  const { content } = useSiteContent();
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
              {content.pageHeadings.library_webinars_eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              {category === 'all' ? 'Upcoming webinars' : 'Webinars for this category'}
            </h2>
          </div>
          <Link
            to="/#webinars"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-coral-500 hover:text-coral-400"
          >
            See all webinars
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {list.map((wb) => (
            <article key={wb.id} className="card flex flex-col p-5 hover:-translate-y-1 hover:border-coral-200">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-indigo-500 text-white">
                  <span className="text-center leading-tight">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-indigo-100">
                      {wb.date.split(' ')[0]}
                    </span>
                    <span className="block text-lg font-extrabold">{wb.date.split(' ')[1]}</span>
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold">{wb.title}</h3>
                  <p className="mt-0.5 text-xs text-ink-muted">{wb.speaker}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-coral-500" />
                  {wb.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-coral-500" />
                  {wb.segment_tag}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-coral-500" />
                  Live on Zoom
                </span>
              </div>

              <Link to="/#webinars" className="btn-primary mt-5 w-full text-sm">
                Register free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}