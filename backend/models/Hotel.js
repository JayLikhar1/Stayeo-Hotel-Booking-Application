const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Studio'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  capacity: {
    type: Number,
    required: true,
    default: 2,
  },
  amenities: [String],
  images: [String],
  available: {
    type: Boolean,
    default: true,
  },
  count: {
    type: Number,
    default: 1,
  },
});

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
      maxlength: [100, 'Hotel name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, default: '' },
      country: { type: String, required: true, default: 'India' },
      address: { type: String, default: '' },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    amenities: {
      type: [String],
      default: [],
    },
    rooms: [roomSchema],
    category: {
      type: String,
      enum: ['Budget', 'Standard', 'Premium', 'Luxury', 'Ultra-Luxury'],
      default: 'Standard',
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    checkInTime: {
      type: String,
      default: '14:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
    policies: {
      cancellation: { type: String, default: 'Free cancellation up to 24 hours before check-in' },
      pets: { type: Boolean, default: false },
      smoking: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
hotelSchema.index({ 'location.city': 'text', name: 'text', description: 'text' });
hotelSchema.index({ price: 1, rating: -1 });

// Calculate average rating before save
hotelSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  }
};

module.exports = mongoose.model('Hotel', hotelSchema);
