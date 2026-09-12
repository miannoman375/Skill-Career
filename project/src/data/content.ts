// Structured content shaped like REST API responses.
// In production these arrays would come from endpoints such as
// GET /tracks, GET /webinars, GET /assessments/questions.

export type Hero = {
  id: string;
  eyebrow: string;
  headline: string;
  subtext: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  rating: number;
  learnerCountText: string;
};

export const hero: Hero = {
  id: 'hero',
  eyebrow: 'Guidance first, training later',
  headline: 'Choose a career path you will actually love.',
  subtext:
    'Not sure which skill to learn? Take our free assessment and get a clear, honest career plan before you spend a rupee on any course.',
  primaryCtaText: 'Take the free skill assessment',
  primaryCtaLink: '/#assessment',
  secondaryCtaText: 'Browse career explainers',
  secondaryCtaLink: '/library',
  image:
    'https://images.pexels.com/photos/7792836/pexels-photo-7792836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rating: 4.8,
  learnerCountText: '2,400+ learners',
};

export type Segment = {
  id: string;
  label: string;
  blurb: string;
  icon: 'graduation-cap' | 'home' | 'store';
};

export const segments: Segment[] = [
  {
    id: 'students',
    label: 'Students & Job Seekers',
    blurb: 'Figure out which career actually fits you before you spend on a course.',
    icon: 'graduation-cap',
  },
  {
    id: 'women-home',
    label: 'Women Learning From Home',
    blurb: 'Flexible, women-only sessions and privacy-first learning on your schedule.',
    icon: 'home',
  },
  {
    id: 'business',
    label: 'Small Business Owners',
    blurb: 'Pick up the digital skills that grow your customers and revenue.',
    icon: 'store',
  },
];

// Short labels used by the Library page filter pills.
export const segmentFilters: { id: Segment['id'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'students', label: 'Students & Job Seekers' },
  { id: 'women-home', label: 'Women' },
  { id: 'business', label: 'Business Owners' },
];

export const categoryFilters: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'tech', label: 'Tech' },
  { id: 'creative', label: 'Creative' },
  { id: 'marketing', label: 'Digital Marketing' },
  { id: 'business', label: 'Business' },
  { id: 'freelancing', label: 'Freelancing' },
];

export type Category = 'tech' | 'creative' | 'marketing' | 'business' | 'freelancing';

export type Step = {
  id: string;
  step: number;
  label: string;
  title: string;
  detail: string;
  icon: 'radio' | 'compass' | 'users' | 'graduation-cap';
};

export const steps: Step[] = [
  {
    id: 'reach',
    step: 1,
    label: 'Reach',
    title: 'We meet you where you are',
    detail: 'Free assessments, WhatsApp nudges, and local awareness drives bring career guidance to people who never had access to a counselor.',
    icon: 'radio',
  },
  {
    id: 'guide',
    step: 2,
    label: 'Guide',
    title: 'A real plan, not a sales pitch',
    detail: 'Your assessment maps to 2–3 career tracks that fit your time, budget, and goals — guidance first, training later.',
    icon: 'compass',
  },
  {
    id: 'community',
    step: 3,
    label: 'Community',
    title: 'Learn with people like you',
    detail: 'Women-only cohorts, peer study circles, and mentor check-ins keep you accountable without feeling alone.',
    icon: 'users',
  },
  {
    id: 'training',
    step: 4,
    label: 'Training',
    title: 'Only when you are ready',
    detail: 'Once your path is clear, we connect you to the right short courses and internships — never the other way around.',
    icon: 'graduation-cap',
  },
];

export type Track = {
  id: string;
  title: string;
  category: Category;
  categoryLabel: string;
  payRange: string;
  timeToIncome: string;
  duration: string;
  level: string;
  thumbnail: string;
  description: string;
  suitableFor: string[];
  segment: Segment['id'];
  featured?: boolean;
};

