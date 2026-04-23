const express = require('express');
const router  = express.Router();
const { addUserClient, removeUserClient, emitUserDashboard } = require('../utils/userSseEmitter');

/**
 * @route   GET /api/user-stream
 * @desc    SSE stream for real-time user dashboard updates
 * @access  Private (JWT via query param — EventSource limitation)
 *
 * Events emitted:
 *   dashboard_update  → full snapshot on connect + after every booking/payment change
 *   heartbeat         → every 30s to keep connection alive
 */
router.get('/', async (req, res) => {
  // ── Auth via query token ───────────────────────────────────────────
  let userId;
  try {
    const jwt  = require('jsonwebtoken');
    const User = require('../models/User');

    const token = req.query.token;
    if (!token) { res.status(401).end(); return; }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('_id isActive');
    if (!user || !user.isActive) { res.status(403).end(); return; }

    userId = String(user._id);
  } catch {
    res.status(401).end();
    return;
  }

  // ── SSE headers ────────────────────────────────────────────────────
  res.setHeader('Content-Type',      'text/event-stream');
  res.setHeader('Cache-Control',     'no-cache, no-transform');
  res.setHeader('Connection',        'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // ── Register this client ───────────────────────────────────────────
  const clientId = addUserClient(userId, res);

  // ── Push initial snapshot immediately ─────────────────────────────
  await emitUserDashboard(userId);

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
    removeUserClient(userId, clientId);
  });
});

module.exports = router;
