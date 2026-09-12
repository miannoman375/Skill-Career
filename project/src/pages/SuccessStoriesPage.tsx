import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  TrendingUp,
  Quote,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { API_URL } from '@/lib/api';
import Modal from '@/components/Modal';
import type { StoryRow } from '@/types/content';

export default function SuccessStoriesPage() {
  const { content, loading, error } = useSiteContent();
  const stories = content.stories;

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<StoryRow | null>(null);

  const featured = useMemo(() => stories[0], [stories]);

  const rest = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stories.filter((s) => {
      if (featured && s.id === featured.id) return false;
      if (
        q &&
        !`${s.name} ${s.role} ${s.location} ${s.outcome}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [stories, featured, query]);

  const hasFilters = query.trim() !== '';
  const clearFilters = () => setQuery('');

  return (
    <div className="bg-canvas">
      <PageHeader count={stories.length} query={query} setQuery={setQuery} />

      <ResultBar hasFilters={hasFilters} onClear={clearFilters} resultCount={rest.length} />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {featured && !hasFilters && (
            <FeaturedStory story={featured} onSelect={() => setSelected(featured)} />
          )}
          <StoryGrid
            stories={rest}
            hasFilters={hasFilters}
            onClear={clearFilters}
            onSelect={setSelected}
          />
          <ImpactBar count={stories.length} />
          <CtaBanner />
          <SubmitStory />
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <img
                src={selected.avatar}
                alt={selected.name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-coral-100"
              />
              <div>
                <p className="text-base font-bold text-ink">{selected.name}</p>
                <p className="flex items-center gap-1 text-xs text-ink-muted">
                  <MapPin className="h-3 w-3" />
                  {selected.location}
                </p>
              </div>
            </div>

            <span className="chip mt-4 w-fit border border-line bg-canvas-tint text-coral-500">
              {selected.role}
            </span>

            <Quote className="mt-5 h-8 w-8 text-coral-300" />
            <blockquote className="mt-2 text-lg font-medium leading-relaxed text-ink">
              "{selected.quote}"
            </blockquote>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-coral-50 px-3 py-2 text-sm font-semibold text-coral-600">
              <TrendingUp className="h-4 w-4" />
              {selected.outcome}
            </div>

            <Link
              to="/#assessment"
              className="btn-primary mt-6 w-full text-base"
              onClick={() => setSelected(null)}
            >
              Take the free assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PageHeader({
  count,
  query,
  setQuery,
}: {
  count: number;
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] sm:text-5xl">
              {content.pageHeadings.stories_hero_heading}
            </h1>
            <p className="mt-3 max-w-xl text-lg text-ink-soft">
              People who were confused too. They took the assessment, made a plan, and changed
              their income. Here is what happened.
            </p>
          </div>
          <span className="chip w-fit bg-coral-400 text-white">
            <TrendingUp className="h-3.5 w-3.5" />
            {count > 0 ? `${count}+` : '150+'} success stories
          </span>
        </div>

        <div className="mt-7 max-w-xl">
          <label htmlFor="story-search" className="sr-only">
            Search stories
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
            <input
              id="story-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, or city"
              className="w-full rounded-xl border border-line bg-white py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-coral-300 focus:outline-none focus:ring-2 focus:ring-coral-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultBar({
  hasFilters,
  onClear,
  resultCount,
}: {
  hasFilters: boolean;
  onClear: () => void;
  resultCount: number;
}) {
  return (
    <section className="border-b border-line bg-canvas-card">
      <div className="container-page py-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-ink-muted">
            {resultCount} stor{resultCount === 1 ? 'y' : 'ies'} found
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs font-semibold text-coral-400 hover:text-coral-500"
            >
              <X className="h-3.5 w-3.5" />
              Clear search
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturedStory({ story, onSelect }: { story: StoryRow; onSelect: () => void }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="card overflow-hidden lg:grid lg:grid-cols-2">
          <div className="relative aspect-video overflow-hidden lg:aspect-auto">
            <img
              src={story.avatar}
              alt={story.name}
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent lg:bg-gradient-to-r" />
            <span className="absolute left-4 top-4 chip bg-coral-400 text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Featured story
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span className="chip w-fit border border-line bg-canvas-tint text-coral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
              {story.role}
            </span>
            <Quote className="mt-5 h-8 w-8 text-coral-300" />
            <blockquote className="mt-2 text-lg font-medium leading-relaxed text-ink sm:text-xl">
              "{story.quote}"
            </blockquote>

            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <img
                src={story.avatar}
                alt={story.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-coral-100"
              />
              <div>
                <p className="text-sm font-bold text-ink">{story.name}</p>
                <p className="flex items-center gap-1 text-xs text-ink-muted">
                  <MapPin className="h-3 w-3" />
                  {story.location}
                </p>
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-coral-50 px-3 py-2 text-sm font-semibold text-coral-600">
              <TrendingUp className="h-4 w-4" />
              {story.outcome}
            </div>

            <button type="button" onClick={onSelect} className="btn-primary mt-6 w-fit text-base">
              Read full story
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryGrid({
  stories,
  hasFilters,
  onClear,
  onSelect,
}: {
  stories: StoryRow[];
  hasFilters: boolean;
  onClear: () => void;
  onSelect: (s: StoryRow) => void;
}) {
  const { content } = useSiteContent();
  return (
    <section className="py-4 sm:py-6">
      <div className="container-page">
        <h2 className="text-2xl font-bold sm:text-3xl">{content.pageHeadings.stories_all_heading}</h2>

        {stories.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-canvas-card p-10 text-center">
            <p className="text-base font-semibold text-ink">No stories match that search.</p>
            <p className="mt-1 text-sm text-ink-soft">Try clearing the search or a different term.</p>
            {hasFilters && (
              <button type="button" onClick={onClear} className="btn-ghost mt-5">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} onSelect={onSelect} />
            ))}
          </div>
        )}

        {!hasFilters && stories.length > 0 && (
          <p className="mt-8 text-center text-sm text-ink-muted">
            Want to be next?{' '}
            <a href="#submit-story" className="font-semibold text-coral-500 hover:text-coral-400">
              Submit your story
            </a>
          </p>
        )}
      </div>
    </section>
  );
}

function StoryCard({ story, onSelect }: { story: StoryRow; onSelect: (s: StoryRow) => void }) {
  return (
    <article className="card group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-coral-200">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={story.avatar}
          alt={story.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
        <span className="absolute left-3 top-3 chip bg-white/90 text-ink backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
          {story.role}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <img
            src={story.avatar}
            alt={story.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-coral-100"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{story.name}</p>
            <p className="flex items-center gap-1 text-xs text-ink-muted">
              <MapPin className="h-3 w-3" />
              {story.location}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">"{story.quote}"</p>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-coral-50 px-2.5 py-1 text-xs font-semibold text-coral-600">
          <TrendingUp className="h-3.5 w-3.5" />
          {story.outcome}
        </div>

        <button
          type="button"
          onClick={() => onSelect(story)}
          className="btn-primary mt-5 w-full text-sm"
        >
          Read full story
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function ImpactBar({ count }: { count: number }) {
  const stats = [
    { value: count > 0 ? `${count}+` : '150+', label: 'Stories published' },
    { value: '24', label: 'Cities reached' },
    { value: 'Rs 1.2 Cr+', label: 'Combined yearly earnings' },
  ];
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-4 rounded-2xl border border-line bg-indigo-500 p-8 text-white sm:grid-cols-3 sm:p-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center sm:border-r sm:border-white/20 sm:last:border-r-0"
            >
              <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-medium text-indigo-100">{s.label}</p>
            </div>
          ))}
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
            {content.pageHeadings.stories_cta_heading}
          </h2>
          <p className="max-w-lg text-ink-soft">
            It starts with one free, honest assessment. Take it today and begin your own plan.
          </p>
          <Link to="/#assessment" className="btn-coral text-base">
            Take the free assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface NewStorySubmission {
  name: string;
  city: string;
  segment: string;
  category: string;
  track_label: string;
  outcome: string;
  quote: string;
  photo_url: string;
  submitter_email: string;
}

function SubmitStory() {
  const { content } = useSiteContent();
  const [form, setForm] = useState<NewStorySubmission>({
    name: '',
    city: '',
    segment: 'students',
    category: 'tech',
    track_label: '',
    outcome: '',
    quote: '',
    photo_url: '',
    submitter_email: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = <K extends keyof NewStorySubmission>(key: K, value: NewStorySubmission[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const payload = {
      ...form,
      submitter_email: form.submitter_email || null,
    };

    try {
      const res = await fetch(`${API_URL}/success-stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong sending your story. Please try again shortly.');
      return;
    }

    setStatus('success');
    setForm({
      name: '',
      city: '',
      segment: 'students',
      category: 'tech',
      track_label: '',
      outcome: '',
      quote: '',
      photo_url: '',
      submitter_email: '',
    });
  };

  return (
    <section id="submit-story" className="py-12 sm:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
              {content.pageHeadings.stories_submit_eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              {content.pageHeadings.stories_submit_heading}
            </h2>
            <p className="mt-3 text-ink-soft">
              Share your result. We review every submission before publishing — it goes into an
              approval queue so nothing shows up live without a check.
            </p>
          </div>

          {status === 'success' ? (
            <div className="mt-8 rounded-2xl border border-coral-200 bg-coral-50 p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-coral-500" />
              <p className="mt-3 text-base font-bold text-ink">Thank you — your story is in!</p>
              <p className="mt-1 text-sm text-ink-soft">
                Our team will review it and publish it once approved. You can submit another below.
              </p>
              <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-5">
                Submit another story
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card mt-8 grid gap-4 p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="input-base"
                    placeholder="e.g. Sana Khan"
                  />
                </Field>
                <Field label="City" required>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="input-base"
                    placeholder="e.g. Hyderabad"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Which segment are you?" required>
                  <select
                    value={form.segment}
                    onChange={(e) => update('segment', e.target.value)}
                    className="input-base"
                  >
                    <option value="students">Students & Job Seekers</option>
                    <option value="women-home">Women Learning From Home</option>
                    <option value="business">Small Business Owners</option>
                  </select>
                </Field>
                <Field label="Skill category" required>
                  <select
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="input-base"
                  >
                    <option value="tech">Tech</option>
                    <option value="creative">Creative</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="business">Business</option>
                    <option value="freelancing">Freelancing</option>
                  </select>
                </Field>
              </div>

              <Field label="Track / skill name" required>
                <input
                  type="text"
                  required
                  value={form.track_label}
                  onChange={(e) => update('track_label', e.target.value)}
                  className="input-base"
                  placeholder="e.g. Full-Stack Web Development"
                />
              </Field>

              <Field label="Short outcome line" required>
                <input
                  type="text"
                  required
                  value={form.outcome}
                  onChange={(e) => update('outcome', e.target.value)}
                  className="input-base"
                  placeholder="e.g. Started earning Rs 40k/month"
                />
              </Field>

              <Field label="Your story / quote" required>
                <textarea
                  required
                  rows={4}
                  value={form.quote}
                  onChange={(e) => update('quote', e.target.value)}
                  className="input-base resize-none"
                  placeholder="Tell us what changed for you..."
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Photo URL (link to your photo)">
                  <input
                    type="url"
                    value={form.photo_url}
                    onChange={(e) => update('photo_url', e.target.value)}
                    className="input-base"
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Email (optional, for follow-up)">
                  <input
                    type="email"
                    value={form.submitter_email}
                    onChange={(e) => update('submitter_email', e.target.value)}
                    className="input-base"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-2 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-ink-muted">
                  Submissions are reviewed before they appear publicly.
                </p>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full sm:w-auto"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit my story
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-soft">
        {label}
        {required && <span className="text-coral-400"> *</span>}
      </span>
      {children}
    </label>
  );
}

function LoadingState() {
  return (
    <section className="py-20">
      <div className="container-page flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
        <p className="text-sm text-ink-muted">Loading stories...</p>
      </div>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="py-20">
      <div className="container-page flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-coral-400" />
        <p className="text-sm text-ink-soft">{message}</p>
      </div>
    </section>
  );
}