const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  step: Number,
  label: String,
  title: String,
  detail: String,
  icon: String,
  sort_order: Number,
});

module.exports = mongoose.model('Step', stepSchema);