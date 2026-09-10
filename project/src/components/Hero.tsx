import { Star, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function Hero() {
  const { content, loading } = useSiteContent();
  const hero = content.hero;

  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-coral-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl"
      />

      <div className="container-page relative pt-12 pb-16 sm:pt-16 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="animate-fade-up">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
              {hero.headline}
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              {hero.subtext}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to={hero.primary_cta_link} className="btn-green text-base">
                {hero.primary_cta_text}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={hero.secondary_cta_link} className="btn-ghost text-base">
                <Play className="h-4 w-4" />
                {hero.secondary_cta_text}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-coral-400 text-coral-400" />
                  ))}
                </div>
                <span className="font-semibold text-ink">{hero.rating}/5</span>
                <span>from {hero.learner_count_text}</span>
              </div>
              <div className="hidden h-4 w-px bg-line sm:block" />
              <span className="inline-flex items-center gap-1 font-semibold text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                100% free
              </span>
              <span>to start</span>
            </div>
          </div>

          <div className="relative animate-fade-in [animation-delay:200ms]">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_30px_rgba(61,58,140,0.08)]">
                {loading ? (
                  <div className="aspect-[4/3] w-full animate-pulse bg-line/40" />
                ) : (
                  <img
                    src={hero.image_url}
                    alt="A team collaborating and learning together"
                    className="aspect-[4/3] w-full object-cover"
                    loading="eager"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
