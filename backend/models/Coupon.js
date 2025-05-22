const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  maxUses: {
    type: Number,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  usedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  minPurchase: {
    type: Number,
    min: 0,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  active: {
    type: Boolean,
    default: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update updatedAt timestamp
couponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
couponSchema.index({ code: 1 });

// Calculate discount amount
couponSchema.methods.calculateDiscount = function(totalAmount) {
  if (this.type === 'percentage') {
    return (totalAmount * this.amount) / 100;
  }
  return this.amount;
};

// Check if coupon is valid
couponSchema.methods.isValid = function(userId, cartTotal) {
  // Check if active
  if (!this.active) return false;

  // Check expiry date
  if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
    return false;
  }

  // Check max uses
  if (this.maxUses && this.usedCount >= this.maxUses) {
    return false;
  }

  // Check if user has already used
  if (this.usedBy.includes(userId)) {
    return false;
  }

  // Check minimum purchase
  if (this.minPurchase && cartTotal < this.minPurchase) {
    return false;
  }

  return true;
};

module.exports = mongoose.model('Coupon', couponSchema);
