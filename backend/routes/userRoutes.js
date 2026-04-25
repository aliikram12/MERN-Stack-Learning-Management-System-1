const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  updateProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Private routes (any authenticated user)
router.put('/profile', protect, updateProfile);

module.exports = router;
