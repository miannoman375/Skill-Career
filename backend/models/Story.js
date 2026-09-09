const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  name: String,
  role: String,
  location: String,
  quote: String,
  outcome: String,
  avatar: String,
  sort_order: Number,
});

module.exports = mongoose.model('Story', storySchema);