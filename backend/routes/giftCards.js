const express = require('express');
const router = express.Router();
const {
  createGiftCard,
  getGiftCards,
  getGiftCard,
  updateGiftCard,
  deleteGiftCard,
  redeemGiftCard,
  validateGiftCard
} = require('../controllers/giftCardController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router
  .route('/redeem')
  .post(protect, redeemGiftCard);

router
  .route('/validate/:code')
  .get(validateGiftCard);

// Admin routes
router
  .route('/')
  .get(protect, authorize('admin'), getGiftCards)
  .post(protect, authorize('admin'), createGiftCard);

router
  .route('/:id')
  .get(protect, authorize('admin'), getGiftCard)
  .put(protect, authorize('admin'), updateGiftCard)
  .delete(protect, authorize('admin'), deleteGiftCard);

module.exports = router;
