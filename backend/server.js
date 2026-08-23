require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./config/db');
const Monument = require('./models/Monument');
const Coupon = require('./models/Coupon');
const itineraryRoutes = require('./routes/itineraryRoutes');
const { registerSocketHandlers } = require('./sockets/socketHandler');
const { fetchLiveWeather, getPlacesForCity, getHotelsForCity } = require('./services/placesService');

// ─── APP INIT ────────────────────────────────────────────────────────────────

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://eco-tourism-three.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

const app = express();
const httpServer = createServer(app);

// ─── SOCKET.IO SETUP ─────────────────────────────────────────────────────────

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Attach io to every request for use inside route handlers
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// ─── DATABASE ─────────────────────────────────────────────────────────────────

connectDB();

// ─── REGISTER SOCKET.IO HANDLERS ─────────────────────────────────────────────

registerSocketHandlers(io);

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart Tourism API Running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    activeConnections: io.engine.clientsCount,
    features: ['monuments', 'coupons', 'itinerary-ai', 'real-time-crowd', 'hotels-live', 'weather-live']
  });
});

// ── GET /api/weather ────────────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Jaipur';
    const weatherData = await fetchLiveWeather(city);
    res.json({ success: true, data: weatherData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/places ─────────────────────────────────────────────────────────
app.get('/api/places', (req, res) => {
  try {
    const city = req.query.city || 'Jaipur';
    const places = getPlacesForCity(city);
    res.json({ success: true, city, data: places });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/hotels ─────────────────────────────────────────────────────────
app.get('/api/hotels', (req, res) => {
  try {
    const city = req.query.city || 'Jaipur';
    const maxPrice = Number(req.query.maxPrice) || 12000;
    const ecoOnly = req.query.ecoOnly === 'true';
    const lowCrowdOnly = req.query.lowCrowdOnly === 'true';
    const sort = req.query.sort || 'recommended';

    let hotels = getHotelsForCity(city, maxPrice, ecoOnly, lowCrowdOnly);

    if (sort === 'price_asc') {
      hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sort === 'rating_desc') {
      hotels.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      success: true,
      city,
      count: hotels.length,
      data: hotels
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/monuments ──────────────────────────────────────────────────────
app.get('/api/monuments', async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) {
      filter.city = { $regex: new RegExp(`^${req.query.city}$`, 'i') };
    }
    if (req.query.status) {
      filter.status = req.query.status.toUpperCase();
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const monuments = await Monument.find(filter).sort({ status: -1, currentCount: -1 });

    res.json({
      success: true,
      count: monuments.length,
      city: req.query.city || 'All Cities',
      data: monuments
    });
  } catch (error) {
    console.error('GET /api/monuments error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching monuments' });
  }
});

// ── GET /api/monuments/:id ──────────────────────────────────────────────────
app.get('/api/monuments/:id', async (req, res) => {
  try {
    const monument = await Monument.findById(req.params.id);
    if (!monument) {
      return res.status(404).json({ success: false, message: 'Monument not found' });
    }

    const relatedCoupon = await Coupon.findOne({
      city: monument.city,
      targetMonument: { $regex: new RegExp(monument.alternativeSpot?.name || '', 'i') },
      isActive: true
    });

    res.json({
      success: true,
      data: monument,
      relatedCoupon: relatedCoupon || null
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid monument ID format' });
    }
    console.error('GET /api/monuments/:id error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching monument' });
  }
});

// ── GET /api/coupons ─────────────────────────────────────────────────────────
app.get('/api/coupons', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.city) {
      filter.city = { $regex: new RegExp(`^${req.query.city}$`, 'i') };
    }
    if (req.query.monument) {
      filter.targetMonument = { $regex: new RegExp(req.query.monument, 'i') };
    }

    const coupons = await Coupon.find(filter).sort({ discountPercent: -1 });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    console.error('GET /api/coupons error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching coupons' });
  }
});

// ── POST /api/coupons/claim ──────────────────────────────────────────────────
app.post('/api/coupons/claim', async (req, res) => {
  try {
    const { code, touristName } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: `Coupon "${code.toUpperCase()}" not found or is no longer active.` });
    }

    if (coupon.expiryTime && new Date() > new Date(coupon.expiryTime)) {
      return res.status(410).json({ success: false, message: `Coupon "${coupon.code}" has expired.` });
    }

    const voucherId = uuidv4();
    const issuedAt  = new Date().toISOString();

    const qrPayload = {
      voucherId,
      code:            coupon.code,
      city:            coupon.city,
      targetMonument:  coupon.targetMonument,
      discountPercent: coupon.discountPercent,
      partnerPerk:     coupon.partnerPerk,
      businessName:    coupon.businessName,
      businessCategory:coupon.businessCategory,
      touristName:     touristName || 'Guest',
      issuedAt,
      expiresAt:       coupon.expiryTime ? coupon.expiryTime.toISOString() : null,
      qrData: JSON.stringify({
        v: voucherId,
        c: coupon.code,
        d: coupon.discountPercent,
        m: coupon.targetMonument,
        b: coupon.businessName,
        t: issuedAt
      })
    };

    req.io.emit('COUPON_CLAIMED', {
      code:           coupon.code,
      city:           coupon.city,
      targetMonument: coupon.targetMonument,
      voucherId,
      timestamp:      issuedAt
    });

    console.log(`🎟️  Coupon claimed — [${coupon.code}] by "${touristName || 'Guest'}" | Voucher: ${voucherId}`);

    return res.status(200).json({
      success: true,
      message: `✅ Coupon "${coupon.code}" successfully claimed! Show this QR at ${coupon.businessName}.`,
      voucher: qrPayload
    });

  } catch (error) {
    console.error('POST /api/coupons/claim error:', error.message);
    res.status(500).json({ success: false, message: 'Server error claiming coupon.' });
  }
});

// ── Itinerary Routes ─────────────────────────────────────────────────────────
app.use('/api/itinerary', itineraryRoutes);

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Smart Tourism API v2.0 — running on port ${PORT}`);
  console.log(`   Health     : http://localhost:${PORT}/api/health`);
  console.log(`   Monuments  : http://localhost:${PORT}/api/monuments`);
  console.log(`   Hotels     : http://localhost:${PORT}/api/hotels`);
  console.log(`   Weather    : http://localhost:${PORT}/api/weather`);
  console.log(`   Coupons    : http://localhost:${PORT}/api/coupons`);
  console.log(`   Itinerary  : http://localhost:${PORT}/api/itinerary/generate`);
  console.log(`   WebSocket  : ws://localhost:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

module.exports = { app, io };
