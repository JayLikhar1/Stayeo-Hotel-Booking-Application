import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Heart, Wifi, Coffee, Dumbbell, Waves, Car, Utensils,
  ChevronLeft, ChevronRight, Check, Clock, Users, X, Share2
} from 'lucide-react';
import { hotelAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import BookingModal from '../components/booking/BookingModal';
import StarRating from '../components/ui/StarRating';

const amenityIconMap = {
  'Free WiFi': Wifi, 'Swimming Pool': Waves, 'Gym': Dumbbell,
  'Restaurant': Utensils, 'Bar': Coffee, 'Parking': Car,
};

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isInWishlist, toggleWishlist } = useAuthStore();
  const { success, error, info } = useToastStore();

  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const inWishlist = hotel ? isInWishlist(hotel._id) : false;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await hotelAPI.getById(id);
        setHotel(res.data.hotel);
      } catch {
        navigate('/hotels');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) { info('Please sign in to save hotels'); return; }
    const result = await toggleWishlist(hotel._id);
    if (result.success) success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    else error('Failed to update wishlist');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 section-container">
        <div className="skeleton h-96 rounded-2xl mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
        <div className="skeleton h-8 w-1/2 rounded mb-3" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    );
  }

  if (!hotel) return null;

  const images = hotel.images?.length ? hotel.images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Image Gallery */}
      <div className="relative h-[50vh] md:h-[60vh] bg-dark-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImg}
            src={imgErrors[activeImg] ? images[0] : images[activeImg]}
            alt={hotel.name}
            onError={() => setImgErrors(p => ({ ...p, [activeImg]: true }))}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-dark-950/20" />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setActiveImg(p => (p + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-white w-6' : 'bg-white/40'}`} />
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleShare} className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
            <Share2 className="w-4 h-4 text-white" />
          </button>
          <button onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              inWishlist ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'glass hover:bg-white/20'
            }`}>
            <Heart className={`w-4 h-4 text-white ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category */}
        <div className="absolute top-4 left-4">
          <span className="badge bg-dark-950/70 backdrop-blur-sm text-white border-white/20">
            {hotel.category}
          </span>
        </div>
      </div>

      <div className="section-container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{hotel.name}</h1>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                <MapPin className="w-4 h-4 text-violet-400" />
                {hotel.location?.address && `${hotel.location.address}, `}
                {hotel.location?.city}, {hotel.location?.state}, {hotel.location?.country}
              </div>
              <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} size="md" />
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">About this property</h2>
              <p className="text-white/60 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities?.map((amenity) => {
                  const Icon = amenityIconMap[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center gap-2.5 text-sm text-white/60">
                      <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-violet-400" />
                      </div>
                      {amenity}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rooms */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Room Types</h2>
              <div className="space-y-3">
                {hotel.rooms?.map((room) => (
                  <div key={room.type} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <p className="font-semibold text-white">{room.type} Room</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Up to {room.capacity} guests
                        </span>
                        {room.amenities?.slice(0, 2).map(a => (
                          <span key={a} className="text-xs text-white/30">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold gradient-text">₹{room.price?.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-white/40">per night</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Hotel Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-xs text-white/40">Check-in</p>
                    <p className="text-sm text-white font-medium">{hotel.checkInTime || '14:00'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-white/40">Check-out</p>
                    <p className="text-sm text-white font-medium">{hotel.checkOutTime || '11:00'}</p>
                  </div>
                </div>
              </div>
              {hotel.policies?.cancellation && (
                <p className="text-sm text-white/50 mt-4 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {hotel.policies.cancellation}
                </p>
              )}
            </div>

            {/* Reviews */}
            {hotel.reviews?.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">
                  Guest Reviews ({hotel.reviewCount})
                </h2>
                <div className="space-y-4">
                  {hotel.reviews.slice(0, 5).map((review, i) => (
                    <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                            {review.userName?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-medium text-white">{review.userName || 'Guest'}</span>
                        </div>
                        <StarRating rating={review.rating} size="xs" showNumber={false} />
                      </div>
                      {review.comment && <p className="text-sm text-white/50">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="glass rounded-2xl p-6 shadow-glow-sm">
                <div className="mb-4">
                  <span className="text-xs text-white/40">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black gradient-text">
                      ₹{hotel.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-white/40">/night</span>
                  </div>
                </div>

                <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} size="sm" />

                <div className="my-5 space-y-2">
                  {hotel.amenities?.slice(0, 4).map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-white/50">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> {a}
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!isAuthenticated) { info('Please sign in to book'); navigate('/login'); return; }
                    setShowBooking(true);
                  }}
                  className="w-full btn-primary py-4 text-base"
                >
                  Book Now
                </motion.button>

                <p className="text-xs text-white/30 text-center mt-3">
                  Free cancellation · No hidden fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <BookingModal hotel={hotel} isOpen={showBooking} onClose={() => setShowBooking(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelDetailPage;
