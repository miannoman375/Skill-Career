import { Loader2 } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useReveal } from '@/hooks/useReveal';

export default function StatsBar() {
  const { content, loading } = useSiteContent();
  const { ref, visible } = useReveal<HTMLDivElement>();

  const stats = content.stats;

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-coral-500" />
          </div>
        ) : (
          <div
            ref={ref}
            className={`grid gap-4 rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-600 via-indigo-500 to-coral-500 p-8 text-white sm:grid-cols-3 sm:p-10 reveal ${
              visible ? 'is-visible' : ''
            }`}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.id}
                style={{ transitionDelay: `${i * 120}ms` }}
                className="text-center sm:border-r sm:border-white/20 sm:last:border-r-0"
              >
                <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-indigo-50">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
