const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  addReview,
  getFeaturedHotels,
  getCities,
  getHotelStats,
} = require('../controllers/hotelController');

// Public routes
router.get('/featured', getFeaturedHotels);
router.get('/cities', getCities);
router.get('/stats', protect, adminOnly, getHotelStats);
router.get('/', getHotels);
router.get('/:id', getHotel);

// Protected routes
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.post('/', protect, adminOnly, createHotel);
router.put('/:id', protect, adminOnly, updateHotel);
router.delete('/:id', protect, adminOnly, deleteHotel);

module.exports = router;
