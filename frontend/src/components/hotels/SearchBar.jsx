import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Sparkles } from 'lucide-react';

const SearchBar = ({ variant = 'hero' }) => {
  const [query, setQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/hotels?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hotels, cities..."
            className="input-dark pl-10 py-2.5 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
          Search
        </button>
      </form>
    );
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass rounded-2xl p-2 shadow-glow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          {/* Destination */}
          <div className="relative md:col-span-1">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-text">
              <MapPin className="w-5 h-5 text-violet-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-white/40 mb-0.5">Destination</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Where to?"
                  className="w-full bg-transparent text-white text-sm placeholder-white/30 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-white/10 my-3" />

          {/* Check-in */}
          <div className="relative">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
              <Calendar className="w-5 h-5 text-violet-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-white/40 mb-0.5">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-white/10 my-3" />

          {/* Check-out */}
          <div className="relative">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
              <Calendar className="w-5 h-5 text-violet-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-white/40 mb-0.5">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || tomorrow}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-2 md:mt-0 md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2">
          <button
            type="submit"
            className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl"
          >
            <Search className="w-4 h-4" />
            <span>Search Hotels</span>
          </button>
        </div>
      </div>

      {/* AI suggestion chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3 justify-center">
        <span className="flex items-center gap-1 text-xs text-white/30">
          <Sparkles className="w-3 h-3 text-violet-400" /> Popular:
        </span>
        {['Mumbai', 'Goa', 'Jaipur', 'Udaipur', 'Shimla'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setQuery(city);
              navigate(`/hotels?search=${city}`);
            }}
            className="text-xs px-3 py-1 glass rounded-full text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            {city}
          </button>
        ))}
      </div>
    </motion.form>
  );
};

export default SearchBar;
