const express = require('express');
const router = express.Router();
const Footer = require('../models/Footer');

// GET /api/footer — hamesha ek hi document hota hai (singleton).
// Agar abhi tak koi document nahi bana to defaults ke sath khud bana lein.
router.get('/', async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({});
    }
    res.json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/footer — admin panel ke "Footer Settings" se save hone par yahi call hoga.
// upsert: true — agar document na mile to bana dein, warna update kar dein.
router.put('/', async (req, res) => {
  try {
    const footer = await Footer.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    res.json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
