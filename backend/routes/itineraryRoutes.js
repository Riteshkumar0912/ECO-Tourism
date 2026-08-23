const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { generateSmartItinerary, generateRerouteReasoning, generateLocalInsights } = require('../config/gemini');
const Itinerary = require('../models/Itinerary');
const Coupon = require('../models/Coupon');
const Monument = require('../models/Monument');

// ─── POST /api/itinerary/generate ────────────────────────────────────────────
// Body: { destination, budget, days, interests }
router.post('/generate', async (req, res) => {
  try {
    const { destination, budget, days, interests } = req.body;

    // Validate required fields
    if (!destination || !budget || !days) {
      return res.status(400).json({
        success: false,
        message: 'destination, budget, and days are required fields.'
      });
    }

    const budgetNum = Number(budget);
    const daysNum = Number(days);

    if (isNaN(budgetNum) || budgetNum <= 0) {
      return res.status(400).json({ success: false, message: 'budget must be a positive number.' });
    }
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 14) {
      return res.status(400).json({ success: false, message: 'days must be between 1 and 14.' });
    }

    const interestsArr = Array.isArray(interests) ? interests : (interests ? [interests] : []);

    // Generate AI itinerary (Gemini or fallback)
    const aiResult = await generateSmartItinerary({
      destination,
      budget: budgetNum,
      days: daysNum,
      interests: interestsArr
    });

    // Map AI result to Mongoose schema shape
    const scheduleForDB = (aiResult.schedule || []).map(dayData => ({
      day: dayData.day,
      places: (dayData.places || []).map(p => ({
        placeName:     p.placeName,
        timeSlot:      p.timeSlot,
        estimatedCost: p.estimatedCost,
        crowdStatus:   p.crowdStatus || 'GREEN',
        isAlternative: p.isAlternative || false
      }))
    }));

    const itinerary = await Itinerary.create({
      destination,
      budget: budgetNum,
      days: daysNum,
      interests: interestsArr,
      schedule: scheduleForDB,
      isRerouted: false
    });

    // Merge full AI enriched result (with themes, tips, alerts) onto the response
    const responsePayload = {
      ...itinerary.toObject(),
      aiEnrichedSchedule: aiResult.schedule,
      cityOverview:       aiResult.cityOverview,
      crowdAlerts:        aiResult.crowdAlerts || [],
      budgetBreakdown:    aiResult.budgetBreakdown || {},
      totalEstimatedCost: aiResult.totalEstimatedCost || budgetNum,
      generatedBy:        aiResult.generatedBy
    };

    // Emit real-time notification to all connected clients
    req.io.emit('ITINERARY_GENERATED', {
      itineraryId: itinerary._id,
      destination,
      days: daysNum,
      crowdAlerts: aiResult.crowdAlerts || []
    });

    return res.status(201).json({ success: true, data: responsePayload });

  } catch (err) {
    console.error('POST /api/itinerary/generate error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to generate itinerary.', error: err.message });
  }
});

// ─── GET /api/itinerary/:id ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid itinerary ID.' });
    }

    const itinerary = await Itinerary.findById(req.params.id).populate('appliedCoupon');

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    return res.json({ success: true, data: itinerary });

  } catch (err) {
    console.error('GET /api/itinerary/:id error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch itinerary.' });
  }
});

// ─── POST /api/itinerary/:id/reroute ─────────────────────────────────────────
// Body: { crowdedMonumentName, alternativeMonumentName, couponCode }
router.post('/:id/reroute', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid itinerary ID.' });
    }

    const { crowdedMonumentName, alternativeMonumentName, couponCode } = req.body;

    if (!crowdedMonumentName || !alternativeMonumentName) {
      return res.status(400).json({ success: false, message: 'crowdedMonumentName and alternativeMonumentName are required.' });
    }

    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    // Look up the alternative monument for crowd status
    const altMonument = await Monument.findOne({
      name: { $regex: new RegExp(alternativeMonumentName, 'i') }
    });

    // Replace crowded monument with alternative in each day's places
    let reroutedCount = 0;
    itinerary.schedule = itinerary.schedule.map(day => {
      day.places = day.places.map(place => {
        if (place.placeName.toLowerCase().includes(crowdedMonumentName.toLowerCase())) {
          reroutedCount++;
          return {
            ...place.toObject(),
            placeName:     altMonument ? altMonument.name : alternativeMonumentName,
            crowdStatus:   altMonument ? altMonument.status : 'GREEN',
            isAlternative: true,
            timeSlot:      place.timeSlot
          };
        }
        return place;
      });
      return day;
    });

    itinerary.isRerouted = true;

    // Attach coupon if provided
    let appliedCouponDoc = null;
    if (couponCode) {
      appliedCouponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (appliedCouponDoc) {
        itinerary.appliedCoupon = appliedCouponDoc._id;
      }
    }

    await itinerary.save();

    const updatedItinerary = await Itinerary.findById(itinerary._id).populate('appliedCoupon');

    // Emit real-time reroute event to ALL connected clients
    req.io.emit('ITINERARY_REROUTED', {
      itineraryId:         itinerary._id.toString(),
      alternative:         alternativeMonumentName,
      crowded:             crowdedMonumentName,
      reroutedPlacesCount: reroutedCount,
      couponApplied:       appliedCouponDoc ? appliedCouponDoc.code : null,
      timestamp:           new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `Successfully rerouted ${reroutedCount} occurrence(s) of "${crowdedMonumentName}" to "${alternativeMonumentName}".`,
      data: updatedItinerary
    });

  } catch (err) {
    console.error('POST /api/itinerary/:id/reroute error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to reroute itinerary.' });
  }
});

// ─── POST /api/itinerary/reroute-explain ──────────────────────────────────────
router.post('/reroute-explain', async (req, res) => {
  try {
    const { originalSpot, alternateSpot, currentLoad, city } = req.body;
    if (!originalSpot || !alternateSpot) {
      return res.status(400).json({ success: false, message: 'originalSpot and alternateSpot are required.' });
    }

    const reasoning = await generateRerouteReasoning({ originalSpot, alternateSpot, currentLoad, city });
    return res.json({ success: true, data: reasoning });
  } catch (err) {
    console.error('POST /api/itinerary/reroute-explain error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to generate reroute explanation.' });
  }
});

// ─── GET /api/itinerary/insights ─────────────────────────────────────────────
router.get('/insights', async (req, res) => {
  try {
    const spotName = req.query.spotName || 'Amber Fort';
    const city = req.query.city || 'Jaipur';

    const insights = await generateLocalInsights({ spotName, city });
    return res.json({ success: true, data: insights });
  } catch (err) {
    console.error('GET /api/itinerary/insights error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to generate local insights.' });
  }
});

module.exports = router;
