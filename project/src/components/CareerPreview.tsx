import { useState } from 'react';
import { Play, Clock, Wallet, Timer, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLink from '@/components/AuthLink';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useReveal } from '@/hooks/useReveal';
import Modal from '@/components/Modal';
import type { TrackRow } from '@/types/content';

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

export default function CareerPreview() {
  const { content, loading } = useSiteContent();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [selected, setSelected] = useState<TrackRow | null>(null);

  const sorted = [
    ...content.tracks.filter((t) => t.featured),
    ...content.tracks.filter((t) => !t.featured),
  ];
  const tracks = sorted.slice(0, 4);

  return (
    <section id="tracks" className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
              {content.pageHeadings.home_tracks_eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
              {content.pageHeadings.home_tracks_heading}
            </h2>
            <p className="mt-3 text-ink-soft">
              {content.pageHeadings.home_tracks_subtext}
            </p>
          </div>
          <Link
            to="/library"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-500 hover:text-coral-400"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div
            ref={ref}
            className={`mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 reveal ${
              visible ? 'is-visible' : ''
            }`}
          >
            {tracks.map((track, i) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelected(track)}
                style={{ transitionDelay: `${i * 90}ms` }}
                className="card group overflow-hidden text-left hover:-translate-y-1 hover:border-indigo-200"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent" />
                  <span className="absolute left-3 top-3 chip bg-white/90 text-ink backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
                    {track.category_label}
                  </span>
                  <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-indigo-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-5 w-5 fill-indigo-500" />
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold leading-snug text-ink">{track.title}</h3>
                  <p className="mt-1 text-xs font-medium text-ink-muted">{track.level}</p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-indigo-500" />
                      {track.pay_range}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      {track.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5 text-indigo-500" />
                      {track.time_to_income}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

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
              <h3 id="track-title" className="text-xl font-bold text-ink sm:text-2xl">
                {selected.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-ink-muted">{selected.level}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {selected.description}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <Wallet className="h-3.5 w-3.5 text-indigo-500" />
                    Pay
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{selected.pay_range}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    Length
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{selected.duration}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <Timer className="h-3.5 w-3.5 text-indigo-500" />
                    To income
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{selected.time_to_income}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selected.suitable_for.map((tag) => (
                  <span key={tag} className="chip border border-line bg-white text-ink-soft">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                    {tag}
                  </span>
                ))}
              </div>

              <AuthLink
                to="/signup"
                className="btn-primary mt-6 w-full text-base"
                onClick={() => setSelected(null)}
              >
                Start your assessment
                <ArrowRight className="h-4 w-4" />
              </AuthLink>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}