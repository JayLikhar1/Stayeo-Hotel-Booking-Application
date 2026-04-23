const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { sendEmail, bookingConfirmationEmail } = require('../utils/sendEmail');
const { emitRevenueUpdate, emitNewBooking } = require('../utils/sseEmitter');
const { emitUserDashboard } = require('../utils/userSseEmitter');
const { awardLoyaltyPoints } = require('./dashboardController');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('hotel', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (booking.paymentStatus === 'SUCCESS') {
      return res.status(400).json({ success: false, message: 'Booking is already paid.' });
    }

    // Amount in paise (multiply by 100)
    const amountInPaise = Math.round(booking.finalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        hotelName: booking.hotel.name,
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // Save order ID to booking
    booking.razorpay_order_id = order.id;
    await booking.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      booking: {
        _id: booking._id,
        finalAmount: booking.finalAmount,
        hotel: booking.hotel,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order.' });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details.' });
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      // Mark payment as failed
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'FAILED',
        bookingStatus: 'CANCELLED',
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }

    // Update booking with payment details
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'SUCCESS',
        bookingStatus: 'CONFIRMED',
        razorpay_payment_id,
        razorpay_signature,
      },
      { new: true }
    ).populate('hotel', 'name thumbnail location');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Send confirmation email (non-blocking)
    try {
      const hotel = await Hotel.findById(booking.hotel._id);
      const emailHtml = bookingConfirmationEmail(booking, hotel, req.user);
      sendEmail({
        to: req.user.email,
        subject: `Booking Confirmed - ${hotel.name} | StayEo`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    // 🔴 Broadcast real-time update to all connected admin dashboards
    try {
      const hotelForSSE = await Hotel.findById(booking.hotel._id).select('name location');
      emitNewBooking(booking, hotelForSSE);
      emitRevenueUpdate();
    } catch (sseError) {
      console.error('SSE emit error:', sseError.message);
    }

    // 🏆 Award loyalty points
    try {
      const populatedBooking = await Booking.findById(booking._id).populate('hotel', 'name');
      await awardLoyaltyPoints(req.user._id, populatedBooking);
    } catch (loyaltyErr) {
      console.error('Loyalty points error:', loyaltyErr.message);
    }

    // 📡 Push real-time dashboard update to this user
    try {
      emitUserDashboard(String(req.user._id));
    } catch (sseErr) {
      console.error('UserSSE emit error:', sseErr.message);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully! Booking confirmed.',
      booking,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
};

// @desc    Handle Razorpay webhook
// @route   POST /api/payments/webhook
// @access  Public (Razorpay webhook)
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      const signature = req.headers['x-razorpay-signature'];
      const body = JSON.stringify(req.body);

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
      }
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const orderId = payload.payment.entity.order_id;
      await Booking.findOneAndUpdate(
        { razorpay_order_id: orderId },
        { paymentStatus: 'SUCCESS', bookingStatus: 'CONFIRMED' }
      );
    }

    if (event === 'payment.failed') {
      const orderId = payload.payment.entity.order_id;
      await Booking.findOneAndUpdate(
        { razorpay_order_id: orderId },
        { paymentStatus: 'FAILED', bookingStatus: 'CANCELLED' }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed.' });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
const getPaymentDetails = async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment details.' });
  }
};

module.exports = { createOrder, verifyPayment, handleWebhook, getPaymentDetails };
