const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');
const { protect } = require('../middleware/auth');

// @desc    Get all addresses
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id })
    .sort({ default: -1 })
    .populate('user', 'name');

  res.json(addresses);
});

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
exports.getAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id)
    .populate('user', 'name');

  if (!address) {
    throw new Error('Address not found');
  }

  // Check if address belongs to user
  if (address.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to view this address');
  }

  res.json(address);
});

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
exports.createAddress = asyncHandler(async (req, res) => {
  const { name, address, city, state, postalCode, country, phone } = req.body;

  // Check if default address exists
  const hasDefault = await Address.findOne({
    user: req.user._id,
    default: true,
  });

  // If creating new default address, remove old default
  if (req.body.default && hasDefault) {
    await Address.findByIdAndUpdate(hasDefault._id, { default: false });
  }

  const newAddress = await Address.create({
    user: req.user._id,
    name,
    address,
    city,
    state,
    postalCode,
    country,
    phone,
    default: req.body.default || false,
  });

  res.status(201).json(newAddress);
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    throw new Error('Address not found');
  }

  // Check if address belongs to user
  if (address.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to update this address');
  }

  // If setting as default, remove old default
  if (req.body.default) {
    await Address.updateMany(
      { user: req.user._id },
      { default: false }
    );
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedAddress);
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    throw new Error('Address not found');
  }

  // Check if address belongs to user
  if (address.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to delete this address');
  }

  await address.remove();
  res.json({ message: 'Address removed' });
});

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    throw new Error('Address not found');
  }

  // Check if address belongs to user
  if (address.user.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to update this address');
  }

  // Remove default status from all other addresses
  await Address.updateMany(
    { user: req.user._id },
    { default: false }
  );

  // Set this address as default
  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    { default: true },
    { new: true }
  );

  res.json(updatedAddress);
});
