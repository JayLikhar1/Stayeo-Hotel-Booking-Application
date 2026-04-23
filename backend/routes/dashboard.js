const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboard,
  addToWallet,
  addPaymentMethod,
  deletePaymentMethod,
  addDocument,
  deleteDocument,
  updatePreferences,
  processRefund,
  redeemPoints,
  getInvoice,
} = require('../controllers/dashboardController');

router.get('/',                          protect, getDashboard);
router.post('/wallet/add',               protect, addToWallet);
router.post('/payment-methods',          protect, addPaymentMethod);
router.delete('/payment-methods/:id',    protect, deletePaymentMethod);
router.post('/documents',                protect, addDocument);
router.delete('/documents/:id',          protect, deleteDocument);
router.put('/preferences',               protect, updatePreferences);
router.post('/refund/:bookingId',        protect, processRefund);
router.post('/loyalty/redeem',           protect, redeemPoints);
router.get('/invoice/:bookingId',        protect, getInvoice);

module.exports = router;