export const tracks: Track[] = [
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development',
    category: 'tech',
    categoryLabel: 'Tech',
    payRange: 'Rs 30k–80k/month',
    timeToIncome: '4–6 months',
    duration: '16 weeks',
    level: 'Beginner friendly',
    thumbnail: 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Build websites and web apps end to end — from HTML and CSS to React and a simple backend. High demand, remote-friendly, and beginner friendly if you are patient.',
    suitableFor: ['Students & Job Seekers', 'Remote work'],
    segment: 'students',
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    category: 'tech',
    categoryLabel: 'Tech',
    payRange: 'Rs 35k–90k/month',
    timeToIncome: '5–7 months',
    duration: '14 weeks',
    level: 'Some math helpful',
    thumbnail: 'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Turn spreadsheets and dashboards into decisions. Learn Excel, SQL, and a bit of Python to land analyst roles across industries.',
    suitableFor: ['Students & Job Seekers', 'Career switchers'],
    segment: 'students',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing & SEO',
    category: 'marketing',
    categoryLabel: 'Digital Marketing',
    payRange: 'Rs 25k–70k/month',
    timeToIncome: '3–5 months',
    duration: '10 weeks',
    level: 'No coding needed',
    thumbnail: 'https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Get found on Google and grow on social. Learn SEO, ads, and content marketing — skills that help you get hired or grow your own business.',
    suitableFor: ['Business Owners', 'Freelancers', 'Job Seekers'],
    segment: 'business',
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    category: 'marketing',
    categoryLabel: 'Digital Marketing',
    payRange: 'Rs 20k–55k/month',
    timeToIncome: '2–4 months',
    duration: '8 weeks',
    level: 'Phone-first',
    thumbnail: 'https://images.pexels.com/photos/15406294/pexels-photo-15406294.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Run Instagram, Facebook, and WhatsApp for small brands. Perfect for learning from home and taking on 2–3 clients at a time.',
    suitableFor: ['Women learning from home', 'Freelancers'],
    segment: 'women-home',
  },
  {
    id: 'graphic-design',
    title: 'Graphic & Brand Design',
    category: 'creative',
    categoryLabel: 'Creative',
    payRange: 'Rs 22k–60k/month',
    timeToIncome: '3–5 months',
    duration: '8 weeks',
    level: 'Creative track',
    thumbnail: 'https://images.pexels.com/photos/20456575/pexels-photo-20456575.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Design logos, social posts, and brand kits in Canva and Figma. Great for freelancing from home with a portfolio of just 5–6 pieces.',
    suitableFor: ['Women learning from home', 'Freelancers', 'Creatives'],
    segment: 'women-home',
  },
  {
    id: 'beauty-pro',
    title: 'Beauty & Salon Professional',
    category: 'creative',
    categoryLabel: 'Creative',
    payRange: 'Rs 18k–45k/month',
    timeToIncome: '2–3 months',
    duration: '6 weeks',
    level: 'Women-only batch',
    thumbnail: 'https://images.pexels.com/photos/5732998/pexels-photo-5732998.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Offer salon and bridal services from home or on call. Short training, quick income, and a women-only batch that feels safe to learn in.',
    suitableFor: ['Women learning from home', 'Quick income'],
    segment: 'women-home',
  },
  {
    id: 'freelance-writing',
    title: 'Freelance Content Writing',
    category: 'freelancing',
    categoryLabel: 'Freelancing',
    payRange: 'Rs 15k–50k/month',
    timeToIncome: '2–4 months',
    duration: '6 weeks',
    level: 'English helpful',
    thumbnail: 'https://images.pexels.com/photos/5827785/pexels-photo-5827785.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Write blogs, product pages, and social captions for businesses. Start with one client, grow to a steady monthly retainer from home.',
    suitableFor: ['Women learning from home', 'Freelancers', 'Side income'],
    segment: 'women-home',
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping & GST Filing',
    category: 'business',
    categoryLabel: 'Business',
    payRange: 'Rs 20k–55k/month',
    timeToIncome: '3–4 months',
    duration: '8 weeks',
    level: 'Detail oriented',
    thumbnail: 'https://images.pexels.com/photos/8297225/pexels-photo-8297225.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Keep accounts clean and file GST for small shops. A steady, in-demand skill you can offer as a service to multiple local businesses.',
    suitableFor: ['Business Owners', 'Freelancers', 'Side income'],
    segment: 'business',
  },
];

// The single track highlighted as the featured explainer.
export const featuredTrackId = 'web-dev';

export type Myth = {
  id: string;
  myth: string;
  truth: string;
};

