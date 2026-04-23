import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hotel } from 'lucide-react';
import { hotelAPI } from '../services/api';
import HotelCard from '../components/hotels/HotelCard';
import HotelFilters from '../components/hotels/HotelFilters';
import SearchBar from '../components/hotels/SearchBar';
import { SkeletonGrid } from '../components/ui/SkeletonCard';

const DEFAULT_FILTERS = {
  sort: '-createdAt',
  category: '',
  minPrice: '',
  maxPrice: '',
  rating: '',
  amenities: '',
};

const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    featured: searchParams.get('featured') || '',
  });

  const fetchHotels = useCallback(async (currentPage = 1, currentFilters = filters) => {
    setIsLoading(true);
    try {
      const params = { page: currentPage, limit: 12, ...currentFilters };
      // Remove empty params
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await hotelAPI.getAll(params);
      setHotels(res.data.hotels);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const newFilters = {
      ...DEFAULT_FILTERS,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      featured: searchParams.get('featured') || '',
    };
    setFilters(newFilters);
    setPage(1);
    fetchHotels(1, newFilters);
  }, [searchParams.toString()]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    fetchHotels(1, newFilters);
  };

  const handleReset = () => {
    const reset = { ...DEFAULT_FILTERS, search: filters.search };
    setFilters(reset);
    setPage(1);
    fetchHotels(1, reset);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchHotels(newPage, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="flex items-center gap-2 text-violet-400 text-sm mb-2">
            <Hotel className="w-4 h-4" />
            <span>All Hotels</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {filters.search
              ? `Results for "${filters.search}"`
              : filters.featured
              ? 'Featured Hotels'
              : 'Explore All Hotels'}
          </h1>

          {/* Compact search */}
          <div className="max-w-xl">
            <SearchBar variant="compact" />
          </div>
        </motion.div>

        {/* Filters */}
        <HotelFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          totalResults={total}
        />

        {/* Results */}
        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : hotels.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-4">
              <Hotel className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No hotels found</h3>
            <p className="text-white/40 mb-6">Try adjusting your filters or search query</p>
            <button onClick={handleReset} className="btn-primary px-6 py-2.5 text-sm">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel._id} hotel={hotel} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 glass rounded-xl text-sm text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        p === page
                          ? 'bg-violet-600 text-white shadow-glow-sm'
                          : 'glass text-white/50 hover:text-white hover:bg-white/10'
                      }`}>
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 glass rounded-xl text-sm text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;
