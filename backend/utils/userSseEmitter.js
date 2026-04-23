/**
 * User-specific SSE Emitter
 * Each user gets their own SSE connection.
 * Broadcasts real-time dashboard updates to a specific user.
 */

// Map: userId (string) → Set of { clientId, res }
const userClients = new Map();
let clientIdCounter = 0;

// ── Register a client for a specific user ─────────────────────────────────────
const addUserClient = (userId, res) => {
  const id = ++clientIdCounter;
  if (!userClients.has(userId)) {
    userClients.set(userId, new Map());
  }
  userClients.get(userId).set(id, res);
  const total = [...userClients.values()].reduce((s, m) => s + m.size, 0);
  console.log(`[UserSSE] User ${userId} connected. Total user connections: ${total}`);
  return id;
};

// ── Remove a client ───────────────────────────────────────────────────────────
const removeUserClient = (userId, clientId) => {
  const clients = userClients.get(userId);
  if (clients) {
    clients.delete(clientId);
    if (clients.size === 0) userClients.delete(userId);
  }
};

// ── Send event to a specific user ─────────────────────────────────────────────
const sendToUser = (userId, eventName, data) => {
  const clients = userClients.get(String(userId));
  if (!clients || clients.size === 0) return;
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((res, id) => {
    try {
      res.write(payload);
    } catch {
      clients.delete(id);
    }
  });
};

// ── Build and push a full dashboard snapshot for a user ───────────────────────
const emitUserDashboard = async (userId) => {
  const clients = userClients.get(String(userId));
  if (!clients || clients.size === 0) return;

  try {
    const User    = require('../models/User');
    const Booking = require('../models/Booking');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const [user, bookings] = await Promise.all([
      User.findById(userId),
      Booking.find({ user: userId })
        .populate('hotel', 'name thumbnail location price rating category')
        .sort({ createdAt: -1 }),
    ]);

    if (!user) return;

    // ── Booking segments ──────────────────────────────────────────
    const upcoming  = bookings.filter(b => new Date(b.checkIn) > now && b.bookingStatus !== 'CANCELLED');
    // "paid" = any booking where payment was successful (includes future stays)
    const paid      = bookings.filter(b => b.paymentStatus === 'SUCCESS');
    // "past" = completed stays (checkout already happened)
    const past      = bookings.filter(b => new Date(b.checkOut) < now && b.paymentStatus === 'SUCCESS');
    const cancelled = bookings.filter(b => b.bookingStatus === 'CANCELLED');

    // ── Spending — based on ALL paid bookings ─────────────────────
    const totalSpent    = paid.reduce((s, b) => s + (b.finalAmount || 0), 0);
    const avgPerBooking = paid.length ? Math.round(totalSpent / paid.length) : 0;
    const citiesVisited = [...new Set(paid.map(b => b.hotel?.location?.city).filter(Boolean))];

    // Monthly spending (last 6 months) — all paid bookings
    const monthlySpending = {};
    paid
      .filter(b => new Date(b.createdAt) >= sixMonthsAgo)
      .forEach(b => {
        const d   = new Date(b.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlySpending[key] = (monthlySpending[key] || 0) + (b.finalAmount || 0);
      });

    // Category breakdown — all paid bookings
    const categorySpend = {};
    paid.forEach(b => {
      const cat = b.hotel?.category || 'Unknown';
      categorySpend[cat] = (categorySpend[cat] || 0) + (b.finalAmount || 0);
    });

    // This month spending
    const thisMonthSpent = paid
      .filter(b => new Date(b.createdAt) >= startOfMonth)
      .reduce((s, b) => s + (b.finalAmount || 0), 0);

    // Today spending
    const todaySpent = paid
      .filter(b => new Date(b.createdAt) >= startOfToday)
      .reduce((s, b) => s + (b.finalAmount || 0), 0);

    // ── Loyalty tier ──────────────────────────────────────────────
    const getTier = (pts) => {
      if (pts >= 15000) return 'Platinum';
      if (pts >= 5000)  return 'Gold';
      if (pts >= 1000)  return 'Silver';
      return 'Bronze';
    };
    const THRESHOLDS = { Bronze: 0, Silver: 1000, Gold: 5000, Platinum: 15000 };
    const tier     = getTier(user.loyaltyPoints);
    const nextTier = { Bronze: 'Silver', Silver: 'Gold', Gold: 'Platinum', Platinum: null }[tier];
    const nextThreshold = nextTier ? THRESHOLDS[nextTier] : THRESHOLDS['Platinum'];
    const progressPct   = nextTier
      ? Math.min(100, Math.round(((user.loyaltyPoints - THRESHOLDS[tier]) / (nextThreshold - THRESHOLDS[tier])) * 100))
      : 100;

    // ── Upcoming with countdown ───────────────────────────────────
    const upcomingWithCountdown = upcoming.slice(0, 3).map(b => ({
      ...b.toObject(),
      daysUntil: Math.ceil((new Date(b.checkIn) - now) / (1000 * 60 * 60 * 24)),
    }));

    sendToUser(userId, 'dashboard_update', {
      timestamp: now.toISOString(),

      // Booking counts
      totalBookings:    bookings.length,
      upcomingCount:    upcoming.length,
      completedCount:   past.length,
      paidCount:        paid.length,
      cancelledCount:   cancelled.length,
      upcomingBookings: upcomingWithCountdown,
      recentBookings:   bookings.slice(0, 5),

      // Spending — all paid bookings
      totalSpent,
      thisMonthSpent,
      todaySpent,
      avgPerBooking,
      citiesVisited,
      citiesCount:    citiesVisited.length,
      monthlySpending,
      categorySpend,

      // Loyalty
      loyaltyPoints:     user.loyaltyPoints,
      loyaltyTier:       tier,
      nextTier,
      nextThreshold,
      progressPct,
      totalPointsEarned: user.totalPointsEarned,
      pointsHistory:     (user.pointsHistory || []).slice(0, 10),

      // Wallet
      walletBalance:      user.walletBalance,
      walletTransactions: (user.walletTransactions || []).slice(0, 10),

      // Saved methods & docs
      savedPaymentMethods: user.savedPaymentMethods || [],
      travelDocuments:     user.travelDocuments || [],
      preferences:         user.preferences || {},
      referralCode:        user.referralCode || '',
      referralCount:       user.referralCount || 0,
    });
  } catch (err) {
    console.error('[UserSSE] emitUserDashboard error:', err.message);
  }
};

module.exports = { addUserClient, removeUserClient, sendToUser, emitUserDashboard };
