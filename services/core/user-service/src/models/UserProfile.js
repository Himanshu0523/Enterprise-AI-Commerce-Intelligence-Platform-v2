const mongoose = require ('mongoose');

const addressSchema = new mongoose.Schema (
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId ().toString (),
    },
    addressLine1: {type: String, required: true},
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    isDefault: {type: Boolean, default: false},
    type: {type: String, enum: ['shipping', 'billing'], default: 'shipping'},
    storefrontId: String, // optional storefront-specific address
  },
  {_id: false}
);

const userProfileSchema = new mongoose.Schema (
  {
    userId: {type: String, required: true, unique: true, index: true}, // from auth-service
    email: {type: String, required: true, lowercase: true},
    displayName: {type: String, default: ''},
    avatarUrl: {type: String, default: ''},
    preferences: {
      language: {type: String, default: 'en'},
      currency: {type: String, default: 'USD'},
      notifications: {type: Boolean, default: true},
      // any other key-value pairs allowed
    },
    storefrontProfiles: {
      type: Map,
      of: {
        preferences: {type: Map, of: mongoose.Schema.Types.Mixed},
        addresses: [addressSchema],
        compliance: {type: Map, of: Boolean}, // e.g., gdprConsent, marketingOptIn
      },
    },
    roles: {type: [String], enum: ['retail', 'business'], default: ['retail']},
    currentActiveRole: {
      type: String,
      enum: ['retail', 'business'],
      default: 'retail',
    },
    businessProfile: {
      companyName: String,
      taxId: String,
      creditLimit: {type: Number, default: 0},
      approvedTradeTerms: {type: Boolean, default: false},
    },
    securityProfile: {
      trustScore: {type: Number, default: 0},
      deviceFingerprints: [String],
      lastFraudAssessment: Date,
    },
    paymentMethodRefs: [
      {
        id: String, // reference ID in payment-service
        type: {type: String, enum: ['card', 'paypal', 'bank']},
        last4: String,
        expiryMonth: Number,
        expiryYear: Number,
        isDefault: {type: Boolean, default: false},
      },
    ],
    wishlist: [
      {
        productId: String,
        addedAt: {type: Date, default: Date.now},
      },
    ],
    cartBindings: {type: Map, of: String}, // device -> cartId
    addresses: [addressSchema], // base user addresses
  },
  {timestamps: true}
);

// Indexes
userProfileSchema.index ({storefrontProfiles: 1});

module.exports = mongoose.model ('UserProfile', userProfileSchema);
