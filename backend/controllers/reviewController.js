const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @desc    Create a review
// @route   POST /api/reviews/product/:productId
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    throw new Error('Product already reviewed');
  }

  // Create review
  const review = await Review.create({
    rating,
    comment,
    product: productId,
    user: req.user._id,
  });

  // Update product's average rating
  await Product.findByIdAndUpdate(
    productId,
    {
      $push: { reviews: review._id },
    },
    { new: true }
  );

  res.status(201).json(review);
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Get average rating for a product
// @route   GET /api/reviews/product/:productId/average
// @access  Public
exports.getAverageRating = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  const averageRating = product.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  ) / product.reviews.length;

  res.json({ averageRating: Math.round(averageRating * 10) / 10 });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to update this review');
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to delete this review');
  }

  // Remove review from product
  await Product.findByIdAndUpdate(
    review.product,
    { $pull: { reviews: review._id } }
  );

  await review.remove();
  res.json({ message: 'Review removed' });
});
