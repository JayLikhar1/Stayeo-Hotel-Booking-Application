const User    = require('../models/User');
const Booking = require('../models/Booking');
const Razorpay = require('razorpay');
const { emitUserDashboard } = require('../utils/userSseEmitter');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Loyalty tier thresholds ───────────────────────────────────────────────────
const TIER_THRESHOLDS = { Bronze: 0, Silver: 1000, Gold: 5000, Platinum: 15000 };
const POINTS_PER_RUPEE = 0.01; // 1 point per ₹100 spent

const getTier = (points) => {
  if (points >= 15000) return 'Platinum';
  if (points >= 5000)  return 'Gold';
  if (points >= 1000)  return 'Silver';
  return 'Bronze';
};

const getNextTier = (tier) => {
  const map = { Bronze: 'Silver', Silver: 'Gold', Gold: 'Platinum', Platinum: null };
  return map[tier];
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Get full user dashboard data
// @route GET /api/dashboard
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, bookings] = await Promise.all([
      User.findById(userId).populate('wishlist', 'name thumbnail location price rating'),
      Booking.find({ user: userId })
        .populate('hotel', 'name thumbnail location price rating category')
        .sort({ createdAt: -1 }),
    ]);

    const now = new Date();

    // ── Booking segments ──────────────────────────────────────────
    const upcoming  = bookings.filter(b => new Date(b.checkIn) > now && b.bookingStatus !== 'CANCELLED');
    // "paid" = any booking where payment was successful (includes future stays)
    const paid      = bookings.filter(b => b.paymentStatus === 'SUCCESS');
    // "past" = completed stays (checkout already happened)
    const past      = bookings.filter(b => new Date(b.checkOut) < now && b.paymentStatus === 'SUCCESS');
    const cancelled = bookings.filter(b => b.bookingStatus === 'CANCELLED');

    // ── Spending analytics — based on ALL paid bookings ───────────
    const totalSpent    = paid.reduce((s, b) => s + (b.finalAmount || 0), 0);
    const avgPerBooking = paid.length ? Math.round(totalSpent / paid.length) : 0;

    // Cities — include both past and upcoming paid bookings
    const citiesVisited = [...new Set(
      paid.map(b => b.hotel?.location?.city).filter(Boolean)
    )];

    // Monthly spending (last 6 months) — all paid bookings
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySpending = {};
    paid
      .filter(b => new Date(b.createdAt) >= sixMonthsAgo)
      .forEach(b => {
        const key = `${new Date(b.createdAt).getFullYear()}-${String(new Date(b.createdAt).getMonth() + 1).padStart(2, '0')}`;
        monthlySpending[key] = (monthlySpending[key] || 0) + (b.finalAmount || 0);
      });

    // Category breakdown — all paid bookings
    const categorySpend = {};
    paid.forEach(b => {
      const cat = b.hotel?.category || 'Unknown';
      categorySpend[cat] = (categorySpend[cat] || 0) + (b.finalAmount || 0);
    });

    // This month / today spending
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonthSpent = paid
      .filter(b => new Date(b.createdAt) >= startOfMonth)
      .reduce((s, b) => s + (b.finalAmount || 0), 0);
    const todaySpent = paid
      .filter(b => new Date(b.createdAt) >= startOfToday)
      .reduce((s, b) => s + (b.finalAmount || 0), 0);

    // ── Loyalty ───────────────────────────────────────────────────
    const tier     = getTier(user.loyaltyPoints);
    const nextTier = getNextTier(tier);
    const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : TIER_THRESHOLDS['Platinum'];
    const progressPct = nextTier
      ? Math.min(100, Math.round(((user.loyaltyPoints - TIER_THRESHOLDS[tier]) / (nextThreshold - TIER_THRESHOLDS[tier])) * 100))
      : 100;

    // ── Upcoming trips countdown ──────────────────────────────────
    const upcomingWithCountdown = upcoming.slice(0, 3).map(b => {
      const daysUntil = Math.ceil((new Date(b.checkIn) - now) / (1000 * 60 * 60 * 24));
      return { ...b.toObject(), daysUntil };
    });

    res.json({
      success: true,
      dashboard: {
        // Booking stats
        totalBookings:    bookings.length,
        upcomingCount:    upcoming.length,
        completedCount:   past.length,
        cancelledCount:   cancelled.length,
        paidCount:        paid.length,
        upcomingBookings: upcomingWithCountdown,
        recentBookings:   bookings.slice(0, 5),

        // Spending — based on ALL paid bookings
        totalSpent,
        thisMonthSpent,
        todaySpent,
        avgPerBooking,
        citiesVisited,
        citiesCount:    citiesVisited.length,
        monthlySpending,
        categorySpend,

        // Loyalty
        loyaltyPoints:    user.loyaltyPoints,
        loyaltyTier:      tier,
        nextTier,
        nextThreshold,
        progressPct,
        totalPointsEarned: user.totalPointsEarned,
        pointsHistory:    user.pointsHistory.slice(0, 10),

        // Wallet
        walletBalance:       user.walletBalance,
        walletTransactions:  user.walletTransactions.slice(0, 10),

        // Saved methods
        savedPaymentMethods: user.savedPaymentMethods,

        // Documents
        travelDocuments: user.travelDocuments,

        // Preferences
        preferences: user.preferences,

        // Referral
        referralCode:  user.referralCode,
        referralCount: user.referralCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Add money to wallet
// @route POST /api/dashboard/wallet/add
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const addToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum top-up is ₹100.' });
    }
    if (amount > 50000) {
      return res.status(400).json({ success: false, message: 'Maximum top-up is ₹50,000 per transaction.' });
    }

    const user = await User.findById(req.user._id);
    user.walletBalance += Number(amount);
    user.walletTransactions.unshift({
      amount:      Number(amount),
      type:        'CREDIT',
      description: `Wallet top-up of ₹${amount}`,
      status:      'SUCCESS',
    });
    await user.save();

    // Push real-time update
    emitUserDashboard(String(req.user._id));

    res.json({
      success: true,
      message: `₹${amount} added to wallet successfully!`,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Add / update saved payment method
// @route POST /api/dashboard/payment-methods
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const addPaymentMethod = async (req, res) => {
  try {
    const { type, label, last4, network, upiId, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (user.savedPaymentMethods.length >= 5) {
      return res.status(400).json({ success: false, message: 'Maximum 5 saved payment methods allowed.' });
    }

    if (isDefault) {
      user.savedPaymentMethods.forEach(m => { m.isDefault = false; });
    }

    user.savedPaymentMethods.push({ type, label, last4, network, upiId, isDefault: !!isDefault });
    await user.save();

    emitUserDashboard(String(req.user._id));
    res.json({ success: true, message: 'Payment method saved!', savedPaymentMethods: user.savedPaymentMethods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Delete saved payment method
// @route DELETE /api/dashboard/payment-methods/:id
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const deletePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedPaymentMethods = user.savedPaymentMethods.filter(
      m => m._id.toString() !== req.params.id
    );
    await user.save();
    emitUserDashboard(String(req.user._id));
    res.json({ success: true, message: 'Payment method removed.', savedPaymentMethods: user.savedPaymentMethods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Add travel document
// @route POST /api/dashboard/documents
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const addDocument = async (req, res) => {
  try {
    const { docType, docNumber, name, expiry, nationality } = req.body;
    if (!docType || !docNumber) {
      return res.status(400).json({ success: false, message: 'Document type and number are required.' });
    }

    const user = await User.findById(req.user._id);
    if (user.travelDocuments.length >= 10) {
      return res.status(400).json({ success: false, message: 'Maximum 10 documents allowed.' });
    }

    user.travelDocuments.push({ docType, docNumber, name, expiry, nationality });
    await user.save();

    emitUserDashboard(String(req.user._id));
    res.json({ success: true, message: 'Document saved securely!', travelDocuments: user.travelDocuments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Delete travel document
// @route DELETE /api/dashboard/documents/:id
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const deleteDocument = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.travelDocuments = user.travelDocuments.filter(
      d => d._id.toString() !== req.params.id
    );
    await user.save();
    emitUserDashboard(String(req.user._id));
    res.json({ success: true, message: 'Document removed.', travelDocuments: user.travelDocuments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Update preferences (currency, language, alerts)
// @route PUT /api/dashboard/preferences
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    emitUserDashboard(String(req.user._id));
    res.json({ success: true, message: 'Preferences updated!', preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Process automatic refund after cancellation
// @route POST /api/dashboard/refund/:bookingId
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const processRefund = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (booking.bookingStatus !== 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Only cancelled bookings can be refunded.' });
    }
    if (booking.paymentStatus !== 'SUCCESS') {
      return res.status(400).json({ success: false, message: 'No successful payment found for this booking.' });
    }
    if (booking.refundStatus === 'PROCESSED') {
      return res.status(400).json({ success: false, message: 'Refund already processed.' });
    }

    // Calculate refund amount based on cancellation timing
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
    let refundPct = 100;
    if (hoursUntilCheckIn < 0)  refundPct = 0;
    else if (hoursUntilCheckIn < 24) refundPct = 50;
    const refundAmount = Math.round((booking.finalAmount * refundPct) / 100);

    if (refundAmount === 0) {
      return res.status(400).json({ success: false, message: 'No refund applicable — check-in has already passed.' });
    }

    // Attempt Razorpay refund if payment ID exists
    let razorpayRefundId = '';
    if (booking.razorpay_payment_id) {
      try {
        const refund = await razorpay.payments.refund(booking.razorpay_payment_id, {
          amount: refundAmount * 100, // paise
          notes: { bookingId: booking._id.toString(), reason: 'Booking cancellation refund' },
        });
        razorpayRefundId = refund.id;
      } catch (rzpErr) {
        // Razorpay refund failed — credit to wallet instead
        const user = await User.findById(req.user._id);
        user.walletBalance += refundAmount;
        user.walletTransactions.unshift({
          amount:      refundAmount,
          type:        'REFUND',
          description: `Refund for booking #${booking._id.toString().slice(-6).toUpperCase()}`,
          bookingId:   booking._id,
          status:      'SUCCESS',
        });
        await user.save();
      }
    } else {
      // No payment ID — credit to wallet
      const user = await User.findById(req.user._id);
      user.walletBalance += refundAmount;
      user.walletTransactions.unshift({
        amount:      refundAmount,
        type:        'REFUND',
        description: `Refund for booking #${booking._id.toString().slice(-6).toUpperCase()}`,
        bookingId:   booking._id,
        status:      'SUCCESS',
      });
      await user.save();
    }

    booking.refundStatus       = 'PROCESSED';
    booking.refundAmount       = refundAmount;
    booking.refundedAt         = new Date();
    booking.razorpay_refund_id = razorpayRefundId;
    booking.paymentStatus      = 'REFUNDED';
    await booking.save();

    // Push real-time update to user
    emitUserDashboard(String(req.user._id));

    res.json({
      success: true,
      message: `Refund of ₹${refundAmount.toLocaleString('en-IN')} processed successfully!`,
      refundAmount,
      refundPct,
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Award loyalty points after confirmed booking
//        Called internally after payment verification
// ─────────────────────────────────────────────────────────────────────────────
const awardLoyaltyPoints = async (userId, booking) => {
  try {
    const points = Math.floor(booking.finalAmount * POINTS_PER_RUPEE);
    if (points <= 0) return;

    const user = await User.findById(userId);
    user.loyaltyPoints      += points;
    user.totalPointsEarned  += points;
    user.loyaltyTier         = getTier(user.loyaltyPoints);
    user.pointsHistory.unshift({
      points,
      type:        'EARNED',
      description: `Earned for booking at ${booking.hotel?.name || 'hotel'}`,
      bookingId:   booking._id,
    });
    await user.save();
    return points;
  } catch (err) {
    console.error('awardLoyaltyPoints error:', err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Redeem loyalty points (convert to wallet credit)
// @route POST /api/dashboard/loyalty/redeem
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const redeemPoints = async (req, res) => {
  try {
    const { points } = req.body;
    if (!points || points < 100) {
      return res.status(400).json({ success: false, message: 'Minimum redemption is 100 points.' });
    }

    const user = await User.findById(req.user._id);
    if (user.loyaltyPoints < points) {
      return res.status(400).json({ success: false, message: 'Insufficient loyalty points.' });
    }

    // 100 points = ₹10
    const cashValue = Math.floor(points / 100) * 10;

    user.loyaltyPoints  -= points;
    user.walletBalance  += cashValue;
    user.loyaltyTier     = getTier(user.loyaltyPoints);

    user.pointsHistory.unshift({
      points:      -points,
      type:        'REDEEMED',
      description: `Redeemed ${points} points for ₹${cashValue} wallet credit`,
    });
    user.walletTransactions.unshift({
      amount:      cashValue,
      type:        'CREDIT',
      description: `Loyalty points redemption (${points} pts)`,
      status:      'SUCCESS',
    });

    await user.save();

    // Push real-time update
    emitUserDashboard(String(req.user._id));

    res.json({
      success: true,
      message: `${points} points redeemed for ₹${cashValue} wallet credit!`,
      cashValue,
      loyaltyPoints:  user.loyaltyPoints,
      walletBalance:  user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Generate GST invoice for a booking
// @route GET /api/dashboard/invoice/:bookingId
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
const getInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('hotel', 'name location')
      .populate('user', 'name email phone');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const invoiceNumber = `INV-${booking._id.toString().slice(-8).toUpperCase()}`;
    const cgst = Math.round(booking.taxes / 2);
    const sgst = Math.round(booking.taxes / 2);

    res.json({
      success: true,
      invoice: {
        invoiceNumber,
        invoiceDate:    new Date().toISOString(),
        bookingId:      booking._id,
        hotel:          booking.hotel,
        guest:          booking.user,
        guestDetails:   booking.guestDetails,
        corporateDetails: booking.corporateDetails,
        isCorporate:    booking.isCorporate,
        checkIn:        booking.checkIn,
        checkOut:       booking.checkOut,
        nights:         booking.nights,
        roomType:       booking.roomType,
        pricePerNight:  booking.pricePerNight,
        subtotal:       booking.totalAmount,
        cgst,
        sgst,
        totalTax:       booking.taxes,
        totalAmount:    booking.finalAmount,
        paymentStatus:  booking.paymentStatus,
        paymentId:      booking.razorpay_payment_id,
        // StayEo company details
        company: {
          name:    'StayEo Technologies Pvt. Ltd.',
          gstin:   '29AABCS1234A1Z5',
          address: '4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru – 560103',
          email:   'billing@stayeo.com',
          phone:   '+91 1800-STAYEO',
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard,
  addToWallet,
  addPaymentMethod,
  deletePaymentMethod,
  addDocument,
  deleteDocument,
  updatePreferences,
  processRefund,
  awardLoyaltyPoints,
  redeemPoints,
  getInvoice,
};
