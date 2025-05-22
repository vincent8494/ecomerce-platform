const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add/:productId
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Check if product is already in wishlist
  const alreadyInWishlist = await Product.findOne({
    _id: productId,
    'wishlist.users': userId,
  });

  if (alreadyInWishlist) {
    throw new Error('Product already in wishlist');
  }

  // Add to wishlist
  await Product.findByIdAndUpdate(
    productId,
    { $addToSet: { 'wishlist.users': userId } },
    { new: true }
  );

  res.json({ message: 'Product added to wishlist' });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  // Remove from wishlist
  await Product.findByIdAndUpdate(
    productId,
    { $pull: { 'wishlist.users': userId } },
    { new: true }
  );

  res.json({ message: 'Product removed from wishlist' });
});

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Product.find({ 'wishlist.users': userId })
    .populate('category', 'name')
    .sort({ 'wishlist.createdAt': -1 });

  res.json(wishlist);
});

// @desc    Clear user's wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Product.updateMany(
    { 'wishlist.users': userId },
    { $pull: { 'wishlist.users': userId } }
  );

  res.json({ message: 'Wishlist cleared' });
});
