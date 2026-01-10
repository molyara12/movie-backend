const express = require('express');
const router = express.Router();   // ✅ router define করতে হবে
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.json(await User.findById(req.user.id).select('-password'));
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, req.body);
  res.json({ message: 'Profile updated' });
});

// Delete profile
router.delete('/profile', auth, async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: 'Profile deleted' });
});

// Get all users (Admin Only)
router.get('/', auth, admin, async (req, res) => {
  res.json(await User.find().select('-password'));
});

// ✅ Check if user is Admin
router.get('/check-admin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      return res.json({ message: 'You are Admin', user });
    } else {
      return res.status(403).json({ message: 'Not an Admin' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
