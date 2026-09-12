import { Radio, Compass, Users, GraduationCap, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useReveal } from '@/hooks/useReveal';

const iconMap: Record<string, typeof Radio> = {
  radio: Radio,
  compass: Compass,
  users: Users,
  'graduation-cap': GraduationCap,
};

export default function HowItWorks() {
  const { content, loading } = useSiteContent();
  const { ref, visible } = useReveal<HTMLDivElement>();

  const steps = content.steps;

  return (
    <section id="about" className="bg-canvas-tint py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
            {content.pageHeadings.home_how_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {content.pageHeadings.home_how_heading}
          </h2>
          <p className="mt-3 text-ink-soft">
            {content.pageHeadings.home_how_subtext}
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-coral-500" />
          </div>
        ) : (
          <div
            ref={ref}
            className={`mt-12 flex flex-wrap justify-center gap-4 reveal ${
              visible ? 'is-visible' : ''
            }`}
          >
            {steps.map((step, i) => {
              const Icon = iconMap[step.icon] ?? Radio;
              return (
                <div
                  key={step.id}
                  style={{ transitionDelay: `${i * 100}ms` }}
                  className="card relative w-full p-6 hover:-translate-y-1 hover:border-coral-200 sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
                >
                  <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-indigo-50">
                    {step.step}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500 text-white">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  {step.id === 'guide' && (
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600 ring-1 ring-green-200">
                      <Sparkles className="h-3 w-3" />
                      Free
                    </span>
                  )}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-coral-400">
                    {step.label}
                  </p>
                  <h3 className="mt-1 text-base font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.detail}</p>

                  {i < steps.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-12 hidden h-5 w-5 text-indigo-200 lg:block" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
