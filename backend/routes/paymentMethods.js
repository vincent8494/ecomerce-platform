const express = require('express');
const router = express.Router();
const {
  addPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getPaymentMethod
} = require('../controllers/paymentMethodController');

const { protect } = require('../middleware/auth');

// Routes for payment methods
router
  .route('/')
  .get(protect, getPaymentMethods)
  .post(protect, addPaymentMethod);

router
  .route('/:id')
  .get(protect, getPaymentMethod)
  .put(protect, updatePaymentMethod)
  .delete(protect, deletePaymentMethod);

router
  .route('/:id/default')
  .put(protect, setDefaultPaymentMethod);

module.exports = router;
