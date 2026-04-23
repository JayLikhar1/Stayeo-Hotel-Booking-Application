const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },

    // ── Loyalty / Rewards ──────────────────────────────────────────
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    loyaltyTier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze',
    },
    totalPointsEarned: {
      type: Number,
      default: 0,
    },
    pointsHistory: [
      {
        points:      { type: Number, required: true },
        type:        { type: String, enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'BONUS'], default: 'EARNED' },
        description: { type: String, default: '' },
        bookingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        createdAt:   { type: Date, default: Date.now },
      },
    ],

    // ── Wallet ─────────────────────────────────────────────────────
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    walletTransactions: [
      {
        amount:      { type: Number, required: true },
        type:        { type: String, enum: ['CREDIT', 'DEBIT', 'REFUND', 'CASHBACK'], default: 'CREDIT' },
        description: { type: String, default: '' },
        bookingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        status:      { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], default: 'SUCCESS' },
        createdAt:   { type: Date, default: Date.now },
      },
    ],

    // ── Saved Payment Methods (tokenised — no raw card data) ───────
    savedPaymentMethods: [
      {
        type:        { type: String, enum: ['card', 'upi', 'netbanking'], default: 'card' },
        label:       { type: String, default: '' },   // e.g. "HDFC •••• 4242"
        last4:       { type: String, default: '' },
        network:     { type: String, default: '' },   // Visa / Mastercard / RuPay
        upiId:       { type: String, default: '' },
        isDefault:   { type: Boolean, default: false },
        addedAt:     { type: Date, default: Date.now },
      },
    ],

    // ── Travel Documents Vault ─────────────────────────────────────
    travelDocuments: [
      {
        docType:    { type: String, enum: ['Passport', 'Aadhaar', 'PAN', 'Driving Licence', 'Voter ID', 'Other'], required: true },
        docNumber:  { type: String, required: true },
        name:       { type: String, default: '' },
        expiry:     { type: Date },
        nationality:{ type: String, default: 'Indian' },
        addedAt:    { type: Date, default: Date.now },
      },
    ],

    // ── Preferences ────────────────────────────────────────────────
    preferences: {
      currency:     { type: String, default: 'INR' },
      language:     { type: String, default: 'en' },
      emailAlerts:  { type: Boolean, default: true },
      smsAlerts:    { type: Boolean, default: false },
    },

    // ── Referral ───────────────────────────────────────────────────
    referralCode:   { type: String, default: '' },
    referredBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referralCount:  { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
