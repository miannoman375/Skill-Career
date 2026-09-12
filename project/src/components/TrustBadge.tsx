import { ShieldCheck, Lock, UsersRound } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const points = [
  {
    icon: Lock,
    title: 'Privacy-first by default',
    detail: 'Your assessment answers are never sold or shared with training vendors.',
  },
  {
    icon: UsersRound,
    title: 'Women-only session controls',
    detail: 'Learners in women-only cohorts choose who joins their live sessions.',
  },
  {
    icon: ShieldCheck,
    title: 'No pressure, ever',
    detail: 'Guidance is free. We only suggest paid training once your plan is clear.',
  },
];

export default function TrustBadge() {
  const { content } = useSiteContent();
  return (
    <section className="py-6">
      <div className="container-page">
        <div className="rounded-2xl border border-coral-200 bg-coral-50 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 text-white">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h2 className="text-xl font-bold">
                  {content.pageHeadings.home_trust_heading}
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                We take privacy and comfort seriously. Women-only batches, moderated sessions,
                and full control over who can contact you.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
              {points.map((p) => (
                <li
                  key={p.title}
                  className="rounded-xl border border-coral-100 bg-white p-4"
                >
                  <p.icon className="h-5 w-5 text-coral-400" />
                  <p className="mt-2 text-sm font-bold text-ink">{p.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
