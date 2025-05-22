const Joi = require('joi');

// Validate request body
exports.validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }
    next();
  };
};

// Validate request params
exports.validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }
    next();
  };
};

// Validate request query
exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }
    next();
  };
};

// Common schemas
exports.schemas = {
  // User schemas
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,}$/),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Product schemas
  product: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    stock: Joi.number().min(0).required(),
    images: Joi.array().items(Joi.string().uri()),
  }),

  // Order schemas
  order: Joi.object({
    items: Joi.array().items(Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
    })).required(),
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    totalPrice: Joi.number().min(0).required(),
  }),

  // Review schemas
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(5).required(),
  }),

  // Address schemas
  address: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    address: Joi.string().min(10).required(),
    city: Joi.string().min(2).required(),
    state: Joi.string().min(2).required(),
    postalCode: Joi.string().pattern(/^[A-Za-z0-9- ]+$/).required(),
    country: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,}$/).required(),
  }),

  // Payment method schemas
  paymentMethod: Joi.object({
    type: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay').required(),
    cardNumber: Joi.string().pattern(/^[0-9]{13,16}$/),
    expiryDate: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
    cvv: Joi.string().pattern(/^[0-9]{3,4}$/),
    nameOnCard: Joi.string().min(2),
  }),

  // Coupon schemas
  coupon: Joi.object({
    code: Joi.string().min(3).max(20).required(),
    amount: Joi.number().min(0).required(),
    type: Joi.string().valid('percentage', 'fixed').required(),
    expiryDate: Joi.date(),
    maxUses: Joi.number().min(1),
    minPurchase: Joi.number().min(0),
    products: Joi.array().items(Joi.string()),
    categories: Joi.array().items(Joi.string()),
  }),

  // Gift card schemas
  giftCard: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD').required(),
    expiryDate: Joi.date(),
    restrictions: Joi.object({
      users: Joi.array().items(Joi.string()),
      products: Joi.array().items(Joi.string()),
      categories: Joi.array().items(Joi.string()),
      minPurchase: Joi.number().min(0),
    }),
  }),
};
