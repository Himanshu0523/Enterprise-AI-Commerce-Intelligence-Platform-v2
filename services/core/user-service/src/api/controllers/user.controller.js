const UserProfile = require('../../models/UserProfile');
const { getMergedProfile } = require('../../utils/mergeProfile');

// GET /users/me
exports.getMe = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.userId });
    if (!profile) {
      profile = await UserProfile.create({
        userId: req.userId,
        email: req.user?.email || `user_${req.userId}@example.com`,
        displayName: req.user?.name || 'Customer',
      });
    }
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /users/me
exports.updateMe = async (req, res) => {
  try {
    const allowed = ['displayName', 'avatarUrl', 'preferences'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    let profile = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!profile) {
      profile = await UserProfile.create({
        userId: req.userId,
        email: req.user?.email || `user_${req.userId}@example.com`,
        displayName: updates.displayName || 'Customer',
        ...updates
      });
    }
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /users/me/storefront/:storeId/profile
exports.getStorefrontProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId }).lean();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    const storeId = req.params.storeId;
    const merged = getMergedProfile(profile, storeId);
    res.json({ profile: merged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /users/me/storefront/:storeId/profile
exports.updateStorefrontProfile = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const { preferences, addresses, compliance } = req.body;

    const update = {};
    if (preferences) update[`storefrontProfiles.${storeId}.preferences`] = preferences;
    if (addresses) update[`storefrontProfiles.${storeId}.addresses`] = addresses;
    if (compliance) update[`storefrontProfiles.${storeId}.compliance`] = compliance;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: update },
      { new: true }
    );
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /users/me/role
exports.switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['retail', 'business'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const profile = await UserProfile.findOne({ userId: req.userId });
    if (!profile.roles.includes(role)) {
      return res.status(403).json({ error: 'Role not assigned to user' });
    }
    profile.currentActiveRole = role;
    await profile.save();
    // Emit event UserRoleChanged
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /users/me/business-profile
exports.updateBusinessProfile = async (req, res) => {
  try {
    const allowed = ['companyName', 'taxId', 'creditLimit', 'approvedTradeTerms'];
    const update = {};
    allowed.forEach(f => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: { businessProfile: update } },
      { new: true }
    );
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /users/me/security
exports.getSecurityProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId }, 'securityProfile').lean();
    res.json({ security: profile?.securityProfile || {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Addresses CRUD (base addresses)
exports.getAddresses = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId }, 'addresses').lean();
    res.json({ addresses: profile?.addresses || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId });
    profile.addresses.push(req.body);
    await profile.save();
    res.status(201).json({ addresses: profile.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await UserProfile.findOne({ userId: req.userId });
    const address = profile.addresses.id(id);
    if (!address) return res.status(404).json({ error: 'Address not found' });
    Object.assign(address, req.body);
    await profile.save();
    res.json({ addresses: profile.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await UserProfile.findOne({ userId: req.userId });
    profile.addresses.pull({ _id: id });
    await profile.save();
    res.json({ addresses: profile.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId }, 'wishlist').lean();
    res.json({ wishlist: profile?.wishlist || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const profile = await UserProfile.findOne({ userId: req.userId });
    if (profile.wishlist.some(item => item.productId === productId)) {
      return res.status(409).json({ error: 'Already in wishlist' });
    }
    profile.wishlist.push({ productId, addedAt: new Date() });
    await profile.save();
    res.status(201).json({ wishlist: profile.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const profile = await UserProfile.findOne({ userId: req.userId });
    profile.wishlist = profile.wishlist.filter(item => item.productId !== productId);
    await profile.save();
    res.json({ wishlist: profile.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Payment methods (display only)
exports.getPaymentMethods = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId }, 'paymentMethodRefs').lean();
    res.json({ paymentMethods: profile?.paymentMethodRefs || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cart bindings
exports.updateCartBindings = async (req, res) => {
  try {
    const { device, cartId } = req.body;
    if (!device || !cartId) return res.status(400).json({ error: 'device and cartId required' });
    const profile = await UserProfile.findOne({ userId: req.userId });
    profile.cartBindings.set(device, cartId);
    await profile.save();
    res.json({ cartBindings: profile.cartBindings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};