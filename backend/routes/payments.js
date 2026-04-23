const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPaymentDetails,
} = require('../controllers/paymentController');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook); // No auth - Razorpay calls this
router.get('/:paymentId', protect, getPaymentDetails);

module.exports = router;
