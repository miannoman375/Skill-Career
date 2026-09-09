const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  eyebrow: { type: String, default: 'Guidance first, training later' },
  headline: { type: String, default: 'Choose a career path you will actually love.' },
  subtext: {
    type: String,
    default:
      'Not sure which skill to learn? Take our free assessment and get a clear, honest career plan before you spend a rupee on any course.',
  },
  primary_cta_text: { type: String, default: 'Take the free skill assessment' },
  primary_cta_link: { type: String, default: '/signup' },
  secondary_cta_text: { type: String, default: 'Browse career explainers' },
  secondary_cta_link: { type: String, default: '/library' },
  image_url: {
    type: String,
    default:
      'https://images.pexels.com/photos/7792836/pexels-photo-7792836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  rating: { type: Number, default: 4.8 },
  learner_count_text: { type: String, default: '2,400+ learners' },
});

module.exports = mongoose.model('Hero', heroSchema);
