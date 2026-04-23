import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

const POSTS = [
  {
    id: 1, slug: 'top-10-luxury-hotels-india-2025',
    category: 'Luxury Travel',
    title: 'Top 10 Luxury Hotels in India You Must Stay at in 2025',
    excerpt: 'From floating palaces in Udaipur to cliff-top retreats in Shimla, we\'ve curated the most extraordinary luxury stays across India for the discerning traveler.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    author: 'Priya Sharma', date: 'April 15, 2025', readTime: '8 min',
    tags: ['Luxury', 'India', 'Hotels'],
    featured: true,
  },
  {
    id: 2, slug: 'budget-travel-india-tier3-cities',
    category: 'Budget Travel',
    title: 'Hidden Gems: Best Budget Hotels in India\'s Tier-3 Cities',
    excerpt: 'You don\'t need to spend a fortune to experience incredible India. Discover charming, affordable stays in cities most travelers overlook.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
    author: 'Rohan Kapoor', date: 'April 10, 2025', readTime: '6 min',
    tags: ['Budget', 'Tier-3', 'Tips'],
    featured: false,
  },
  {
    id: 3, slug: 'honeymoon-destinations-india',
    category: 'Romantic Getaways',
    title: '12 Most Romantic Hotel Destinations in India for Your Honeymoon',
    excerpt: 'From the backwaters of Kerala to the desert dunes of Rajasthan, India offers some of the world\'s most romantic settings for newlyweds.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
    author: 'Sneha Iyer', date: 'April 5, 2025', readTime: '10 min',
    tags: ['Honeymoon', 'Romantic', 'Destinations'],
    featured: true,
  },
  {
    id: 4, slug: 'business-travel-tips-india',
    category: 'Business Travel',
    title: 'The Ultimate Guide to Business Travel in India: Hotels, Tips & Hacks',
    excerpt: 'Frequent business traveler? Here\'s everything you need to know about booking the right hotel, maximising loyalty points, and staying productive on the road.',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600',
    author: 'Arjun Mehta', date: 'March 28, 2025', readTime: '7 min',
    tags: ['Business', 'Tips', 'Productivity'],
    featured: false,
  },
  {
    id: 5, slug: 'goa-complete-hotel-guide',
    category: 'Destination Guide',
    title: 'Goa Hotel Guide 2025: North vs South Goa — Which Should You Choose?',
    excerpt: 'North Goa for the party scene, South Goa for serenity? We break down the best hotels in both regions so you can pick the perfect base for your trip.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    author: 'Priya Sharma', date: 'March 20, 2025', readTime: '9 min',
    tags: ['Goa', 'Guide', 'Beach'],
    featured: false,
  },
  {
    id: 6, slug: 'rajasthan-palace-hotels',
    category: 'Heritage Travel',
    title: 'Sleeping in a Palace: The Best Heritage Hotels of Rajasthan',
    excerpt: 'Rajasthan\'s palace hotels are unlike anything else in the world. We review the top heritage properties — from Jaipur\'s Rambagh to Udaipur\'s Lake Palace.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',
    author: 'Rohan Kapoor', date: 'March 12, 2025', readTime: '11 min',
    tags: ['Heritage', 'Rajasthan', 'Palace'],
    featured: false,
  },
  {
    id: 7, slug: 'hill-station-hotels-india',
    category: 'Mountain Escapes',
    title: 'Best Hill Station Hotels in India: Shimla, Manali, Ooty & More',
    excerpt: 'Escape the heat with our guide to the finest mountain retreats across India. We cover everything from cosy cottages to luxury resorts with panoramic views.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    author: 'Sneha Iyer', date: 'March 5, 2025', readTime: '8 min',
    tags: ['Mountains', 'Hill Station', 'Escape'],
    featured: false,
  },
  {
    id: 8, slug: 'how-to-get-best-hotel-deals',
    category: 'Travel Tips',
    title: '10 Proven Ways to Get the Best Hotel Deals in India',
    excerpt: 'Insider tips from our team on how to score the best rates — from booking windows and last-minute deals to loyalty programs and negotiation tactics.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
    author: 'Arjun Mehta', date: 'Feb 25, 2025', readTime: '5 min',
    tags: ['Tips', 'Deals', 'Savings'],
    featured: false,
  },
];

const ALL_TAGS = [...new Set(POSTS.flatMap(p => p.tags))];
const ALL_CATS = [...new Set(POSTS.map(p => p.category))];

const PostCard = ({ post, featured = false, index = 0 }) => (
  <motion.div variants={fadeUp} initial="hidden" whileInView="visible"
    viewport={{ once: true }} custom={index}
    className={`glass rounded-2xl overflow-hidden hover:border-white/20 transition-all group ${featured ? 'md:col-span-2' : ''}`}>
    <div className={`overflow-hidden ${featured ? 'h-64' : 'h-44'}`}>
      <img src={post.image} alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge badge-purple text-xs">{post.category}</span>
        {post.featured && <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">Featured</span>}
      </div>
      <h3 className={`font-bold text-white mb-2 group-hover:text-violet-300 transition-colors leading-snug ${featured ? 'text-xl' : 'text-base'}`}>
        {post.title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} read</span>
        </div>
        <Link to={`/blog/${post.slug}`}
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
          Read <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const BlogPage = () => {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [activeCat, setActiveCat] = useState('');

  const filtered = POSTS.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || p.tags.includes(activeTag);
    const matchCat = !activeCat || p.category === activeCat;
    return matchSearch && matchTag && matchCat;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-5">
            <BookOpen className="w-4 h-4" /> Travel Blog
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl md:text-5xl font-black text-white mb-4">
            StayEo <span className="gradient-text">Travel Guides</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/50 max-w-xl mx-auto mb-8">
            Expert hotel reviews, destination guides, travel tips, and insider secrets from our team of travel writers.
          </motion.p>

          {/* Search */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="input-dark pl-10 w-full" />
          </motion.div>
        </div>
      </section>

      <div className="section-container">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => { setActiveCat(''); setActiveTag(''); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${!activeCat && !activeTag ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
            All
          </button>
          {ALL_CATS.map(cat => (
            <button key={cat} onClick={() => { setActiveCat(activeCat === cat ? '' : cat); setActiveTag(''); }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${activeCat === cat ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all ${
                activeTag === tag ? 'bg-blue-600/30 border-blue-500/50 text-blue-300' : 'border-white/10 text-white/30 hover:border-white/20'
              }`}>
              <Tag className="w-3 h-3" />{tag}
            </button>
          ))}
        </div>

        {/* Featured posts */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {featured.map((post, i) => <PostCard key={post.id} post={post} featured index={i} />)}
          </div>
        )}

        {/* Rest of posts */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No articles found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
