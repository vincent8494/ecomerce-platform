const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getAverageRating
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');

// Routes for product reviews
router
  .route('/product/:productId')
  .get(getReviews)
  .post(protect, createReview);

router
  .route('/product/:productId/average')
  .get(getAverageRating);

// Routes for specific review
router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
