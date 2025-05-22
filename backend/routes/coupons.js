const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  validateCoupon
} = require('../controllers/couponController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router
  .route('/apply')
  .post(protect, applyCoupon);

router
  .route('/validate/:code')
  .get(validateCoupon);

// Admin routes
router
  .route('/')
  .get(protect, authorize('admin'), getCoupons)
  .post(protect, authorize('admin'), createCoupon);

router
  .route('/:id')
  .get(protect, authorize('admin'), getCoupon)
  .put(protect, authorize('admin'), updateCoupon)
  .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;
