import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Hotel, MapPin, CheckCircle, Camera, ThumbsUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

const ASPECTS = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'service',     label: 'Service' },
  { key: 'location',    label: 'Location' },
  { key: 'value',       label: 'Value for Money' },
  { key: 'amenities',   label: 'Amenities' },
  { key: 'food',        label: 'Food & Dining' },
];

const TIPS = [
  { icon: CheckCircle, text: 'Be specific — mention room type, floor, or staff by name.' },
  { icon: CheckCircle, text: 'Describe what made your stay memorable (good or bad).' },
  { icon: CheckCircle, text: 'Mention the purpose of your trip — business, leisure, honeymoon.' },
  { icon: CheckCircle, text: 'Keep it honest. Other travelers rely on your experience.' },
  { icon: CheckCircle, text: 'Avoid personal information about staff or other guests.' },
];

const StarPicker = ({ value, onChange, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  const sz = size === 'lg' ? 'w-9 h-9' : 'w-6 h-6';
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110">
          <Star className={`${sz} transition-colors ${
            star <= (hover || value)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-white/20'
          }`} />
        </button>
      ))}
    </div>
  );
};

const LABELS = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

const WriteReviewPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { success, error, info } = useToastStore();

  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1); // 1=select hotel, 2=write review, 3=done
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    overall: 0,
    aspects: { cleanliness: 0, service: 0, location: 0, value: 0, amenities: 0, food: 0 },
    title: '',
    comment: '',
    tripType: '',
    travelMonth: '',
  });

  useEffect(() => {
    if (search.length < 2) { setHotels([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await hotelAPI.getAll({ search, limit: 8 });
        setHotels(res.data.hotels);
      } catch { setHotels([]); }
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { info('Please sign in to write a review'); return; }
    if (!selected) { error('Please select a hotel'); return; }
    if (form.overall === 0) { error('Please give an overall rating'); return; }
    if (form.comment.length < 30) { error('Review must be at least 30 characters'); return; }

    setIsSubmitting(true);
    try {
      await hotelAPI.addReview(selected._id, {
        rating: form.overall,
        comment: `${form.title ? form.title + '\n\n' : ''}${form.comment}`,
      });
      setStep(3);
      success('Review submitted! Thank you.');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> Share Your Experience
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl md:text-5xl font-black text-white mb-4">
            Write a <span className="gradient-text">Review</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/50 max-w-xl mx-auto">
            Your honest review helps millions of travelers make better decisions. Every word counts.
          </motion.p>
        </div>
      </section>

      <div className="section-container max-w-3xl">

        {/* Step 3 — Done */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Review Submitted!</h2>
            <p className="text-white/50 mb-6">Thank you for helping the StayEo community. Your review will appear shortly.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => { setStep(1); setSelected(null); setForm({ overall: 0, aspects: { cleanliness: 0, service: 0, location: 0, value: 0, amenities: 0, food: 0 }, title: '', comment: '', tripType: '', travelMonth: '' }); }}
                className="btn-secondary px-6 py-2.5 text-sm">Write Another Review</button>
              <Link to="/hotels" className="btn-primary px-6 py-2.5 text-sm">Explore Hotels</Link>
            </div>
          </motion.div>
        )}

        {/* Step 1 — Select Hotel */}
        {step === 1 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Which hotel did you stay at?</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by hotel name or city..."
                  className="input-dark pl-10" />
              </div>

              {hotels.length > 0 && (
                <div className="space-y-2">
                  {hotels.map(hotel => (
                    <button key={hotel._id} onClick={() => { setSelected(hotel); setStep(2); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        selected?._id === hotel._id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}>
                      <img src={hotel.thumbnail} alt={hotel.name}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{hotel.name}</p>
                        <p className="text-xs text-white/40 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{hotel.location?.city}, {hotel.location?.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        {hotel.rating?.toFixed(1)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {search.length >= 2 && hotels.length === 0 && (
                <p className="text-white/30 text-sm text-center py-4">No hotels found. Try a different name.</p>
              )}
              {search.length < 2 && (
                <p className="text-white/20 text-xs text-center py-2">Type at least 2 characters to search</p>
              )}
            </div>

            {/* Tips */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-violet-400" /> Tips for a great review
              </h3>
              <ul className="space-y-2.5">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                    <tip.icon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {tip.text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Step 2 — Write Review */}
        {step === 2 && selected && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">

            {/* Selected hotel */}
            <div className="glass rounded-2xl p-4 flex items-center gap-4">
              <img src={selected.thumbnail} alt={selected.name}
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-white">{selected.name}</p>
                <p className="text-sm text-white/40">{selected.location?.city}, {selected.location?.state}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Change
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Overall rating */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Overall Rating *</h3>
                <div className="flex items-center gap-4">
                  <StarPicker value={form.overall} onChange={v => setForm(f => ({ ...f, overall: v }))} size="lg" />
                  {form.overall > 0 && (
                    <span className="text-lg font-bold gradient-text">{LABELS[form.overall]}</span>
                  )}
                </div>
              </div>

              {/* Aspect ratings */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Rate Specific Aspects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ASPECTS.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-white/60">{label}</span>
                      <StarPicker value={form.aspects[key]}
                        onChange={v => setForm(f => ({ ...f, aspects: { ...f.aspects, [key]: v } }))} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Trip details */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Trip Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Type of Trip</label>
                    <select value={form.tripType} onChange={e => setForm(f => ({ ...f, tripType: e.target.value }))}
                      className="input-dark text-sm">
                      <option value="" className="bg-dark-900">Select...</option>
                      {['Business', 'Leisure', 'Family', 'Couple / Honeymoon', 'Solo', 'Friends'].map(t => (
                        <option key={t} value={t} className="bg-dark-900">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Month of Stay</label>
                    <select value={form.travelMonth} onChange={e => setForm(f => ({ ...f, travelMonth: e.target.value }))}
                      className="input-dark text-sm">
                      <option value="" className="bg-dark-900">Select...</option>
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                        <option key={m} value={m} className="bg-dark-900">{m} 2025</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Review text */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Your Review *</h3>
                <div className="mb-4">
                  <label className="block text-xs text-white/50 mb-1.5">Review Title</label>
                  <input type="text" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Summarise your stay in one line..."
                    maxLength={100} className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">
                    Detailed Review * <span className="text-white/25">({form.comment.length}/1000)</span>
                  </label>
                  <textarea value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Tell us about your experience — the room, service, food, location..."
                    rows={6} maxLength={1000}
                    className="input-dark text-sm resize-none" />
                  {form.comment.length > 0 && form.comment.length < 30 && (
                    <p className="text-xs text-red-400 mt-1">Minimum 30 characters required</p>
                  )}
                </div>
              </div>

              {!isAuthenticated && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300">
                  Please <Link to="/login" className="underline font-medium">sign in</Link> to submit your review.
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 text-sm">
                  Back
                </button>
                <button type="submit" disabled={isSubmitting || !isAuthenticated}
                  className="btn-primary flex-1 py-3 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                    : <><Star className="w-4 h-4" /> Submit Review</>
                  }
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WriteReviewPage;
