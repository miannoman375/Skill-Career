export interface SegmentRow {
  id: string;
  label: string;
  blurb: string;
  icon: string;
  sort_order: number;
}

export interface TrackRow {
  id: string;
  title: string;
  category: string;
  category_label: string;
  pay_range: string;
  time_to_income: string;
  duration: string;
  level: string;
  thumbnail: string;
  video_url: string;   // 👈 YE NAYI LINE ADD KAREIN
  description: string;
  suitable_for: string[];
  segment_id: string | null;
  featured: boolean;
  sort_order: number;
}

export interface WebinarRow {
  id: string;
  title: string;
  date: string;
  time: string;
  segment_tag: string;
  speaker: string;
  category: string | null;
  sort_order: number;
}

export interface StoryRow {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  outcome: string;
  avatar: string;
  sort_order: number;
}

export interface StepRow {
  id: string;
  step: number;
  label: string;
  title: string;
  detail: string;
  icon: string;
  sort_order: number;
}

export interface StatRow {
  id: string;
  value: string;
  label: string;
  sort_order: number;
}

export interface MythRow {
  id: string;
  myth: string;
  truth: string;
  sort_order: number;
}

export interface HeroRow {
  id: string;
  eyebrow: string;
  headline: string;
  subtext: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  image_url: string;
  rating: number;
  learner_count_text: string;
}

// Flat collection of every section heading/eyebrow/subtext across the
// Home, About Us, Career Explainer (Library), and Success Stories pages.
// Kept as one object (like HeroRow) so it can be fetched with a single
// GET /page-headings and saved with a single PUT /page-headings.
export interface PageHeadingsRow {
  id: string;

  // Home page
  home_segments_eyebrow: string;
  home_segments_heading: string;
  home_segments_subtext: string;
  home_how_eyebrow: string;
  home_how_heading: string;
  home_how_subtext: string;
  home_tracks_eyebrow: string;
  home_tracks_heading: string;
  home_tracks_subtext: string;
  home_webinars_eyebrow: string;
  home_webinars_heading: string;
  home_webinars_subtext: string;
  home_stories_eyebrow: string;
  home_stories_heading: string;
  home_stories_subtext: string;
  home_trust_heading: string;

  // About Us page
  about_hero_badge: string;
  about_hero_heading: string;
  about_why_eyebrow: string;
  about_why_heading: string;
  about_funnel_eyebrow: string;
  about_funnel_heading: string;
  about_segments_eyebrow: string;
  about_segments_heading: string;
  about_mentors_eyebrow: string;
  about_mentors_heading: string;
  about_values_eyebrow: string;
  about_values_heading: string;
  about_cta_heading: string;
  about_mentor_1_name: string;
  about_mentor_1_role: string;
  about_mentor_1_desc: string;
  about_mentor_1_photo: string;
  about_mentor_2_name: string;
  about_mentor_2_role: string;
  about_mentor_2_desc: string;
  about_mentor_2_photo: string;
  about_mentor_3_name: string;
  about_mentor_3_role: string;
  about_mentor_3_desc: string;
  about_mentor_3_photo: string;
  about_mentor_4_name: string;
  about_mentor_4_role: string;
  about_mentor_4_desc: string;
  about_mentor_4_photo: string;

  // Career Explainer / Library page
  library_hero_badge: string;
  library_hero_heading: string;
  library_all_heading: string;
  library_myths_eyebrow: string;
  library_myths_heading: string;
  library_cta_heading: string;
  library_webinars_eyebrow: string;

  // Success Stories page
  stories_hero_badge: string;
  stories_hero_heading: string;
  stories_all_heading: string;
  stories_cta_heading: string;
  stories_submit_eyebrow: string;
  stories_submit_heading: string;
}

// Ek link jo footer ke kisi column ke andar dikhta hai.
export interface FooterLink {
  label: string;
  to: string;
}

// Footer ka ek poora column (title + uske links), jaise "Company".
export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Poora footer — contact info, social links, aur columns — sab admin
// panel ke "Footer Settings" section se edit hota hai.
export interface FooterRow {
  id: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  social_tiktok: string;
  copyright_text: string;
  columns: FooterColumn[];
}

export interface SiteContent {
  hero: HeroRow;
  segments: SegmentRow[];
  tracks: TrackRow[];
  webinars: WebinarRow[];
  stories: StoryRow[];
  steps: StepRow[];
  stats: StatRow[];
  myths: MythRow[];
  pageHeadings: PageHeadingsRow;
  footer: FooterRow;
}
