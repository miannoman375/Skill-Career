const mongoose = require('mongoose');

// Ek footer link (columns ke andar), jaise { label: 'About Us', to: '/about' }
const footerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    to: { type: String, default: '' },
  },
  { _id: false }
);

// Ek poora column, jaise { title: 'Company', links: [...] }
const footerColumnSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    links: { type: [footerLinkSchema], default: [] },
  },
  { _id: false }
);

const footerSchema = new mongoose.Schema({
  description: {
    type: String,
    default:
      'Guidance first, training later. We help you choose the right career path with free assessments, honest explainers, and live mentor sessions.',
  },
  email: { type: String, default: 'hello@skillandcareer.in' },
  phone: { type: String, default: '+91 90000 12345' },
  address: { type: String, default: 'Hyderabad · Pune · Lucknow' },

  social_facebook: { type: String, default: '' },
  social_instagram: { type: String, default: '' },
  social_linkedin: { type: String, default: '' },
  social_youtube: { type: String, default: '' },
  social_tiktok: { type: String, default: '' },

  copyright_text: {
    type: String,
    default: 'Skill & Career. All rights reserved.',
  },

  columns: {
    type: [footerColumnSchema],
    default: [
      {
        title: 'Explore',
        links: [
          { label: 'Career Explainer Library', to: '/library' },
          { label: 'Take the Assessment', to: '/signup' },
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
          { label: 'Take Assessment', to: '/signup' },
          { label: 'Log In', to: '/login' },
          { label: 'Sign Up', to: '/signup' },
          { label: 'Women-only Sessions', to: '/#segments' },
        ],
      },
    ],
  },
});

module.exports = mongoose.model('Footer', footerSchema);
