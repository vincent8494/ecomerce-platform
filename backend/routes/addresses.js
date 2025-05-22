const express = require('express');
const router = express.Router();
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddress
} = require('../controllers/addressController');

const { protect } = require('../middleware/auth');

// Routes for address management
router
  .route('/')
  .get(protect, getAddresses)
  .post(protect, createAddress);

router
  .route('/:id')
  .get(protect, getAddress)
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router
  .route('/:id/default')
  .put(protect, setDefaultAddress);

module.exports = router;
