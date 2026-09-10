import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import AuthLink from '@/components/AuthLink';
import { useSiteContent } from '@/hooks/useSiteContent';

// Lucide-react mein official TikTok icon nahi hai (trademark ki wajah se),
// is liye ek chhota sa custom SVG bana diya — baaki icons jaisa hi size/style.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.9-.98-1.4-2.24-1.4-3.57h-3.05v13.9c0 1.55-1.26 2.8-2.8 2.8a2.8 2.8 0 0 1 0-5.6c.3 0 .58.04.85.13V10.4a5.9 5.9 0 0 0-.85-.06 5.87 5.87 0 1 0 5.87 5.87V9.4a8.9 8.9 0 0 0 5.18 1.66V8.02a5.7 5.7 0 0 1-3.8-2.2Z" />
    </svg>
  );
}

// Har social platform ka icon aur admin panel mein uska field name.
// Jis platform ki URL admin ne khali chodi ho, wo yahan se hide ho jata hai.
const socialIcons = [
  { icon: Facebook, label: 'Facebook', key: 'social_facebook' as const },
  { icon: Instagram, label: 'Instagram', key: 'social_instagram' as const },
  { icon: Linkedin, label: 'LinkedIn', key: 'social_linkedin' as const },
  { icon: Youtube, label: 'YouTube', key: 'social_youtube' as const },
  { icon: TikTokIcon, label: 'TikTok', key: 'social_tiktok' as const },
];

export default function Footer() {
  const { content } = useSiteContent();
  const footer = content.footer;
  const columns = footer.columns;
  const socials = socialIcons.filter((s) => footer[s.key]);

  return (
    <footer className="relative overflow-hidden bg-indigo-900">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-coral-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl"
      />

      <div className="container-page relative py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1.5 shadow-sm sm:h-12 sm:w-12">
                <img src="/images/logo.png" alt="Skill & Career logo" className="h-full w-full object-contain" />
              </span>
              <span className="font-display text-lg font-bold text-white">
                Skill <span className="text-coral-300">&</span> Career
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-indigo-100/70">
              {footer.description}
            </p>

            <div className="mt-5 space-y-2 text-sm text-indigo-100/70">
              {footer.email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-coral-300" />
                  {footer.email}
                </p>
              )}
              {footer.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-coral-300" />
                  {footer.phone}
                </p>
              )}
              {footer.address && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-coral-300" />
                  {footer.address}
                </p>
              )}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => {
                  const isAuthLink = link.to === '/login' || link.to === '/signup';
                  const LinkComponent = isAuthLink ? AuthLink : Link;
                  return (
                    <li key={link.label}>
                      <LinkComponent
                        to={link.to}
                        className="text-sm text-indigo-100/70 transition-colors hover:text-coral-300"
                      >
                        {link.label}
                      </LinkComponent>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-indigo-100/60">
            © {new Date().getFullYear()} {footer.copyright_text}
          </p>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={footer[s.key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-indigo-100/70 transition-all hover:-translate-y-0.5 hover:border-coral-300/50 hover:text-coral-300"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
