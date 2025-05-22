const asyncHandler = require('express-async-handler');
const PaymentMethod = require('../models/PaymentMethod');
const { protect } = require('../middleware/auth');

// @desc    Get all payment methods
// @route   GET /api/payment-methods
// @access  Private
exports.getPaymentMethods = asyncHandler(async (req, res) => {
  const paymentMethods = await PaymentMethod.find({ user: req.user._id })
    .sort({ default: -1 })
    .populate('user', 'name');

  res.json(paymentMethods);
});

// @desc    Get single payment method
// @route   GET /api/payment-methods/:id
// @access  Private
exports.getPaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id)
    .populate('user', 'name');

  if (!paymentMethod) {
    throw new Error('Payment method not found');
  }

  // Check if payment method belongs to user
  if (paymentMethod.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to view this payment method');
  }

  res.json(paymentMethod);
});

// @desc    Add new payment method
// @route   POST /api/payment-methods
// @access  Private
exports.addPaymentMethod = asyncHandler(async (req, res) => {
  const { type, cardNumber, expiryDate, cvv, nameOnCard } = req.body;

  // Check if default payment method exists
  const hasDefault = await PaymentMethod.findOne({
    user: req.user._id,
    default: true,
  });

  // If creating new default payment method, remove old default
  if (req.body.default && hasDefault) {
    await PaymentMethod.findByIdAndUpdate(hasDefault._id, { default: false });
  }

  const paymentMethod = await PaymentMethod.create({
    user: req.user._id,
    type,
    cardNumber,
    expiryDate,
    cvv,
    nameOnCard,
    default: req.body.default || false,
  });

  res.status(201).json(paymentMethod);
});

// @desc    Update payment method
// @route   PUT /api/payment-methods/:id
// @access  Private
exports.updatePaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);

  if (!paymentMethod) {
    throw new Error('Payment method not found');
  }

  // Check if payment method belongs to user
  if (paymentMethod.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to update this payment method');
  }

  // If setting as default, remove old default
  if (req.body.default) {
    await PaymentMethod.updateMany(
      { user: req.user._id },
      { default: false }
    );
  }

  const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedPaymentMethod);
});

// @desc    Delete payment method
// @route   DELETE /api/payment-methods/:id
// @access  Private
exports.deletePaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);

  if (!paymentMethod) {
    throw new Error('Payment method not found');
  }

  // Check if payment method belongs to user
  if (paymentMethod.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to delete this payment method');
  }

  await paymentMethod.remove();
  res.json({ message: 'Payment method removed' });
});

// @desc    Set default payment method
// @route   PUT /api/payment-methods/:id/default
// @access  Private
exports.setDefaultPaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);

  if (!paymentMethod) {
    throw new Error('Payment method not found');
  }

  // Check if payment method belongs to user
  if (paymentMethod.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to update this payment method');
  }

  // Remove default status from all other payment methods
  await PaymentMethod.updateMany(
    { user: req.user._id },
    { default: false }
  );

  // Set this payment method as default
  const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
    req.params.id,
    { default: true },
    { new: true }
  );

  res.json(updatedPaymentMethod);
});
