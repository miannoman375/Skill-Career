import { Link } from 'react-router-dom';
import {
  Sparkles,
  Radio,
  Compass,
  Users,
  GraduationCap,
  Heart,
  ShieldCheck,
  Lock,
  HandHeart,
  ArrowRight,
  MessageCircle,
  ClipboardList,
  CalendarDays,
  Megaphone,
  CheckCircle2,
} from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useSiteContent } from '@/hooks/useSiteContent';

const funnel = [
  {
    id: 'reach',
    step: 1,
    label: 'Reach',
    title: 'We meet you where you are',
    icon: Radio,
    points: [
      { icon: Megaphone, text: 'Social media content & myth-busting posts' },
      { icon: CalendarDays, text: 'Free webinars and college seminars' },
      { icon: MessageCircle, text: 'Community awareness drives' },
    ],
    comingSoon: false,
  },
  {
    id: 'guide',
    step: 2,
    label: 'Guide',
    title: 'A real plan, not a sales pitch',
    icon: Compass,
    points: [
      { icon: ClipboardList, text: 'Free skill assessment (12 minutes)' },
      { icon: Compass, text: 'Personalized career roadmap' },
      { icon: MessageCircle, text: 'One-to-one guidance call' },
    ],
    comingSoon: false,
  },
  {
    id: 'community',
    step: 3,
    label: 'Community',
    title: 'Learn with people like you',
    icon: Users,
    points: [
      { icon: MessageCircle, text: 'WhatsApp & Discord study groups' },
      { icon: Users, text: 'Mentor support and progress check-ins' },
      { icon: Heart, text: 'Women-only cohorts for safe learning' },
    ],
    comingSoon: false,
  },
  {
    id: 'training',
    step: 4,
    label: 'Training',
    title: 'Structured paid programs',
    icon: GraduationCap,
    points: [
      { icon: GraduationCap, text: 'Curated short courses & internships' },
      { icon: CheckCircle2, text: 'Only once your path is clear' },
      { icon: Sparkles, text: 'Tracked outcomes and job support' },
    ],
    comingSoon: true,
  },
];

const segments = [
  {
    id: 'students',
    label: 'Students & Job Seekers',
    why: 'Most never meet a career counselor. We give them a free plan before they spend on any course.',
    icon: GraduationCap,
  },
  {
    id: 'women-home',
    label: 'Women Learning From Home',
    why: 'Flexible hours, women-only batches, and privacy controls so learning fits around family.',
    icon: Heart,
  },
  {
    id: 'business',
    label: 'Small Business Owners',
    why: 'They do not need another app. They need the one skill that grows their shop.',
    icon: Megaphone,
  },
];

