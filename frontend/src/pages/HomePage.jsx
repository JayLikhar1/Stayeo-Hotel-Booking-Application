import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Globe, Sparkles, TrendingUp, Award } from 'lucide-react';
import { hotelAPI } from '../services/api';
import SearchBar from '../components/hotels/SearchBar';
import HotelCarousel from '../components/hotels/HotelCarousel';
import HotelCard from '../components/hotels/HotelCard';
import { SkeletonGrid } from '../components/ui/SkeletonCard';

const STATS = [
  { value: '500+', label: 'Premium Hotels', icon: Award },
  { value: '50K+', label: 'Happy Guests', icon: Star },
  { value: '100+', label: 'Destinations', icon: Globe },
  { value: '4.9★', label: 'Average Rating', icon: TrendingUp },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Confirm your stay in seconds with our streamlined booking flow and instant confirmation.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'Bank-grade encryption and Razorpay-powered payments keep your transactions safe.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    desc: 'Our AI engine learns your preferences to surface the perfect hotels for every trip.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Globe,
    title: 'Best Price Guarantee',
    desc: 'Find a lower price elsewhere? We\'ll match it — no questions asked.',
    color: 'from-blue-500 to-cyan-500',
  },
];

const DESTINATIONS = [
  { city: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400', hotels: 48 },
  { city: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', hotels: 32 },
  { city: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed68e23?w=400', hotels: 27 },
  { city: 'Udaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400', hotels: 19 },
  { city: 'Shimla', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400', hotels: 15 },
  { city: 'New Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', hotels: 61 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const HomePage = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, topRes] = await Promise.all([
          hotelAPI.getFeatured(),
          hotelAPI.getAll({ sort: '-rating', limit: 6 }),
        ]);
        setFeaturedHotels(featuredRes.data.hotels);
        setTopRated(topRes.data.hotels);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated background */}
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.2)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.15)_0%,transparent_60%)]" />

        {/* Floating orbs */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative section-container text-center py-20">
          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Enhanced Hotel Booking Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Find Your{' '}
            <span className="gradient-text">Perfect</span>
            <br />
            Stay, Anywhere
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover handpicked luxury hotels, seamless bookings, and AI-powered recommendations — all in one premium platform.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="relative">
            <SearchBar variant="hero" />
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <div className="text-2xl font-black gradient-text">{value}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
          <span className="text-xs">Scroll</span>
        </motion.div>
      </section>

      {/* ── Featured Hotels Carousel ─────────────────────────────── */}
      {isLoading ? (
        <section className="py-16 section-container"><SkeletonGrid count={3} /></section>
      ) : featuredHotels.length > 0 ? (
        <HotelCarousel hotels={featuredHotels} title="Featured Stays" subtitle="Handpicked for you" />
      ) : null}

      {/* ── Destinations ─────────────────────────────────────────── */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <p className="text-sm font-medium text-violet-400 mb-1 flex items-center justify-center gap-1.5">
              <span className="w-4 h-px bg-violet-400" /> Explore India
            </p>
            <h2 className="text-3xl font-bold text-white">Popular Destinations</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DESTINATIONS.map((dest, i) => (
              <motion.div key={dest.city} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}>
                <Link to={`/hotels?search=${dest.city}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={dest.image} alt={dest.city}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-bold text-white">{dest.city}</p>
                    <p className="text-xs text-white/50">{dest.hotels} hotels</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Rated Hotels ─────────────────────────────────────── */}
      {!isLoading && topRated.length > 0 && (
        <section className="py-16">
          <div className="section-container">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-medium text-violet-400 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-px bg-violet-400" /> Top Picks
                </p>
                <h2 className="text-3xl font-bold text-white">Highest Rated Hotels</h2>
              </div>
              <Link to="/hotels?sort=-rating" className="hidden md:flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRated.map((hotel, i) => (
                <HotelCard key={hotel._id} hotel={hotel} index={i} />
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link to="/hotels" className="btn-secondary inline-flex items-center gap-2 text-sm">
                View all hotels <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-20 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <p className="text-sm font-medium text-violet-400 mb-1 flex items-center justify-center gap-1.5">
              <span className="w-4 h-px bg-violet-400" /> Why StayEo
            </p>
            <h2 className="text-3xl font-bold text-white">Built for the Modern Traveler</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative glass rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-blue-600/20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to <span className="gradient-text">StayEo</span>?
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of travelers who book smarter with AI-powered recommendations and seamless payments.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-4 text-base">
                  Start Exploring <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/hotels" className="btn-secondary flex items-center gap-2 px-8 py-4 text-base">
                  Browse Hotels
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
