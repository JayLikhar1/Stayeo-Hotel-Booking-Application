import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart, Wifi, Coffee, Dumbbell, Waves } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

const amenityIcons = {
  'Free WiFi': Wifi,
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Restaurant': Coffee,
};

const categoryColors = {
  'Budget': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Standard': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Premium': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'Luxury': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Ultra-Luxury': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const HotelCard = ({ hotel, index = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const { isAuthenticated, isInWishlist, toggleWishlist } = useAuthStore();
  const { success, error, info } = useToastStore();
  const inWishlist = isInWishlist(hotel._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Please sign in to save hotels to your wishlist');
      return;
    }

    const result = await toggleWishlist(hotel._id);
    if (result.success) {
      success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } else {
      error('Failed to update wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/hotels/${hotel._id}`} className="block">
        <div className="glass rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-white/20 group-hover:shadow-glow-sm">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-dark-800">
            <img
              src={imgError ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' : (hotel.thumbnail || hotel.images?.[0])}
              alt={hotel.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className={`badge border text-xs ${categoryColors[hotel.category] || categoryColors['Standard']}`}>
                {hotel.category}
              </span>
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                inWishlist
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'glass text-white/60 hover:text-red-400 hover:border-red-400/30'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Featured badge */}
            {hotel.isFeatured && (
              <div className="absolute bottom-3 left-3">
                <span className="badge bg-gradient-to-r from-violet-600/80 to-blue-600/80 text-white border-0 backdrop-blur-sm">
                  ✦ Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Name */}
            <h3 className="font-bold text-white text-base leading-tight mb-1.5 group-hover:text-violet-300 transition-colors line-clamp-1">
              {hotel.name}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-white/50 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{hotel.location?.city}, {hotel.location?.country}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(hotel.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-white/80">{hotel.rating?.toFixed(1)}</span>
              <span className="text-xs text-white/30">({hotel.reviewCount || 0} reviews)</span>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2 mb-4">
              {hotel.amenities?.slice(0, 3).map((amenity) => {
                const Icon = amenityIcons[amenity];
                return Icon ? (
                  <div key={amenity} className="flex items-center gap-1 text-xs text-white/40">
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{amenity.split(' ')[0]}</span>
                  </div>
                ) : null;
              })}
              {hotel.amenities?.length > 3 && (
                <span className="text-xs text-white/30">+{hotel.amenities.length - 3} more</span>
              )}
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-white/40">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold gradient-text">
                    ₹{hotel.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-white/40">/night</span>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xs px-4 py-2"
              >
                Book Now
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HotelCard;