const mentors = [
  {
    name: 'Anjali Mehta',
    role: 'Lead Career Coach',
    desc: 'Runs our free assessments and one-to-one guidance calls.',
    nameKey: 'about_mentor_1_name',
    roleKey: 'about_mentor_1_role',
    descKey: 'about_mentor_1_desc',
    photoKey: 'about_mentor_1_photo',
    photo: 'https://images.pexels.com/photos/38707525/pexels-photo-38707525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Priya Nair',
    role: 'Freelance Mentor',
    desc: 'Leads freelance skill sessions and interview prep.',
    nameKey: 'about_mentor_2_name',
    roleKey: 'about_mentor_2_role',
    descKey: 'about_mentor_2_desc',
    photoKey: 'about_mentor_2_photo',
    photo: 'https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Rahul Verma',
    role: 'Marketing Consultant',
    desc: 'Guides small business owners on digital growth.',
    nameKey: 'about_mentor_3_name',
    roleKey: 'about_mentor_3_role',
    descKey: 'about_mentor_3_desc',
    photoKey: 'about_mentor_3_photo',
    photo: 'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Sneha Rao',
    role: 'Brand Designer',
    desc: 'Teaches design basics and portfolio building for beginners.',
    nameKey: 'about_mentor_4_name',
    roleKey: 'about_mentor_4_role',
    descKey: 'about_mentor_4_desc',
    photoKey: 'about_mentor_4_photo',
    photo: 'https://images.pexels.com/photos/7752788/pexels-photo-7752788.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

const values = [
  {
    title: 'Free guidance, no hidden cost',
    detail: 'Assessments, roadmaps, and mentor calls are free — always. Paid training comes later, only if you choose it.',
    icon: HandHeart,
    accent: 'green' as const,
  },
  {
    title: 'Privacy-first for women learners',
    detail: 'Women-only batches, moderated sessions, and full control over who can contact you.',
    icon: Lock,
    accent: 'coral' as const,
  },
  {
    title: 'Community over content',
    detail: 'Videos do not finish a course. People do. We invest in peer groups and mentors, not just libraries.',
    icon: Users,
    accent: 'coral' as const,
  },
  {
    title: 'Honesty before enrollment',
    detail: 'We will tell you a track is not for you. Our job is the right plan, not a sale.',
    icon: ShieldCheck,
    accent: 'coral' as const,
  },
];

const stats = [
  { value: '24', label: 'Cities reached' },
  { value: '18,000+', label: 'Learners guided' },
  { value: '320', label: 'Webinars delivered' },
];

export default function AboutPage() {
  return (
    <div className="bg-canvas">
      <PageHeader />
      <WhyWeExist />
      <Funnel />
      <Segments />
      <Mentors />
      <Values />
      <StatsBar />
      <CtaBanner />
    </div>
  );
}

function PageHeader() {
  const { content } = useSiteContent();
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-10 h-64 w-64 rounded-full bg-coral-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl"
      />
      <div className="container-page relative py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            {content.pageHeadings.about_hero_heading}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            We provide free career guidance with no upfront cost. No course is pushed on you, no
            sign-up fee, no fine print. Just a clear plan — and a community that helps you follow it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/#assessment" className="btn-primary text-base">
              Take the free assessment
            </Link>
            <Link to="/library" className="btn-ghost text-base">
              Browse career explainers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyWeExist() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { content } = useSiteContent();
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div
          ref={ref}
          className={`mx-auto grid max-w-4xl gap-8 lg:grid-cols-2 lg:items-center reveal ${
            visible ? 'is-visible' : ''
          }`}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
              {content.pageHeadings.about_why_eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              {content.pageHeadings.about_why_heading}
            </h2>
            <p className="mt-4 text-ink-soft">
              Career advice used to live in scattered spreadsheets, half-read WhatsApp threads,
              and ad-hoc sign-up forms. Good intentions, no system. People got lost between the
              cracks — unsure what to learn, who to trust, or where to start.
            </p>
            <p className="mt-3 text-ink-soft">
              Skill &amp; Career replaces that mess with one centralized, trustworthy platform:
              a free assessment, an honest roadmap, and a community that keeps you moving.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              { label: 'Before', text: 'Spreadsheets, chat threads, ad-hoc sign-ups', muted: true },
              { label: 'Now', text: 'One platform: assess, plan, learn, together', muted: false },
            ].map((row) => (
              <div
                key={row.label}
                className={`rounded-xl border p-5 ${
                  row.muted
                    ? 'border-line bg-canvas-card text-ink-muted'
                    : 'border-coral-200 bg-coral-50 text-ink'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider">
                  {row.label}
                </p>
                <p className="mt-1 text-sm font-medium">{row.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Funnel() {
  const { content } = useSiteContent();
  return (
    <section id="about" className="bg-canvas-tint py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
            {content.pageHeadings.about_funnel_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {content.pageHeadings.about_funnel_heading}
          </h2>
          <p className="mt-3 text-ink-soft">
            From first contact to a paying skill — each step is free until you choose training.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-indigo-200 lg:block"
          />
          <div className="grid gap-5 lg:grid-cols-4">
            {funnel.map((step, i) => (
              <FunnelCard key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FunnelCard({
  step,
  index,
}: {
  step: (typeof funnel)[number];
  index: number;
}) {
  const Icon = step.icon;
  return (
    <div
      style={{ transitionDelay: `${index * 100}ms` }}
      className="card relative flex flex-col p-6 hover:-translate-y-1 hover:border-coral-200"
    >
      <div className="flex items-center gap-3">
        <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-indigo-500 text-white shadow-sm">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </span>
        <span className="font-display text-3xl font-extrabold text-indigo-100">
          {String(step.step).padStart(2, '0')}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-coral-400">
        {step.label}
      </p>
      <h3 className="mt-1 text-base font-bold">{step.title}</h3>

      <ul className="mt-3 space-y-2">
        {step.points.map((p) => {
          const PointIcon = p.icon;
          return (
            <li key={p.text} className="flex items-start gap-2 text-sm text-ink-soft">
              <PointIcon className="mt-0.5 h-4 w-4 shrink-0 text-coral-400" />
              {p.text}
            </li>
          );
        })}
      </ul>

      {step.comingSoon && (
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-coral-400 px-3 py-1 text-xs font-bold text-white">
          <Sparkles className="h-3.5 w-3.5" />
          Coming Soon
        </span>
      )}
    </div>
  );
}

function Segments() {
  const { content } = useSiteContent();
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
            {content.pageHeadings.about_segments_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {content.pageHeadings.about_segments_heading}
          </h2>
          <p className="mt-3 text-ink-soft">
            Three audiences, three different needs. Same free guidance, delivered differently.
          </p>
        </div>

        <div
          ref={ref}
          className={`mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal ${
            visible ? 'is-visible' : ''
          }`}
        >
          {segments.map((seg, i) => {
            const Icon = seg.icon;
            return (
              <div
                key={seg.id}
                style={{ transitionDelay: `${i * 90}ms` }}
                className="card p-6 hover:-translate-y-1 hover:border-coral-200"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-coral-50 text-coral-500">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-base font-bold">{seg.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{seg.why}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Mentors() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { content } = useSiteContent();
  return (
    <section className="bg-canvas-tint py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
            {content.pageHeadings.about_mentors_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {content.pageHeadings.about_mentors_heading}
          </h2>
          <p className="mt-3 text-ink-soft">
            The coaches and mentors who run our sessions, assessments, and community groups.
          </p>
        </div>

        <div
          ref={ref}
          className={`mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 reveal ${
            visible ? 'is-visible' : ''
          }`}
        >
          {mentors.map((m, i) => {
            const ph = content.pageHeadings;
            const photo = ph[m.photoKey as keyof typeof ph] || m.photo;
            const name = ph[m.nameKey as keyof typeof ph] || m.name;
            const role = ph[m.roleKey as keyof typeof ph] || m.role;
            const desc = ph[m.descKey as keyof typeof ph] || m.desc;
            return (
              <div
                key={m.name}
                style={{ transitionDelay: `${i * 80}ms` }}
                className="card flex flex-col overflow-hidden text-center hover:-translate-y-1 hover:border-coral-200"
              >
                <img
                  src={photo}
                  alt={name}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-sm font-bold text-ink">{name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{role}</p>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-soft">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Values() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { content } = useSiteContent();
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-400">
            {content.pageHeadings.about_values_eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {content.pageHeadings.about_values_heading}
          </h2>
        </div>

        <div
          ref={ref}
          className={`mt-10 grid gap-5 sm:grid-cols-2 reveal ${visible ? 'is-visible' : ''}`}
        >
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                style={{ transitionDelay: `${i * 90}ms` }}
                className="card flex gap-4 p-6 hover:-translate-y-1 hover:border-green-200"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                    v.accent === 'green'
                      ? 'bg-green-50 text-green-500'
                      : 'bg-coral-50 text-coral-400'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-base font-bold">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{v.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-4 rounded-2xl border border-line bg-indigo-500 p-8 text-white sm:grid-cols-3 sm:p-10">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ transitionDelay: `${i * 120}ms` }}
              className="text-center sm:border-r sm:border-white/20 sm:last:border-r-0"
            >
              <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
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
            {content.pageHeadings.about_cta_heading}
          </h2>
          <p className="max-w-lg text-ink-soft">
            Take the free assessment and get a clear career plan in 12 minutes — no cost, no catch.
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
