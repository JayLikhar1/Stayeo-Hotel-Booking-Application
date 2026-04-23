import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Download, Mail, ExternalLink, Award, TrendingUp, Users } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const COVERAGE = [
  {
    outlet: 'Economic Times',
    logo: 'ET',
    gradient: 'from-orange-500 to-red-500',
    headline: 'StayEo raises seed funding to disrupt India\'s hotel booking market',
    date: 'March 2024',
    excerpt: 'Bengaluru-based StayEo has raised an undisclosed seed round to expand its AI-powered hotel booking platform across Tier-2 and Tier-3 Indian cities, challenging incumbents with a premium-first approach.',
    url: '#',
  },
  {
    outlet: 'YourStory',
    logo: 'YS',
    gradient: 'from-blue-500 to-cyan-500',
    headline: 'How StayEo is making luxury hotel stays accessible to every Indian traveler',
    date: 'January 2024',
    excerpt: 'StayEo\'s co-founders share how they\'re using AI recommendations and transparent pricing to build trust with a new generation of Indian travelers who demand more from their booking experience.',
    url: '#',
  },
  {
    outlet: 'Inc42',
    logo: 'I42',
    gradient: 'from-violet-500 to-purple-600',
    headline: 'StayEo crosses 50,000 bookings milestone, eyes pan-India expansion',
    date: 'November 2023',
    excerpt: 'The hotel booking startup has seen 3x growth quarter-on-quarter, driven by strong demand from business travelers and a growing base of leisure tourists in Tier-2 cities.',
    url: '#',
  },
  {
    outlet: 'The Hindu BusinessLine',
    logo: 'HBL',
    gradient: 'from-emerald-500 to-teal-500',
    headline: 'StayEo\'s Razorpay integration sets new standard for hotel payment UX in India',
    date: 'September 2023',
    excerpt: 'StayEo\'s seamless payment flow, built on Razorpay\'s infrastructure, has achieved a 94% payment success rate — significantly above the industry average of 78%.',
    url: '#',
  },
  {
    outlet: 'Entrackr',
    logo: 'ENT',
    gradient: 'from-amber-500 to-orange-500',
    headline: 'StayEo bets on Tier-3 cities as the next frontier for premium hotel bookings',
    date: 'July 2023',
    excerpt: 'While competitors focus on metros, StayEo is quietly building a network of quality hotels in smaller Indian cities, betting that rising disposable incomes will drive demand.',
    url: '#',
  },
  {
    outlet: 'TechCrunch India',
    logo: 'TC',
    gradient: 'from-green-500 to-emerald-500',
    headline: 'StayEo launches AI-powered hotel recommendations for Indian travelers',
    date: 'May 2023',
    excerpt: 'The startup\'s new recommendation engine analyses travel patterns, preferences, and real-time availability to surface the most relevant hotels — reducing search time by 60%.',
    url: '#',
  },
];

const AWARDS = [
  { title: 'Best Travel Startup 2024',       org: 'India Startup Awards',        icon: Award },
  { title: 'Top 50 Startups to Watch',       org: 'Inc42 Annual List 2024',      icon: TrendingUp },
  { title: 'Best UX in Travel Category',     org: 'Google Play Best of 2023',    icon: Award },
  { title: 'Fastest Growing Travel App',     org: 'YourStory Tech30 2023',       icon: TrendingUp },
];

const FACTS = [
  { value: '250+',  label: 'Hotels on platform' },
  { value: '50+',   label: 'Cities covered' },
  { value: '50K+',  label: 'Bookings completed' },
  { value: '94%',   label: 'Payment success rate' },
  { value: '4.9/5', label: 'Average guest rating' },
  { value: '2022',  label: 'Founded' },
];

const PressPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Newspaper className="w-4 h-4" /> Press & Media
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            StayEo in the <span className="gradient-text">News</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
            For press inquiries, interview requests, or media assets, reach out to our communications team.
          </motion.p>
          <motion.a variants={fadeUp} initial="hidden" animate="visible" custom={3}
            href="mailto:press@stayeo.com"
            className="inline-flex items-center gap-2 btn-primary px-6 py-3">
            <Mail className="w-4 h-4" /> press@stayeo.com
          </motion.a>
        </div>
      </section>

      {/* ── Key Facts ────────────────────────────────────────────────── */}
      <section className="py-12 bg-dark-900/30">
        <div className="section-container">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center text-xl font-bold text-white mb-8">Key Facts & Figures</motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FACTS.map((f, i) => (
              <motion.div key={f.label} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black gradient-text mb-1">{f.value}</div>
                <div className="text-xs text-white/40">{f.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Coverage ───────────────────────────────────────────── */}
      <section className="py-16">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mb-10">
            <p className="text-sm font-medium text-violet-400 mb-1 flex items-center gap-1.5">
              <span className="w-4 h-px bg-violet-400" /> Media Coverage
            </p>
            <h2 className="text-2xl font-black text-white">Featured In</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COVERAGE.map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 hover:border-white/20 transition-all group">
                <div className="flex items-start gap-4">
                  {/* Outlet logo */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xs font-black text-white flex-shrink-0`}>
                    {item.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-white/60">{item.outlet}</span>
                      <span className="text-xs text-white/30">{item.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-violet-300 transition-colors">
                      {item.headline}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{item.excerpt}</p>
                    <a href={item.url}
                      className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors mt-3">
                      Read article <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mb-10">
            <p className="text-sm font-medium text-violet-400 mb-1 flex items-center gap-1.5">
              <span className="w-4 h-px bg-violet-400" /> Recognition
            </p>
            <h2 className="text-2xl font-black text-white">Awards & Accolades</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AWARDS.map((award, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-5 text-center hover:border-white/20 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <award.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{award.title}</h3>
                <p className="text-xs text-white/40">{award.org}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press Kit ────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="section-container max-w-2xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="glass rounded-2xl p-8 text-center">
            <Download className="w-10 h-10 text-violet-400 mx-auto mb-4" />
            <h2 className="text-xl font-black text-white mb-2">Press Kit</h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Download our press kit for logos, brand guidelines, founder photos, product screenshots, and company boilerplate.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:press@stayeo.com?subject=Press Kit Request"
                className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                <Download className="w-4 h-4" /> Request Press Kit
              </a>
              <a href="mailto:press@stayeo.com"
                className="btn-secondary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                <Mail className="w-4 h-4" /> Contact PR Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PressPage;
