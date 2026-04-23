/**
 * SSE (Server-Sent Events) Emitter
 * Manages all connected admin clients and broadcasts real-time analytics updates.
 */

const clients = new Map(); // clientId → res

let clientIdCounter = 0;

// ─── Register a new SSE client ────────────────────────────────────────────────
const addClient = (res) => {
  const id = ++clientIdCounter;
  clients.set(id, res);
  console.log(`[SSE] Client connected. Total: ${clients.size}`);
  return id;
};

// ─── Remove a disconnected client ────────────────────────────────────────────
const removeClient = (id) => {
  clients.delete(id);
  console.log(`[SSE] Client disconnected. Total: ${clients.size}`);
};

// ─── Broadcast an event to all connected admin clients ───────────────────────
const broadcast = (eventName, data) => {
  if (clients.size === 0) return;
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((res, id) => {
    try {
      res.write(payload);
    } catch {
      clients.delete(id);
    }
  });
};

// ─── Emit a revenue update event ─────────────────────────────────────────────
const emitRevenueUpdate = async () => {
  if (clients.size === 0) return;
  try {
    const Booking = require('../models/Booking');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalResult, monthResult, todayResult, counts] = await Promise.all([
      Booking.aggregate([
        { $match: { paymentStatus: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'SUCCESS', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'SUCCESS', createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } },
      ]),
      Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ bookingStatus: 'CONFIRMED' }),
        Booking.countDocuments({ bookingStatus: 'CANCELLED' }),
        Booking.countDocuments({ bookingStatus: 'PENDING' }),
      ]),
    ]);

    broadcast('revenue_update', {
      timestamp: now.toISOString(),
      totalRevenue:     totalResult[0]?.total  || 0,
      totalBookings:    totalResult[0]?.count  || 0,
      thisMonthRevenue: monthResult[0]?.total  || 0,
      thisMonthBookings:monthResult[0]?.count  || 0,
      todayRevenue:     todayResult[0]?.total  || 0,
      todayBookings:    todayResult[0]?.count  || 0,
      allBookings:      counts[0],
      confirmedBookings:counts[1],
      cancelledBookings:counts[2],
      pendingBookings:  counts[3],
    });
  } catch (err) {
    console.error('[SSE] emitRevenueUpdate error:', err.message);
  }
};

// ─── Emit a new booking event (toast-style notification) ─────────────────────
const emitNewBooking = (booking, hotel) => {
  broadcast('new_booking', {
    timestamp: new Date().toISOString(),
    bookingId: booking._id,
    hotelName: hotel?.name || 'Unknown Hotel',
    city:      hotel?.location?.city || '',
    amount:    booking.finalAmount,
    roomType:  booking.roomType,
    guestName: booking.guestDetails?.name || 'Guest',
  });
};

module.exports = { addClient, removeClient, broadcast, emitRevenueUpdate, emitNewBooking };
