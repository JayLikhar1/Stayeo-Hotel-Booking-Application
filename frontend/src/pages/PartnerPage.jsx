import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, TrendingUp, Users, Globe, CheckCircle, ArrowRight,
  Star, BarChart3, Shield, Zap, HeadphonesIcon, CreditCard, Mail
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Grow Your Revenue',
    desc: 'Access 50,000+ active travelers searching for hotels across 50+ Indian cities. Our platform drives direct bookings with zero commission on the first 3 months.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Get a dedicated partner dashboard with live occupancy rates, revenue tracking, booking trends, and guest demographics — all in one place.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Users,
    title: 'Verified Guest Reviews',
    desc: 'Only guests who have actually stayed can review your property. Build authentic credibility that drives more bookings.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'Instant Booking Confirmation',
    desc: 'Our Razorpay-powered payment system ensures instant payment confirmation. No more chasing guests for deposits.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Fraud Protection',
    desc: 'Every booking is verified. We handle chargebacks, fraudulent bookings, and no-shows so you can focus on hospitality.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Partner Support',
    desc: 'A dedicated account manager, 24/7 technical support, and a partner community of 250+ hotels across India.',
    color: 'from-indigo-500 to-violet-600',
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'First 3 months',
    commission: '0%',
    features: [
      'List up to 3 room types',
      'Basic analytics dashboard',
      'Instant booking confirmation',
      'Email support',
      'StayEo verified badge',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₹2,999',
    sub: 'per month',
    commission: '8%',
    features: [
      'Unlimited room types',
      'Advanced analytics & reports',
      'Priority listing placement',
      'Dedicated account manager',
      'Featured hotel badge',
      'Promotional campaign access',
      'API integration support',
    ],
    cta: 'Start Growth Plan',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    sub: 'for hotel chains',
    commission: 'Negotiable',
    features: [
      'Multi-property management',
      'White-label booking widget',
      'Custom API integration',
      'Revenue management tools',
      'Dedicated tech support',
      'Co-marketing campaigns',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const STEPS = [
  { step: '01', title: 'Apply Online',       desc: 'Fill out the partner application form. Takes less than 5 minutes.' },
  { step: '02', title: 'Verification',        desc: 'Our team verifies your property details and documents within 48 hours.' },
  { step: '03', title: 'List Your Property',  desc: 'Add rooms, photos, pricing, and amenities through our partner portal.' },
  { step: '04', title: 'Start Receiving Bookings', desc: 'Go live and start receiving confirmed bookings with instant payments.' },
];

const PartnerPage = () => {
  const [form, setForm] = useState({ name: '', hotel: '', city: '', email: '', phone: '', rooms: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 overflow-hidden">
      {/* Hero */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Building2 className="w-4 h-4" /> Hotel Partner Program
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Grow your hotel with<br /><span className="gradient-text">StayEo Partners</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-8">
            Join 250+ hotels already earning more with StayEo. List your property, reach verified travelers, and get paid instantly.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            {['250+ Partner Hotels', '50K+ Verified Guests', '₹0 Setup Fee', '48hr Onboarding'].map(s => (
              <span key={s} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />{s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">Why partner with StayEo?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 hover:border-white/20 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">How it works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-violet-500/30" />
            {STEPS.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-black text-white shadow-glow-sm">
                  {s.step}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2">Simple, transparent pricing</h2>
            <p className="text-white/40">No hidden fees. Cancel anytime.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className={`rounded-2xl p-6 relative overflow-hidden ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/40 shadow-glow-sm'
                    : 'glass'
                }`}>
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                )}
                {plan.highlight && (
                  <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-violet-500 text-white font-semibold">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-3xl font-black gradient-text">{plan.price}</span>
                  <span className="text-sm text-white/40 ml-1">{plan.sub}</span>
                </div>
                <p className="text-xs text-white/40 mb-5">Commission: {plan.commission}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:partners@stayeo.com"
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight ? 'btn-primary' : 'btn-secondary'
                  }`}>
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="section-container max-w-2xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Apply to become a partner</h2>
            <p className="text-white/40">We'll get back to you within 48 hours.</p>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-10 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
              <p className="text-white/50">Our partnerships team will contact you at <span className="text-violet-400">{form.email}</span> within 48 hours.</p>
            </motion.div>
          ) : (
            <motion.form variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Your Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Rajesh Kumar" className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Hotel Name *</label>
                  <input required value={form.hotel} onChange={e => setForm(f => ({ ...f, hotel: e.target.value }))}
                    placeholder="The Grand Palace" className="input-dark text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">City *</label>
                  <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Mumbai" className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Number of Rooms</label>
                  <input type="number" value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))}
                    placeholder="50" className="input-dark text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@hotel.com" className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210" className="input-dark text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Tell us about your property</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={3} placeholder="Category, star rating, unique features..."
                  className="input-dark text-sm resize-none" />
              </div>
              <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4" /> Submit Application
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;
