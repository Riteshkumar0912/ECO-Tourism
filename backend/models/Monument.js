const mongoose = require('mongoose');

const alternativeSpotSchema = new mongoose.Schema({
  name: { type: String },
  category: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  incentiveDescription: { type: String },
  distanceKm: { type: Number }
}, { _id: false });

const monumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Monument name is required'],
      unique: true,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    category: {
      type: String,
      enum: ['Heritage', 'Religious', 'Beach', 'Nature', 'Museum', 'Adventure']
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max capacity is required']
    },
    currentCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['GREEN', 'YELLOW', 'RED'],
      default: 'GREEN'
    },
    ticketPrice: {
      adult: { type: Number },
      child: { type: Number },
      foreigner: { type: Number }
    },
    visitingHours: {
      open: { type: String },
      close: { type: String }
    },
    alternativeSpot: alternativeSpotSchema
  },
  {
    timestamps: true
  }
);

// Virtual: crowd load percentage
monumentSchema.virtual('crowdLoadPercent').get(function () {
  if (!this.maxCapacity) return 0;
  return Math.round((this.currentCount / this.maxCapacity) * 100);
});

monumentSchema.set('toJSON', { virtuals: true });
monumentSchema.set('toObject', { virtuals: true });

const Monument = mongoose.model('Monument', monumentSchema);

module.exports = Monument;
