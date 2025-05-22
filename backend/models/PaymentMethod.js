const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'],
    required: true,
  },
  cardNumber: {
    type: String,
    required: function() {
      return this.type === 'credit_card' || this.type === 'debit_card';
    },
    validate: {
      validator: function(value) {
        // Basic card number validation
        const cardNumber = value.replace(/\s+/g, '');
        // Check length
        if (cardNumber.length < 13 || cardNumber.length > 16) return false;
        // Check if all digits
        if (!/^[0-9]+$/.test(cardNumber)) return false;
        // Check Luhn algorithm
        let sum = 0;
        let shouldDouble = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
          let digit = parseInt(cardNumber.charAt(i));
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
      },
      message: 'Invalid card number format',
    },
  },
  expiryDate: {
    type: String,
    required: function() {
      return this.type === 'credit_card' || this.type === 'debit_card';
    },
    validate: {
      validator: function(value) {
        // MM/YY format
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return false;
        
        // Check if date is in future
        const [month, year] = value.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (parseInt(year) < currentYear) return false;
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
        
        return true;
      },
      message: 'Invalid expiry date format (MM/YY) or date in past',
    },
  },
  cvv: {
    type: String,
    required: function() {
      return this.type === 'credit_card' || this.type === 'debit_card';
    },
    validate: {
      validator: function(value) {
        // CVV format validation
        if (!/^[0-9]{3,4}$/.test(value)) return false;
        
        // CVV length validation based on card type
        const cardNumber = this.cardNumber.replace(/\s+/g, '');
        const isAmericanExpress = /^3[47]/.test(cardNumber);
        if (isAmericanExpress && value.length !== 4) return false;
        if (!isAmericanExpress && value.length !== 3) return false;
        
        return true;
      },
      message: 'Invalid CVV format',
    },
  },
  nameOnCard: {
    type: String,
    required: function() {
      return this.type === 'credit_card' || this.type === 'debit_card';
    },
    trim: true,
    validate: {
      validator: function(value) {
        // Name validation
        return /^[a-zA-Z\s'-]+$/.test(value);
      },
      message: 'Invalid name format',
    },
  },
  default: {
    type: Boolean,
    default: false,
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

// Add card type detection
paymentMethodSchema.methods.getCardType = function() {
  const cardNumber = this.cardNumber.replace(/\s+/g, '');
  
  if (/^4/.test(cardNumber)) return 'Visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cardNumber)) return 'MasterCard';
  if (/^3[47]/.test(cardNumber)) return 'American Express';
  if (/^(36|38|30[0-5])/i.test(cardNumber)) return 'Diners Club';
  if (/^(6011|622126-622925|644-649|65)/.test(cardNumber)) return 'Discover';
  
  return 'Unknown';
};

// Add card number masking
paymentMethodSchema.methods.getMaskedCardNumber = function() {
  const cardNumber = this.cardNumber.replace(/\s+/g, '');
  const last4 = cardNumber.slice(-4);
  const masked = '•••• •••• •••• ' + last4;
  return masked;
};

// Add card expiration status
paymentMethodSchema.methods.isExpired = function() {
  const [month, year] = this.expiryDate.split('/');
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (parseInt(year) < currentYear) return true;
  if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return true;
  
  return false;
};

// Middleware to update updatedAt timestamp
paymentMethodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
paymentMethodSchema.index({ user: 1 });

// Validate card number using Luhn algorithm
paymentMethodSchema.methods.validateCardNumber = function() {
  if (!this.cardNumber) return true;

  const digits = this.cardNumber.split('').reverse();
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return sum % 10 === 0;
};

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
