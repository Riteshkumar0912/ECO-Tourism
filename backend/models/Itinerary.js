const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  placeName: { type: String },
  timeSlot: { type: String },
  estimatedCost: { type: Number },
  crowdStatus: { type: String },
  isAlternative: { type: Boolean, default: false }
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
  day: { type: Number },
  places: [placeSchema]
}, { _id: false });

const itinerarySchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: [true, 'Destination is required']
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required']
    },
    days: {
      type: Number,
      required: [true, 'Number of days is required']
    },
    interests: [{ type: String }],
    schedule: [dayScheduleSchema],
    isRerouted: {
      type: Boolean,
      default: false
    },
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    }
  },
  {
    timestamps: true
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
