const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftCardSchema = new Schema({
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
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
  },
  expiryDate: {
    type: Date,
  },
  restrictions: {
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    minPurchase: {
      type: Number,
      min: 0,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  redeemed: {
    type: Boolean,
    default: false,
  },
  redeemedAt: {
    type: Date,
  },
  redeemedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
giftCardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
giftCardSchema.index({ code: 1 });

// Generate unique code
giftCardSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Validate gift card
giftCardSchema.methods.isValid = function(userId, cartTotal) {
  // Check if active
  if (!this.active) return false;

  // Check expiry date
  if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
    return false;
  }

  // Check if redeemed
  if (this.redeemed) return false;

  // Check user restrictions
  if (this.restrictions?.users && !this.restrictions.users.includes(userId)) {
    return false;
  }

  // Check minimum purchase
  if (this.restrictions?.minPurchase && cartTotal < this.restrictions.minPurchase) {
    return false;
  }

  return true;
};

module.exports = mongoose.model('GiftCard', giftCardSchema);
