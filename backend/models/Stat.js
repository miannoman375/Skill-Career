const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  value: String,
  label: String,
  sort_order: Number,
});

module.exports = mongoose.model('Stat', statSchema);