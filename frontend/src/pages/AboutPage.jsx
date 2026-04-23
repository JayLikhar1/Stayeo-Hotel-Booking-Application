import React from 'react';
import { motion } from 'framer-motion';
import { Hotel, Users, Globe, Award, Zap, Shield, Heart, TrendingUp, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const STATS = [
  { value: '50+',   label: 'Cities Covered',    icon: MapPin },
  { value: '250+',  label: 'Premium Hotels',     icon: Hotel },
  { value: '50K+',  label: 'Happy Guests',       icon: Users },
  { value: '4.9★',  label: 'Average Rating',     icon: Star },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Guest-First Always',
    desc: 'Every decision we make starts with one question: does this make the guest experience better? From search to checkout to check-out, we obsess over every detail.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    desc: 'No hidden fees. No bait-and-switch pricing. What you see is what you pay. We believe trust is the foundation of every great stay.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'Technology-Driven',
    desc: 'We harness AI and modern engineering to surface the right hotel at the right price at the right moment — making discovery effortless.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'India at Heart',
    desc: 'Built for Indian travelers, by people who love India. From Tier-1 metros to hidden Tier-3 gems, we celebrate every corner of this incredible country.',
    color: 'from-violet-500 to-purple-600',
  },
];

const TEAM = [
  {
    name: 'Arjun Mehta',
    role: 'Co-Founder & CEO',
    bio: 'Former product lead at MakeMyTrip. Passionate about making travel accessible to every Indian.',
    avatar: 'AM',
    gradient: 'from-violet-500 to-blue-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Co-Founder & CTO',
    bio: 'Ex-Flipkart engineer. Builds systems that scale to millions without breaking a sweat.',
    avatar: 'PS',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Rohan Kapoor',
    role: 'Head of Design',
    bio: 'Crafts experiences that feel premium yet intuitive. Believes great design is invisible.',
    avatar: 'RK',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Sneha Iyer',
    role: 'Head of Partnerships',
    bio: 'Brings 200+ hotels onto the platform. Knows every GM in every city by first name.',
    avatar: 'SI',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const MILESTONES = [
  { year: '2022', event: 'StayEo founded in Bengaluru with a vision to reimagine hotel booking in India.' },
  { year: '2023', event: 'Launched beta with 50 hotels across 5 cities. Crossed 1,000 bookings in the first month.' },
  { year: '2023', event: 'Raised seed funding. Expanded to 20 cities and integrated Razorpay for seamless payments.' },
  { year: '2024', event: 'Hit 50,000 happy guests. Launched AI-powered recommendations and wishlist features.' },
  { year: '2025', event: 'Expanded to 50+ cities across all tiers. Became India\'s fastest-growing hotel booking platform.' },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Hotel className="w-4 h-4" /> Our Story
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            We're on a mission to make<br />
            <span className="gradient-text">every stay extraordinary</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            StayEo was born from a simple frustration — booking a great hotel in India shouldn't be complicated, expensive, or stressful. So we built something better.
          </motion.p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="py-12 bg-dark-900/30">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 text-center hover:border-white/20 transition-all">
                <Icon className="w-6 h-6 text-violet-400 mx-auto mb-3" />
                <div className="text-3xl font-black gradient-text mb-1">{value}</div>
                <div className="text-sm text-white/40">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-sm font-medium text-violet-400 mb-2 flex items-center gap-1.5">
                <span className="w-4 h-px bg-violet-400" /> The Beginning
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Built by travelers, for travelers
              </h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  In 2022, our founders were tired of the same experience: clunky interfaces, surprise fees, and hotels that looked nothing like their photos. They knew India deserved better.
                </p>
                <p>
                  StayEo started in a small apartment in Bengaluru with three engineers, a designer, and an obsession with getting every detail right. We spent six months talking to travelers, hotel managers, and hospitality experts before writing a single line of code.
                </p>
                <p>
                  Today, StayEo connects thousands of travelers with 250+ handpicked hotels across 50+ Indian cities — from the luxury palaces of Rajasthan to the budget hostels of Rishikesh. And we're just getting started.
                </p>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="space-y-4">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {m.year.slice(2)}
                    </div>
                    {i < MILESTONES.length - 1 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-xs font-semibold text-violet-400 mb-1">{m.year}</p>
                    <p className="text-sm text-white/60 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <p className="text-sm font-medium text-violet-400 mb-2 flex items-center justify-center gap-1.5">
              <span className="w-4 h-px bg-violet-400" /> What We Stand For
            </p>
            <h2 className="text-3xl font-black text-white">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 hover:border-white/20 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <p className="text-sm font-medium text-violet-400 mb-2 flex items-center justify-center gap-1.5">
              <span className="w-4 h-px bg-violet-400" /> The People
            </p>
            <h2 className="text-3xl font-black text-white">Meet the Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 text-center hover:border-white/20 transition-all group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-xl font-black text-white mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow-sm`}>
                  {member.avatar}
                </div>
                <h3 className="font-bold text-white mb-0.5">{member.name}</h3>
                <p className="text-xs text-violet-400 font-medium mb-3">{member.role}</p>
                <p className="text-xs text-white/40 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="glass rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10" />
            <div className="relative">
              <h2 className="text-3xl font-black text-white mb-4">Ready to experience StayEo?</h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">Join thousands of travelers who've already discovered a better way to book hotels in India.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/hotels" className="btn-primary px-8 py-3">Explore Hotels</Link>
                <Link to="/register" className="btn-secondary px-8 py-3">Create Free Account</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