export const myths: Myth[] = [
  {
    id: 'm1',
    myth: '“I need a degree to earn in tech.”',
    truth: 'Most entry web and data roles care about your portfolio and a single project, not your degree.',
  },
  {
    id: 'm2',
    myth: '“Freelancing is unstable and scary.”',
    truth: 'One steady retainer client covers your basics. Most freelancers add a second only after that.',
  },
  {
    id: 'm3',
    myth: '“It is too late to switch careers.”',
    truth: 'Our learners’ average age is 29. Short courses and a clear plan make switching realistic in months, not years.',
  },
  {
    id: 'm4',
    myth: '“Women-only batches are lower quality.”',
    truth: 'Same curriculum, same mentors — just a safer space to ask questions and learn at your pace.',
  },
];

export type Webinar = {
  id: string;
  title: string;
  date: string;
  time: string;
  segmentTag: string;
  speaker: string;
  category?: Category;
};

export const webinars: Webinar[] = [
  {
    id: 'wb-1',
    title: 'Which tech career is right for you?',
    date: 'Aug 7',
    time: '5:00 PM IST',
    segmentTag: 'Students & Job Seekers',
    speaker: 'Anjali Mehta, Career Coach',
    category: 'tech',
  },
  {
    id: 'wb-2',
    title: 'Earn from home: freelance skills that pay',
    date: 'Aug 10',
    time: '11:00 AM IST',
    segmentTag: 'Women Learning From Home',
    speaker: 'Priya Nair, Freelance Mentor',
    category: 'freelancing',
  },
  {
    id: 'wb-3',
    title: 'Get more customers with digital marketing',
    date: 'Aug 14',
    time: '6:30 PM IST',
    segmentTag: 'Small Business Owners',
    speaker: 'Rahul Verma, Marketing Consultant',
    category: 'marketing',
  },
  {
    id: 'wb-4',
    title: 'Design your first brand kit in Canva',
    date: 'Aug 18',
    time: '4:00 PM IST',
    segmentTag: 'Women Learning From Home',
    speaker: 'Sneha Rao, Brand Designer',
    category: 'creative',
  },
];

export type Story = {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  outcome: string;
  avatar: string;
};

