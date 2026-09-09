const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// GET /api/hero — hamesha ek hi document hota hai (singleton).
// Agar abhi tak koi document nahi bana to defaults ke sath khud bana lein.
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/hero — admin panel se save hone par yahi call hoga.
// upsert: true — agar document na mile to bana dein, warna update kar dein.
router.put('/', async (req, res) => {
  try {
    const hero = await Hero.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
