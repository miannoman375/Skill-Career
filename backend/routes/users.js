const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users — list all users (e.g. for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;