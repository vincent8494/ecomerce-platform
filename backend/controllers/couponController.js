const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');
const { protect, authorize } = require('../middleware/auth');

// @desc    Apply coupon to cart
// @route   POST /api/coupons/apply
// @access  Private
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  const coupon = await Coupon.findOne({
    code,
    active: true,
  });

  if (!coupon) {
    throw new Error('Invalid coupon code');
  }

  // Check if coupon has expired
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    throw new Error('Coupon has expired');
  }

  // Check if user has already used this coupon
  if (coupon.usedBy.includes(userId)) {
    throw new Error('Coupon already used');
  }

  // Check if coupon has reached maximum usage
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new Error('Coupon has reached maximum usage');
  }

  // Check if coupon is valid for user's cart
  // This would typically involve checking cart items against coupon restrictions
  // For now, we'll just return the discount amount
  
  const discount = {
    amount: coupon.amount,
    type: coupon.type,
    code: coupon.code,
  };

  res.json(discount);
});

// @desc    Validate coupon code
// @route   GET /api/coupons/validate/:code
// @access  Public
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const coupon = await Coupon.findOne({
    code,
    active: true,
  });

  if (!coupon) {
    throw new Error('Invalid coupon code');
  }

  // Check if coupon has expired
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    throw new Error('Coupon has expired');
  }

  res.json({
    valid: true,
    amount: coupon.amount,
    type: coupon.type,
    expiryDate: coupon.expiryDate,
  });
});

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private (Admin)
exports.createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    amount,
    type,
    expiryDate,
    maxUses,
    minPurchase,
    products,
    categories,
  } = req.body;

  const coupon = await Coupon.create({
    code,
    amount,
    type,
    expiryDate,
    maxUses,
    minPurchase,
    products,
    categories,
  });

  res.status(201).json(coupon);
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private (Admin)
exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find()
    .sort({ createdAt: -1 })
    .populate('products', 'name')
    .populate('categories', 'name');

  res.json(coupons);
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private (Admin)
exports.getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate('products', 'name')
    .populate('categories', 'name');

  if (!coupon) {
    throw new Error('Coupon not found');
  }

  res.json(coupon);
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private (Admin)
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!coupon) {
    throw new Error('Coupon not found');
  }

  res.json(coupon);
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new Error('Coupon not found');
  }

  await coupon.remove();
  res.json({ message: 'Coupon removed' });
});
