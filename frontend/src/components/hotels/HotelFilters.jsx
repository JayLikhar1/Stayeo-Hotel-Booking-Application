import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const CATEGORIES = ['Budget', 'Standard', 'Premium', 'Luxury', 'Ultra-Luxury'];
const AMENITIES = ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Airport Transfer'];
const RATINGS = [4.5, 4.0, 3.5, 3.0];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating', label: 'Top Rated' },
];

const HotelFilters = ({ filters, onChange, onReset, totalResults }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = [
    filters.category,
    filters.minPrice || filters.maxPrice,
    filters.rating,
    filters.amenities,
  ].filter(Boolean).length;

  return (
    <div className="mb-8">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isOpen || activeFilterCount > 0
              ? 'bg-violet-600 text-white shadow-glow-sm'
              : 'glass text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort || '-createdAt'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="appearance-none glass text-white/70 text-sm px-4 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-dark-900">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>

        {/* Results count */}
        <span className="text-sm text-white/40 ml-auto">
          {totalResults} {totalResults === 1 ? 'hotel' : 'hotels'} found
        </span>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl p-6 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleChange('category', filters.category === cat ? '' : cat)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        filters.category === cat
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                  Price Range (₹/night)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    className="input-dark py-2 text-sm w-full"
                  />
                  <span className="text-white/30 flex-shrink-0">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    className="input-dark py-2 text-sm w-full"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                  Minimum Rating
                </label>
                <div className="flex flex-wrap gap-2">
                  {RATINGS.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleChange('rating', filters.rating === String(r) ? '' : String(r))}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        filters.rating === String(r)
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                          : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                      }`}
                    >
                      ★ {r}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.slice(0, 6).map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => {
                        const current = filters.amenities ? filters.amenities.split(',') : [];
                        const updated = current.includes(amenity)
                          ? current.filter((a) => a !== amenity)
                          : [...current, amenity];
                        handleChange('amenities', updated.join(',') || '');
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        filters.amenities?.includes(amenity)
                          ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                          : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelFilters;
