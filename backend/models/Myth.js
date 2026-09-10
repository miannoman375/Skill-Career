const mongoose = require('mongoose');

const mythSchema = new mongoose.Schema({
  myth: String,
  truth: String,
  sort_order: Number,
});

module.exports = mongoose.model('Myth', mythSchema);