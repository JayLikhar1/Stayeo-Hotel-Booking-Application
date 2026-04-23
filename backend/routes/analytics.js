const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { addClient, removeClient, emitRevenueUpdate } = require('../utils/sseEmitter');

/**
 * @route   GET /api/analytics/stream
 * @desc    Server-Sent Events stream for real-time admin analytics
 * @access  Admin
 */
router.get('/stream', async (req, res) => {
  // ── Manual JWT auth (EventSource can't send headers, so token is in query) ──
  try {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');

    const token = req.query.token;
    if (!token) {
      res.status(401).end();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.role !== 'admin') {
      res.status(403).end();
      return;
    }
  } catch {
    res.status(401).end();
    return;
  }

  // ── SSE headers ────────────────────────────────────────────────────
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // ── Register client ────────────────────────────────────────────────
  const clientId = addClient(res);

  // ── Send initial snapshot immediately ─────────────────────────────
  await emitRevenueUpdate();

  // ── Heartbeat every 30s ────────────────────────────────────────────
  const heartbeat = setInterval(() => {
    try {
      res.write(`event: heartbeat\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`);
    } catch {
      clearInterval(heartbeat);
    }
  }, 30000);

  // ── Cleanup on disconnect ──────────────────────────────────────────
  req.on('close', () => {
    clearInterval(heartbeat);
    removeClient(clientId);
  });
});

module.exports = router;
