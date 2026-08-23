const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      uppercase: true,
      unique: true,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true
    },
    targetMonument: {
      type: String,
      required: [true, 'Target monument is required']
    },
    discountPercent: {
      type: Number,
      required: [true, 'Discount percent is required']
    },
    partnerPerk: {
      type: String,
      required: [true, 'Partner perk description is required']
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required']
    },
    businessCategory: {
      type: String,
      enum: ['Cafe', 'Restaurant', 'Guide', 'Hotel', 'Souvenir', 'Transport']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiryTime: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
