const express = require('express');
const router = express.Router();
const SuccessStory = require('../models/SuccessStory');

// Public: get only approved stories
router.get('/', async (req, res) => {
  try {
    const items = await SuccessStory.find({ approved_for_publish: true }).sort({ created_at: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: submit a new story (goes into approval queue)
router.post('/', async (req, res) => {
  try {
    const item = new SuccessStory({ ...req.body, approved_for_publish: false, featured: false });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get ALL stories (approved + pending), pending first
router.get('/admin', async (req, res) => {
  try {
    const items = await SuccessStory.find().sort({ created_at: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update a story (edit fields / approve / set featured)
router.put('/:id', async (req, res) => {
  try {
    const item = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Story not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete a story
router.delete('/:id', async (req, res) => {
  try {
    const item = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Story not found' });
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;