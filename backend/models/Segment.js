const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  label: String,
  blurb: String,
  icon: String,
  sort_order: Number,
});

module.exports = mongoose.model('Segment', segmentSchema);