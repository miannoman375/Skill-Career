const mongoose = require('mongoose');

const pageHeadingsSchema = new mongoose.Schema({
  // Home page
  home_segments_eyebrow: { type: String, default: 'Who is this for' },
  home_segments_heading: { type: String, default: 'We built this for three kinds of people' },
  home_segments_subtext: {
    type: String,
    default: 'Pick the one that sounds like you. Your plan changes based on your answer.',
  },
  home_how_eyebrow: { type: String, default: 'How it works' },
  home_how_heading: { type: String, default: 'A simple funnel, not a maze' },
  home_how_subtext: {
    type: String,
    default: 'Four steps that take you from "I am confused" to "I know exactly what to do next."',
  },
  home_tracks_eyebrow: { type: String, default: 'Career explainer library' },
  home_tracks_heading: { type: String, default: 'See the career before you commit' },
  home_tracks_subtext: {
    type: String,
    default: 'Short video explainers cover pay, time, and entry level for each track — no jargon.',
  },
  home_webinars_eyebrow: { type: String, default: 'Upcoming live sessions' },
  home_webinars_heading: { type: String, default: 'Webinars & seminars' },
  home_webinars_subtext: {
    type: String,
    default: 'Free, live, and led by people who actually work in the field. Pick one and save your seat.',
  },
  home_stories_eyebrow: { type: String, default: 'Success stories' },
  home_stories_heading: { type: String, default: 'Real people, real outcomes' },
  home_stories_subtext: {
    type: String,
    default: 'They were confused too. Then they took the assessment and made a plan.',
  },
  home_trust_heading: { type: String, default: 'A safe space for women learning from home' },

  // About Us page
  about_hero_badge: { type: String, default: 'About us' },
  about_hero_heading: { type: String, default: 'How Skill & Career works' },
  about_why_eyebrow: { type: String, default: 'Why we exist' },
  about_why_heading: { type: String, default: 'Guidance was scattered. We made it one place.' },
  about_funnel_eyebrow: { type: String, default: 'The funnel' },
  about_funnel_heading: { type: String, default: 'Four steps, one clear journey' },
  about_segments_eyebrow: { type: String, default: 'Our segments' },
  about_segments_heading: { type: String, default: 'A tailored approach for each' },
  about_mentors_eyebrow: { type: String, default: 'Mentors & coordinators' },
  about_mentors_heading: { type: String, default: 'Real people behind the guidance' },
  about_values_eyebrow: { type: String, default: 'Our values' },
  about_values_heading: { type: String, default: 'What we will not compromise on' },
  about_cta_heading: { type: String, default: 'Ready to find your path?' },

  // Career Explainer / Library page
  library_hero_badge: { type: String, default: '45-second explainers' },
  library_hero_heading: { type: String, default: 'Career Explainer Library' },
  library_all_heading: { type: String, default: 'All skill tracks' },
  library_myths_eyebrow: { type: String, default: 'Myth-busting' },
  library_myths_heading: { type: String, default: 'Common fears, honestly answered' },
  library_cta_heading: { type: String, default: 'Not sure which skill fits you?' },
  library_webinars_eyebrow: { type: String, default: 'Related live sessions' },

  // Success Stories page
  stories_hero_badge: { type: String, default: 'Real outcomes' },
  stories_hero_heading: { type: String, default: 'Success Stories' },
  stories_all_heading: { type: String, default: 'All stories' },
  stories_cta_heading: { type: String, default: 'Want to see your story here?' },
  stories_submit_eyebrow: { type: String, default: 'Submit your story' },
  stories_submit_heading: { type: String, default: 'Are you a learner with an outcome?' },
});

module.exports = mongoose.model('PageHeadings', pageHeadingsSchema);
