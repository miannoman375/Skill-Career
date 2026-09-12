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

  // About Us page — mentor cards (name, role, desc, photo) admin se editable
  about_mentor_1_name: { type: String, default: 'Anjali Mehta' },
  about_mentor_1_role: { type: String, default: 'Lead Career Coach' },
  about_mentor_1_desc: {
    type: String,
    default: 'Runs our free assessments and one-to-one guidance calls.',
  },
  about_mentor_1_photo: {
    type: String,
    default:
      'https://images.pexels.com/photos/38707525/pexels-photo-38707525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  about_mentor_2_name: { type: String, default: 'Priya Nair' },
  about_mentor_2_role: { type: String, default: 'Freelance Mentor' },
  about_mentor_2_desc: {
    type: String,
    default: 'Leads freelance skill sessions and interview prep.',
  },
  about_mentor_2_photo: {
    type: String,
    default:
      'https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  about_mentor_3_name: { type: String, default: 'Rahul Verma' },
  about_mentor_3_role: { type: String, default: 'Marketing Consultant' },
  about_mentor_3_desc: {
    type: String,
    default: 'Guides small business owners on digital growth.',
  },
  about_mentor_3_photo: {
    type: String,
    default:
      'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  about_mentor_4_name: { type: String, default: 'Sneha Rao' },
  about_mentor_4_role: { type: String, default: 'Brand Designer' },
  about_mentor_4_desc: {
    type: String,
    default: 'Teaches design basics and portfolio building for beginners.',
  },
  about_mentor_4_photo: {
    type: String,
    default:
      'https://images.pexels.com/photos/7752788/pexels-photo-7752788.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },

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
