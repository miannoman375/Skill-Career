const express = require('express');
const router = express.Router();
const Track = require('../models/Track');

// Get all tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find().sort('sort_order');
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new track
router.post('/', async (req, res) => {
  try {
    const track = new Track(req.body);
    await track.save();
    res.json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update track
router.put('/:id', async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete track
router.delete('/:id', async (req, res) => {
  try {
    await Track.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;