const Hotel = require('../models/Hotel');

// @desc    Get all hotels with filters
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      rating,
      category,
      amenities,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = { isActive: true };

    // City filter
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Hotel.countDocuments(query);

    const hotels = await Hotel.find(query)
      .select('-reviews')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: hotels.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      hotels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('reviews.user', 'name avatar');

    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    res.json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create hotel (admin)
// @route   POST /api/hotels
// @access  Admin
const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, message: 'Hotel created successfully!', hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hotel (admin)
// @route   PUT /api/hotels/:id
// @access  Admin
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    res.json({ success: true, message: 'Hotel updated successfully!', hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete hotel (admin)
// @route   DELETE /api/hotels/:id
// @access  Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    res.json({ success: true, message: 'Hotel deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to hotel
// @route   POST /api/hotels/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    // Check if user already reviewed
    const existingReview = hotel.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this hotel.' });
    }

    hotel.reviews.push({
      user: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    });

    hotel.calculateRating();
    await hotel.save();

    res.status(201).json({ success: true, message: 'Review added successfully!', hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
const getFeaturedHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true, isFeatured: true })
      .select('-reviews')
      .limit(8)
      .sort({ rating: -1 });

    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unique cities
// @route   GET /api/hotels/cities
// @access  Public
const getCities = async (req, res) => {
  try {
    const cities = await Hotel.distinct('location.city', { isActive: true });
    res.json({ success: true, cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get hotel stats (admin)
// @route   GET /api/hotels/stats
// @access  Admin
const getHotelStats = async (req, res) => {
  try {
    const totalHotels = await Hotel.countDocuments({ isActive: true });
    const categoryStats = await Hotel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
    ]);

    res.json({ success: true, totalHotels, categoryStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  addReview,
  getFeaturedHotels,
  getCities,
  getHotelStats,
};
