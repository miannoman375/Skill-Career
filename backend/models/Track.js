const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: String,
  category: String,
  category_label: String,
  pay_range: String,
  time_to_income: String,
  duration: String,
  level: String,
  thumbnail: String,
  video_url: String,
  description: String,
  suitable_for: [String],
  segment_id: String,
  featured: Boolean,
  sort_order: Number,
});

module.exports = mongoose.model('Track', trackSchema);