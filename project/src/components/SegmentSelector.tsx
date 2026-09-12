import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Home, Store, ArrowRight, Loader2 } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const iconMap: Record<string, typeof GraduationCap> = {
  'graduation-cap': GraduationCap,
  home: Home,
  store: Store,
};

export default function SegmentSelector() {
  const { content, loading } = useSiteContent();
  const [active, setActive] = useState<string>(content.segments[0]?.id ?? '');
  const segments = content.segments;

  return (
    <section id="segments" className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            {content.pageHeadings.home_segments_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {content.pageHeadings.home_segments_heading}
          </h2>
          <p className="mt-3 text-ink-soft">
            {content.pageHeadings.home_segments_subtext}
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-coral-500" />
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {segments.map((seg, i) => {
              const Icon = iconMap[seg.icon] ?? GraduationCap;
              const isActive = active === seg.id;
              return (
                <div
                  key={seg.id}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className={`card group animate-fade-up p-6 text-left ${
                    isActive
                      ? 'border-green-300 ring-2 ring-green-200'
                      : 'hover:-translate-y-1 hover:border-coral-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-xl transition-colors ${
                        isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-coral-50 text-coral-500 group-hover:bg-coral-100'
                      }`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </span>
                    <button
                      type="button"
                      onClick={() => setActive(seg.id)}
                      className={`text-xs font-semibold transition-colors ${
                        isActive ? 'text-green-600' : 'text-ink-muted hover:text-coral-500'
                      }`}
                    >
                      {isActive ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{seg.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{seg.blurb}</p>
                  <Link
                    to="/#assessment"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coral-500 transition-colors hover:text-coral-400"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
