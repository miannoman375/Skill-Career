const express = require('express');
const router = express.Router();
const PageHeadings = require('../models/PageHeadings');

// GET /api/page-headings — hamesha ek hi document hota hai (singleton).
// Agar abhi tak koi document nahi bana to defaults ke sath khud bana lein.
router.get('/', async (req, res) => {
  try {
    let doc = await PageHeadings.findOne();
    if (!doc) {
      doc = await PageHeadings.create({});
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/page-headings — admin panel se save hone par yahi call hoga.
// upsert: true — agar document na mile to bana dein, warna update kar dein.
router.put('/', async (req, res) => {
  try {
    const doc = await PageHeadings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