export const stories: Story[] = [
  {
    id: 's-1',
    name: 'Sana Khan',
    role: 'Junior Web Developer',
    location: 'Hyderabad',
    quote:
      'I almost paid for a course I would have hated. The assessment showed me I fit web development instead — best detour of my life.',
    outcome: 'Hired within 3 months of finishing training',
    avatar: 'https://images.pexels.com/photos/36763595/pexels-photo-36763595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 's-2',
    name: 'Meera Joshi',
    role: 'Home-based Freelance Designer',
    location: 'Pune',
    quote:
      'The women-only sessions let me ask anything without feeling judged. I went from zero to my first paying client in 8 weeks.',
    outcome: '5 repeat clients in her first year',
    avatar: 'https://images.pexels.com/photos/6768479/pexels-photo-6768479.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 's-3',
    name: 'Imran Sheikh',
    role: 'Bakery Owner',
    location: 'Lucknow',
    quote:
      'I did not need another app. I needed to know which skill would actually grow my shop. The plan pointed me to digital marketing.',
    outcome: 'Online orders up 3x after one course',
    avatar: 'https://images.pexels.com/photos/12871449/pexels-photo-12871449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export type Stat = {
  id: string;
  value: string;
  label: string;
};

export const stats: Stat[] = [
  { id: 'cities', value: '24', label: 'Active cities' },
  { id: 'members', value: '18,000+', label: 'Members guided' },
  { id: 'webinars', value: '320', label: 'Webinars delivered' },
];

// Every editable heading/eyebrow/subtext on the Home, About Us,
// Career Explainer (Library), and Success Stories pages. Editable
// from the admin panel's "Page Headings" tab.
export const pageHeadings = {
  id: 'page-headings',

  // Home page
  home_segments_eyebrow: 'Who is this for',
  home_segments_heading: 'We built this for three kinds of people',
  home_segments_subtext: 'Pick the one that sounds like you. Your plan changes based on your answer.',
  home_how_eyebrow: 'How it works',
  home_how_heading: 'A simple funnel, not a maze',
  home_how_subtext: 'Four steps that take you from "I am confused" to "I know exactly what to do next."',
  home_tracks_eyebrow: 'Career explainer library',
  home_tracks_heading: 'See the career before you commit',
  home_tracks_subtext: 'Short video explainers cover pay, time, and entry level for each track — no jargon.',
  home_webinars_eyebrow: 'Upcoming live sessions',
  home_webinars_heading: 'Webinars & seminars',
  home_webinars_subtext: 'Free, live, and led by people who actually work in the field. Pick one and save your seat.',
  home_stories_eyebrow: 'Success stories',
  home_stories_heading: 'Real people, real outcomes',
  home_stories_subtext: 'They were confused too. Then they took the assessment and made a plan.',
  home_trust_heading: 'A safe space for women learning from home',

  // About Us page
  about_hero_badge: 'About us',
  about_hero_heading: 'How Skill & Career works',
  about_why_eyebrow: 'Why we exist',
  about_why_heading: 'Guidance was scattered. We made it one place.',
  about_funnel_eyebrow: 'The funnel',
  about_funnel_heading: 'Four steps, one clear journey',
  about_segments_eyebrow: 'Our segments',
  about_segments_heading: 'A tailored approach for each',
  about_mentors_eyebrow: 'Mentors & coordinators',
  about_mentors_heading: 'Real people behind the guidance',
  about_values_eyebrow: 'Our values',
  about_values_heading: 'What we will not compromise on',
  about_cta_heading: 'Ready to find your path?',
  about_mentor_1_name: 'Anjali Mehta',
  about_mentor_1_role: 'Lead Career Coach',
  about_mentor_1_desc: 'Runs our free assessments and one-to-one guidance calls.',
  about_mentor_1_photo:
    'https://images.pexels.com/photos/38707525/pexels-photo-38707525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  about_mentor_2_name: 'Priya Nair',
  about_mentor_2_role: 'Freelance Mentor',
  about_mentor_2_desc: 'Leads freelance skill sessions and interview prep.',
  about_mentor_2_photo:
    'https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  about_mentor_3_name: 'Rahul Verma',
  about_mentor_3_role: 'Marketing Consultant',
  about_mentor_3_desc: 'Guides small business owners on digital growth.',
  about_mentor_3_photo:
    'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  about_mentor_4_name: 'Sneha Rao',
  about_mentor_4_role: 'Brand Designer',
  about_mentor_4_desc: 'Teaches design basics and portfolio building for beginners.',
  about_mentor_4_photo:
    'https://images.pexels.com/photos/7752788/pexels-photo-7752788.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',

  // Career Explainer / Library page
  library_hero_badge: '45-second explainers',
  library_hero_heading: 'Career Explainer Library',
  library_all_heading: 'All skill tracks',
  library_myths_eyebrow: 'Myth-busting',
  library_myths_heading: 'Common fears, honestly answered',
  library_cta_heading: 'Not sure which skill fits you?',
  library_webinars_eyebrow: 'Related live sessions',

  // Success Stories page
  stories_hero_badge: 'Real outcomes',
  stories_hero_heading: 'Success Stories',
  stories_all_heading: 'All stories',
  stories_cta_heading: 'Want to see your story here?',
  stories_submit_eyebrow: 'Submit your story',
  stories_submit_heading: 'Are you a learner with an outcome?',
};

// Footer ke defaults — backend abhi tak content na de to yehi dikhega,
// aur admin panel ke "Footer Settings" ka pehla load bhi yahi se hoga.
export const footer = {
  id: 'footer',
  description:
    'Guidance first, training later. We help you choose the right career path with free assessments, honest explainers, and live mentor sessions.',
  email: 'hello@skillandcareer.in',
  phone: '+91 90000 12345',
  address: 'Hyderabad · Pune · Lucknow',
  social_facebook: '',
  social_instagram: '',
  social_linkedin: '',
  social_youtube: '',
  social_tiktok: '',
  copyright_text: 'Skill & Career. All rights reserved.',
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'Career Explainer Library', to: '/library' },
        { label: 'Take the Assessment', to: '/#assessment' },
        { label: 'Upcoming Webinars', to: '/#webinars' },
        { label: 'Success Stories', to: '/stories' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'How It Works', to: '/#about' },
        { label: 'Career Tracks', to: '/#tracks' },
        { label: 'Success Stories', to: '/stories' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Take Assessment', to: '/#assessment' },
        { label: 'Women-only Sessions', to: '/#segments' },
      ],
    },
  ],
};
