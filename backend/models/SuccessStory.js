const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  name: String,
  city: String,
  segment: String,
  category: String,
  track_label: String,
  outcome: String,
  quote: String,
  photo_url: String,
  video_url: String,
  featured: { type: Boolean, default: false },
  approved_for_publish: { type: Boolean, default: false },
  submitter_email: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SuccessStory', successStorySchema);