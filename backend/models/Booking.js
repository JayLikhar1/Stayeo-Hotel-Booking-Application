const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    bookingStatus: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING'],
      default: 'PENDING',
    },
    razorpay_order_id: {
      type: String,
      default: '',
    },
    razorpay_payment_id: {
      type: String,
      default: '',
    },
    razorpay_signature: {
      type: String,
      default: '',
    },
    specialRequests: {
      type: String,
      default: '',
      maxlength: 500,
    },
    guestDetails: {
      name: String,
      email: String,
      phone: String,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
    },

    // ── Payment options ────────────────────────────────────────────
    paymentMode: {
      type: String,
      enum: ['FULL', 'PARTIAL', 'PAY_AT_HOTEL', 'WALLET', 'EMI'],
      default: 'FULL',
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    walletAmountUsed: {
      type: Number,
      default: 0,
    },
    emiMonths: {
      type: Number,
      default: 0,
    },
    emiMonthlyAmount: {
      type: Number,
      default: 0,
    },

    // ── Loyalty ────────────────────────────────────────────────────
    pointsEarned: {
      type: Number,
      default: 0,
    },
    pointsRedeemed: {
      type: Number,
      default: 0,
    },

    // ── Corporate billing ──────────────────────────────────────────
    isCorporate: {
      type: Boolean,
      default: false,
    },
    corporateDetails: {
      companyName: { type: String, default: '' },
      gstin:       { type: String, default: '' },
      address:     { type: String, default: '' },
      email:       { type: String, default: '' },
    },

    // ── Refund ─────────────────────────────────────────────────────
    refundStatus: {
      type: String,
      enum: ['NOT_APPLICABLE', 'PENDING', 'PROCESSED', 'FAILED'],
      default: 'NOT_APPLICABLE',
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundedAt: {
      type: Date,
    },
    razorpay_refund_id: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Validate check-out is after check-in
bookingSchema.pre('save', function (next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Index for efficient queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ hotel: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ razorpay_order_id: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
