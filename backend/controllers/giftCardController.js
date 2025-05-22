const asyncHandler = require('express-async-handler');
const GiftCard = require('../models/GiftCard');
const { protect, authorize } = require('../middleware/auth');

// @desc    Redeem gift card
// @route   POST /api/gift-cards/redeem
// @access  Private
exports.redeemGiftCard = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  const giftCard = await GiftCard.findOne({
    code,
    active: true,
  });

  if (!giftCard) {
    throw new Error('Invalid gift card code');
  }

  // Check if gift card has expired
  if (giftCard.expiryDate && new Date(giftCard.expiryDate) < new Date()) {
    throw new Error('Gift card has expired');
  }

  // Check if gift card has been redeemed
  if (giftCard.redeemed) {
    throw new Error('Gift card already redeemed');
  }

  // Check if gift card is valid for user
  if (giftCard.restrictions?.users && !giftCard.restrictions.users.includes(userId)) {
    throw new Error('Gift card not valid for this user');
  }

  // Update gift card status
  await GiftCard.findByIdAndUpdate(
    giftCard._id,
    {
      redeemed: true,
      redeemedAt: new Date(),
      redeemedBy: userId,
    }
  );

  res.json({
    amount: giftCard.amount,
    currency: giftCard.currency,
    code: giftCard.code,
  });
});

// @desc    Validate gift card code
// @route   GET /api/gift-cards/validate/:code
// @access  Public
exports.validateGiftCard = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const giftCard = await GiftCard.findOne({
    code,
    active: true,
  });

  if (!giftCard) {
    throw new Error('Invalid gift card code');
  }

  // Check if gift card has expired
  if (giftCard.expiryDate && new Date(giftCard.expiryDate) < new Date()) {
    throw new Error('Gift card has expired');
  }

  res.json({
    valid: true,
    amount: giftCard.amount,
    currency: giftCard.currency,
    expiryDate: giftCard.expiryDate,
  });
});

// @desc    Create new gift card
// @route   POST /api/gift-cards
// @access  Private (Admin)
exports.createGiftCard = asyncHandler(async (req, res) => {
  const {
    amount,
    currency,
    expiryDate,
    restrictions,
    metadata,
  } = req.body;

  // Generate unique code
  const code = generateGiftCardCode();

  const giftCard = await GiftCard.create({
    code,
    amount,
    currency,
    expiryDate,
    restrictions,
    metadata,
  });

  res.status(201).json(giftCard);
});

// @desc    Get all gift cards
// @route   GET /api/gift-cards
// @access  Private (Admin)
exports.getGiftCards = asyncHandler(async (req, res) => {
  const giftCards = await GiftCard.find()
    .sort({ createdAt: -1 })
    .populate('redeemedBy', 'name');

  res.json(giftCards);
});

// @desc    Get single gift card
// @route   GET /api/gift-cards/:id
// @access  Private (Admin)
exports.getGiftCard = asyncHandler(async (req, res) => {
  const giftCard = await GiftCard.findById(req.params.id)
    .populate('redeemedBy', 'name');

  if (!giftCard) {
    throw new Error('Gift card not found');
  }

  res.json(giftCard);
});

// @desc    Update gift card
// @route   PUT /api/gift-cards/:id
// @access  Private (Admin)
exports.updateGiftCard = asyncHandler(async (req, res) => {
  const giftCard = await GiftCard.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!giftCard) {
    throw new Error('Gift card not found');
  }

  res.json(giftCard);
});

// @desc    Delete gift card
// @route   DELETE /api/gift-cards/:id
// @access  Private (Admin)
exports.deleteGiftCard = asyncHandler(async (req, res) => {
  const giftCard = await GiftCard.findById(req.params.id);

  if (!giftCard) {
    throw new Error('Gift card not found');
  }

  await giftCard.remove();
  res.json({ message: 'Gift card removed' });
});

// Helper function to generate unique gift card code
function generateGiftCardCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
