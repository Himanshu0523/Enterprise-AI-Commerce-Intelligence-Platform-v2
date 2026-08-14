const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema (
  {
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        select: false
    }, // optional now (social login)
    roles: {
        type: [String], default: ['customer']},
    // MFA
    mfaEnabled: {
        type: Boolean, 
        default: false
    },
    mfaSecret: {
        type: String, 
        select: false
    }, // base32 encoded secret
    // OAuth
    googleId: {
        type: String, 
        unique: true, 
        sparse: true
    },
    facebookId: {
        type: String, 
        unique: true, 
        sparse: true
    }, // Facebook 
    // Password reset
    resetPasswordToken: {
        type: String, 
        select: false
    },
    resetPasswordExpires: {
        type: Date, 
        select: false
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model ('User', userSchema);
