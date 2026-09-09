const mongoose = require('mongoose');

const webinarSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  segment_tag: String,
  speaker: String,
  category: String,
  sort_order: Number,
});

module.exports = mongoose.model('Webinar', webinarSchema);