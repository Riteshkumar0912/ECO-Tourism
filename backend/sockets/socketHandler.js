const { v4: uuidv4 } = require('uuid');
const Monument = require('../models/Monument');
const Coupon = require('../models/Coupon');

/**
 * Recalculates monument status from crowd count.
 * <60% → GREEN | 60-85% → YELLOW | >85% → RED
 */
function calculateStatus(currentCount, maxCapacity) {
  if (!maxCapacity || maxCapacity === 0) return 'GREEN';
  const ratio = currentCount / maxCapacity;
  if (ratio > 0.85) return 'RED';
  if (ratio >= 0.60) return 'YELLOW';
  return 'GREEN';
}

/**
 * Registers all Socket.IO event handlers on the given io instance.
 * @param {import('socket.io').Server} io
 */
function registerSocketHandlers(io) {
  // Track active tourist sessions keyed by socket.id
  const activeSessions = new Map();

  io.on('connection', (socket) => {
    const sessionId = uuidv4();
    activeSessions.set(socket.id, { sessionId, connectedAt: new Date() });

    console.log(`⚡ [WS] Client connected   — socket: ${socket.id} | session: ${sessionId} | total: ${io.engine.clientsCount}`);

    // Broadcast updated client count
    io.emit('CLIENT_COUNT_UPDATE', { activeConnections: io.engine.clientsCount });

    // ── Event: UPDATE_CROWD_COUNT ──────────────────────────────────────────
    // Payload: { monumentName: string, newCount: number }
    socket.on('UPDATE_CROWD_COUNT', async ({ monumentName, newCount }) => {
      try {
        if (!monumentName || newCount == null || isNaN(Number(newCount))) {
          socket.emit('ERROR', { event: 'UPDATE_CROWD_COUNT', message: 'monumentName and newCount (number) are required.' });
          return;
        }

        const count = Math.max(0, Math.round(Number(newCount)));

        const monument = await Monument.findOne({ name: { $regex: new RegExp(`^${monumentName}$`, 'i') } });
        if (!monument) {
          socket.emit('ERROR', { event: 'UPDATE_CROWD_COUNT', message: `Monument "${monumentName}" not found.` });
          return;
        }

        const previousStatus = monument.status;
        const newStatus = calculateStatus(count, monument.maxCapacity);
        const loadPercent = Math.round((count / monument.maxCapacity) * 100);

        monument.currentCount = count;
        monument.status = newStatus;
        await monument.save();

        const updatedPayload = {
          monumentId:   monument._id,
          name:         monument.name,
          city:         monument.city,
          state:        monument.state,
          currentCount: count,
          maxCapacity:  monument.maxCapacity,
          status:       newStatus,
          loadPercent,
          previousStatus,
          statusChanged: previousStatus !== newStatus,
          timestamp:    new Date().toISOString()
        };

        // Broadcast status change to ALL connected clients
        io.emit('CROWD_STATUS_CHANGED', updatedPayload);
        console.log(`📊 [WS] Crowd updated — ${monument.name} [${monument.city}]: ${count}/${monument.maxCapacity} (${loadPercent}%) → ${newStatus}`);

        // ── Auto-trigger crowd alert if status becomes RED ─────────────────
        if (newStatus === 'RED') {
          let activeCoupon = null;

          if (monument.alternativeSpot?.name) {
            activeCoupon = await Coupon.findOne({
              targetMonument: { $regex: new RegExp(monument.alternativeSpot.name, 'i') },
              isActive: true
            }).sort({ discountPercent: -1 });
          }

          const alertPayload = {
            alertId:      uuidv4(),
            type:         'CROWD_OVERFLOW',
            severity:     'HIGH',
            message:      `🔴 ${monument.name} is at ${loadPercent}% capacity — diversions recommended.`,
            crowdedSpot: {
              name:         monument.name,
              city:         monument.city,
              currentCount: count,
              maxCapacity:  monument.maxCapacity,
              loadPercent
            },
            alternativeSpot:  monument.alternativeSpot || null,
            activeCoupon:     activeCoupon
              ? {
                  code:            activeCoupon.code,
                  discountPercent: activeCoupon.discountPercent,
                  partnerPerk:     activeCoupon.partnerPerk,
                  businessName:    activeCoupon.businessName
                }
              : null,
            timestamp: new Date().toISOString()
          };

          io.emit('TRIGGER_CROWD_ALERT', alertPayload);
          console.log(`🚨 [WS] TRIGGER_CROWD_ALERT broadcast — ${monument.name} → ${monument.alternativeSpot?.name || 'N/A'}`);
        }

      } catch (err) {
        console.error('[WS] UPDATE_CROWD_COUNT error:', err.message);
        socket.emit('ERROR', { event: 'UPDATE_CROWD_COUNT', message: 'Server error processing crowd update.' });
      }
    });

    // ── Event: BROADCAST_MANUAL_DIVERSION ──────────────────────────────────
    // Payload: { title, message, targetCity?, severity?, redirectUrl? }
    // Allows tourism authorities to push instant custom alert banners
    socket.on('BROADCAST_MANUAL_DIVERSION', ({ title, message, targetCity, severity, redirectUrl }) => {
      if (!title || !message) {
        socket.emit('ERROR', { event: 'BROADCAST_MANUAL_DIVERSION', message: 'title and message are required.' });
        return;
      }

      const diversionBanner = {
        bannerId:   uuidv4(),
        type:       'MANUAL_DIVERSION',
        severity:   severity || 'INFO',
        title,
        message,
        targetCity: targetCity || 'ALL',
        redirectUrl: redirectUrl || null,
        issuedBy:   socket.id,
        timestamp:  new Date().toISOString()
      };

      // Broadcast to ALL active tourist apps
      io.emit('MANUAL_DIVERSION_BANNER', diversionBanner);
      console.log(`📢 [WS] Manual diversion broadcast — "${title}" | City: ${targetCity || 'ALL'} | Severity: ${severity || 'INFO'}`);

      // Confirm back to sender
      socket.emit('DIVERSION_CONFIRMED', { bannerId: diversionBanner.bannerId, recipients: io.engine.clientsCount });
    });

    // ── Event: REDEEM_VOUCHER_AT_GATE ──────────────────────────────────────
    // Emitted by merchant / gate staff scanner when verifying tourist QR pass
    socket.on('REDEEM_VOUCHER_AT_GATE', (payload) => {
      const redemptionEvent = {
        voucherId:    payload?.voucherId || `V-${Date.now()}`,
        code:         (payload?.code || 'JAIGARH20').toUpperCase(),
        monumentName: payload?.monumentName || payload?.monument || 'Jaigarh Fort',
        businessName: payload?.businessName || payload?.business || 'Rajputana Heritage Dining',
        discount:     payload?.discount || payload?.discountPercent || 20,
        touristName:  payload?.touristName || 'Tourist',
        timestamp:    new Date().toISOString(),
        scannedBy:    socket.id,
      };
      io.emit('VOUCHER_REDEEMED_AT_GATE', redemptionEvent);
      console.log(`🎟️ [WS] VOUCHER_REDEEMED_AT_GATE broadcast — ${redemptionEvent.code} at ${redemptionEvent.monumentName}`);
    });

    // ── Event: JOIN_CITY_ROOM ──────────────────────────────────────────────
    // Allows clients to subscribe to city-specific events
    socket.on('JOIN_CITY_ROOM', (city) => {
      if (typeof city === 'string' && city.trim()) {
        const room = `city:${city.trim().toLowerCase()}`;
        socket.join(room);
        socket.emit('CITY_ROOM_JOINED', { room, city });
        console.log(`🏙️  [WS] Socket ${socket.id} joined room: ${room}`);
      }
    });

    // ── Disconnect ─────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      activeSessions.delete(socket.id);
      console.log(`🔌 [WS] Client disconnected — socket: ${socket.id} | reason: ${reason} | remaining: ${io.engine.clientsCount}`);
      io.emit('CLIENT_COUNT_UPDATE', { activeConnections: io.engine.clientsCount });
    });
  });

  console.log('✅ Socket.IO handlers registered and listening.');
}

module.exports = { registerSocketHandlers };
