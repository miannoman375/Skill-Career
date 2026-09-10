import { Quote, TrendingUp, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useReveal } from '@/hooks/useReveal';

export default function SuccessStories() {
  const { content, loading } = useSiteContent();
  const { ref, visible } = useReveal<HTMLDivElement>();

  const stories = content.stories;

  return (
    <section id="stories" className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
            {content.pageHeadings.home_stories_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
            {content.pageHeadings.home_stories_heading}
          </h2>
          <p className="mt-3 text-ink-soft">
            {content.pageHeadings.home_stories_subtext}
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            <div
              ref={ref}
              className={`mt-10 grid gap-5 lg:grid-cols-3 reveal ${visible ? 'is-visible' : ''}`}
            >
              {stories.map((story, i) => (
                <Link
                  key={story.id}
                  to="/stories"
                  style={{ transitionDelay: `${i * 110}ms` }}
                  className="card group flex flex-col p-6 hover:-translate-y-1 hover:border-coral-200"
                >
                  <Quote className="h-7 w-7 text-coral-300" />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    "{story.quote}"
                  </blockquote>

                  <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-coral-100"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink">{story.name}</p>
                      <p className="truncate text-xs text-ink-muted">
                        {story.role} · {story.location}
                      </p>
                    </div>
                  </figcaption>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {story.outcome}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coral-400 transition-colors group-hover:text-coral-500">
                    Read full story
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/stories" className="btn-coral text-base">
                See all success stories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
          <MapPin className="h-3.5 w-3.5" />
          Stories shared with consent. Names changed where requested.
        </p>
      </div>
    </section>
  );
}
