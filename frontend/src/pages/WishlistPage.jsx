import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import HotelCard from '../components/hotels/HotelCard';
import { SkeletonGrid } from '../components/ui/SkeletonCard';

const WishlistPage = () => {
  const [wishlistHotels, setWishlistHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await authAPI.getMe();
        // wishlist is populated with hotel objects
        setWishlistHotels(res.data.user.wishlist || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6 text-red-400 fill-red-400" />
            <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          </div>
          <p className="text-white/40 mb-8">
            {wishlistHotels.length} saved {wishlistHotels.length === 1 ? 'hotel' : 'hotels'}
          </p>

          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : wishlistHotels.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
              <p className="text-white/40 mb-6">Save hotels you love by clicking the heart icon</p>
              <Link to="/hotels" className="btn-primary px-6 py-2.5 text-sm inline-flex">
                Explore Hotels
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistHotels.map((hotel, i) => (
                <HotelCard key={hotel._id} hotel={hotel} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;
