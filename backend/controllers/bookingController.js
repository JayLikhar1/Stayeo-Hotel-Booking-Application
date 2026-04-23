const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { emitRevenueUpdate } = require('../utils/sseEmitter');
const { emitUserDashboard } = require('../utils/userSseEmitter');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      guestDetails,
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      return res.status(400).json({ success: false, message: 'Check-out must be after check-in.' });
    }

    // Get room price
    const room = hotel.rooms.find((r) => r.type === roomType);
    const pricePerNight = room ? room.price : hotel.price;

    // Check for duplicate booking
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      hotel: hotelId,
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      bookingStatus: { $nin: ['CANCELLED'] },
      paymentStatus: { $in: ['PENDING', 'SUCCESS'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this hotel during these dates.',
      });
    }

    const totalAmount = pricePerNight * nights;
    const taxes = Math.round(totalAmount * 0.18); // 18% GST
    const finalAmount = totalAmount + taxes;

    const booking = await Booking.create({
      user: req.user._id,
      hotel: hotelId,
      roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || { adults: 1, children: 0 },
      nights,
      pricePerNight,
      totalAmount,
      taxes,
      finalAmount,
      specialRequests,
      guestDetails: guestDetails || {
        name: req.user.name,
        email: req.user.email,
      },
    });

    await booking.populate('hotel', 'name thumbnail location');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (status) query.bookingStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate('hotel', 'name thumbnail location price rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel', 'name thumbnail location amenities checkInTime checkOutTime')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure user owns this booking or is admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    if (booking.bookingStatus === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking.' });
    }

    booking.bookingStatus = 'CANCELLED';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();
    await booking.save();

    // Broadcast real-time updates
    emitRevenueUpdate();
    emitUserDashboard(String(req.user._id));

    res.json({ success: true, message: 'Booking cancelled successfully!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.bookingStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate('hotel', 'name location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get advanced booking analytics (admin)
// @route   GET /api/bookings/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const thirtyDaysAgo    = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo     = new Date(now - 60 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo  = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    // ── Core counts ──────────────────────────────────────────────────
    const [
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      pendingBookings,
      thisMonthBookings,
      lastMonthBookings,
      last30Bookings,
      prev30Bookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'CONFIRMED' }),
      Booking.countDocuments({ bookingStatus: 'CANCELLED' }),
      Booking.countDocuments({ bookingStatus: 'COMPLETED' }),
      Booking.countDocuments({ bookingStatus: 'PENDING' }),
      Booking.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      Booking.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Booking.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    ]);

    // ── Revenue ──────────────────────────────────────────────────────
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' }, avgOrderValue: { $avg: '$finalAmount' } } },
    ]);
    const totalRevenue   = revenueAgg[0]?.total || 0;
    const avgOrderValue  = Math.round(revenueAgg[0]?.avgOrderValue || 0);

    const thisMonthRevAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS', createdAt: { $gte: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);
    const lastMonthRevAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);
    const thisMonthRevenue = thisMonthRevAgg[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevAgg[0]?.total || 0;
    const revenueGrowth = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;
    const bookingGrowth = prev30Bookings > 0
      ? Math.round(((last30Bookings - prev30Bookings) / prev30Bookings) * 100)
      : 0;

    // ── Monthly revenue — last 12 months ─────────────────────────────
    const monthlyRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS', createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$finalAmount' },
          bookings: { $sum: 1 },
          avgNights: { $avg: '$nights' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // ── Daily bookings — last 30 days ─────────────────────────────────
    const dailyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          bookings: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── Booking status distribution ───────────────────────────────────
    const statusDistribution = await Booking.aggregate([
      { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
    ]);

    // ── Payment method / status breakdown ────────────────────────────
    const paymentBreakdown = await Booking.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } },
    ]);

    // ── Room type popularity ──────────────────────────────────────────
    const roomTypeStats = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      {
        $group: {
          _id: '$roomType',
          bookings: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
          avgNights: { $avg: '$nights' },
        },
      },
      { $sort: { bookings: -1 } },
    ]);

    // ── Top cities by revenue ─────────────────────────────────────────
    const topCities = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      {
        $lookup: {
          from: 'hotels',
          localField: 'hotel',
          foreignField: '_id',
          as: 'hotelData',
        },
      },
      { $unwind: '$hotelData' },
      {
        $group: {
          _id: '$hotelData.location.city',
          revenue: { $sum: '$finalAmount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // ── Top hotels by revenue ─────────────────────────────────────────
    const topHotels = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      {
        $group: {
          _id: '$hotel',
          bookings: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
          avgRating: { $avg: '$nights' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
      { $lookup: { from: 'hotels', localField: '_id', foreignField: '_id', as: 'hotel' } },
      { $unwind: '$hotel' },
      {
        $project: {
          'hotel.name': 1,
          'hotel.location.city': 1,
          'hotel.category': 1,
          'hotel.rating': 1,
          'hotel.thumbnail': 1,
          bookings: 1,
          revenue: 1,
        },
      },
    ]);

    // ── Category revenue split ────────────────────────────────────────
    const categoryRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      {
        $lookup: {
          from: 'hotels',
          localField: 'hotel',
          foreignField: '_id',
          as: 'hotelData',
        },
      },
      { $unwind: '$hotelData' },
      {
        $group: {
          _id: '$hotelData.category',
          revenue: { $sum: '$finalAmount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // ── Average nights per booking ────────────────────────────────────
    const avgNightsAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, avg: { $avg: '$nights' } } },
    ]);
    const avgNights = Math.round((avgNightsAgg[0]?.avg || 0) * 10) / 10;

    // ── Cancellation rate ─────────────────────────────────────────────
    const cancellationRate = totalBookings > 0
      ? Math.round((cancelledBookings / totalBookings) * 100)
      : 0;

    // ── Occupancy trend (bookings per day of week) ────────────────────
    const bookingsByDayOfWeek = await Booking.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          bookings: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      analytics: {
        // Core KPIs
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        pendingBookings,
        totalRevenue,
        avgOrderValue,
        avgNights,
        cancellationRate,
        // Growth metrics
        thisMonthBookings,
        lastMonthBookings,
        thisMonthRevenue,
        lastMonthRevenue,
        revenueGrowth,
        bookingGrowth,
        last30Bookings,
        // Charts data
        monthlyRevenue,
        dailyBookings,
        statusDistribution,
        paymentBreakdown,
        roomTypeStats,
        topCities,
        topHotels,
        categoryRevenue,
        bookingsByDayOfWeek,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  getAnalytics,
};
