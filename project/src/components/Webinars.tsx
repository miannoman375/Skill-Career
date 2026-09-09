import { useState } from 'react';
import { CalendarDays, Clock, Tag, ArrowRight, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useReveal } from '@/hooks/useReveal';
import Modal from '@/components/Modal';
import type { WebinarRow } from '@/types/content';

export default function Webinars() {
  const { content, loading } = useSiteContent();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [selected, setSelected] = useState<WebinarRow | null>(null);
  const [registered, setRegistered] = useState<string | null>(null);

  const webinars = content.webinars;

  const handleRegister = () => {
    if (!selected) return;
    setRegistered(selected.id);
    setTimeout(() => {
      setSelected(null);
      setRegistered(null);
    }, 1800);
  };

  return (
    <section id="webinars" className="bg-canvas-tint py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
            {content.pageHeadings.home_webinars_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
            {content.pageHeadings.home_webinars_heading}
          </h2>
          <p className="mt-3 text-ink-soft">
            {content.pageHeadings.home_webinars_subtext}
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div
            ref={ref}
            className={`mt-10 grid gap-4 lg:grid-cols-3 reveal ${visible ? 'is-visible' : ''}`}
          >
            {webinars.map((wb, i) => (
              <article
                key={wb.id}
                style={{ transitionDelay: `${i * 100}ms` }}
                className="card flex flex-col p-5 hover:-translate-y-1 hover:border-indigo-200"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-indigo-500 text-white">
                    <span className="text-center leading-tight">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-indigo-100">
                        {wb.date.split(' ')[0]}
                      </span>
                      <span className="block text-lg font-extrabold">
                        {wb.date.split(' ')[1]}
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-ink">{wb.title}</h3>
                    <p className="mt-0.5 text-xs text-ink-muted">{wb.speaker}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    {wb.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-indigo-500" />
                    {wb.segment_tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                    Live on Zoom
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(wb)}
                  className="btn-green mt-5 w-full text-sm"
                >
                  Register free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="wb-title">
        {selected && (
          <div className="p-6 sm:p-7">
            {registered === selected.id ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">Seat saved!</h3>
                <p className="mt-2 max-w-sm text-sm text-ink-soft">
                  You are registered for "{selected.title}". We will email you the Zoom link
                  before the session starts.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-indigo-500 text-white">
                    <span className="text-center leading-tight">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-indigo-100">
                        {selected.date.split(' ')[0]}
                      </span>
                      <span className="block text-xl font-extrabold">
                        {selected.date.split(' ')[1]}
                      </span>
                    </span>
                  </div>
                  <div>
                    <h3 id="wb-title" className="text-lg font-bold text-ink">
                      {selected.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-ink-muted">{selected.speaker}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-line bg-canvas-tint p-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      Time
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink">{selected.time}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                      <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                      Mode
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink">Zoom</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                      <Tag className="h-3.5 w-3.5 text-indigo-500" />
                      For
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink">{selected.segment_tag}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  Enter your email and we will send you the joining link and a reminder before
                  the session.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                  className="mt-3 space-y-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="input-base"
                  />
                  <button type="submit" className="btn-green w-full text-base">
                    Confirm my seat
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
                >
                  <X className="h-4 w-4" />
                  Maybe later
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
