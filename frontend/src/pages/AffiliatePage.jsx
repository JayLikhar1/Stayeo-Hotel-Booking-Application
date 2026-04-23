import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Link2, TrendingUp, Users, CreditCard, CheckCircle,
  ArrowRight, Copy, Share2, DollarSign, BarChart3, Zap, Shield
} from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

const HOW_IT_WORKS = [
  { step: '01', icon: Link2,      title: 'Get Your Link',       desc: 'Sign up and get a unique affiliate link instantly. No approval wait.' },
  { step: '02', icon: Share2,     title: 'Share Anywhere',      desc: 'Share on your blog, YouTube, Instagram, WhatsApp, or email newsletter.' },
  { step: '03', icon: Users,      title: 'Travelers Book',      desc: 'When someone clicks your link and completes a booking, it\'s tracked automatically.' },
  { step: '04', icon: CreditCard, title: 'You Earn',            desc: 'Earn up to 5% commission on every confirmed booking. Paid monthly to your bank.' },
];

const TIERS = [
  { name: 'Starter',    bookings: '0–10/mo',   commission: '3%',  bonus: '—',       color: 'from-slate-500 to-gray-600' },
  { name: 'Silver',     bookings: '11–50/mo',  commission: '4%',  bonus: '₹500/mo', color: 'from-blue-500 to-cyan-600' },
  { name: 'Gold',       bookings: '51–100/mo', commission: '4.5%',bonus: '₹2,000/mo',color: 'from-amber-500 to-yellow-500' },
  { name: 'Platinum',   bookings: '100+/mo',   commission: '5%',  bonus: '₹5,000/mo',color: 'from-violet-500 to-purple-600' },
];

const TOOLS = [
  { icon: Link2,    title: 'Deep Links',         desc: 'Link directly to any hotel, city, or search result page.' },
  { icon: BarChart3,title: 'Real-Time Dashboard', desc: 'Track clicks, conversions, and earnings in real time.' },
  { icon: Zap,      title: 'Banner Ads',          desc: 'Ready-made banners in all sizes for your website or blog.' },
  { icon: Shield,   title: '90-Day Cookie',       desc: 'Earn commission even if the traveler books 90 days after clicking.' },
];

const FAQS = [
  { q: 'When do I get paid?', a: 'Commissions are paid on the 15th of every month for bookings confirmed in the previous month. Minimum payout is ₹500.' },
  { q: 'What counts as a confirmed booking?', a: 'A booking where payment is successfully completed via StayEo. Cancelled bookings are not counted.' },
  { q: 'Is there a cost to join?', a: 'No. The StayEo Affiliate Program is completely free to join.' },
  { q: 'Can I promote on social media?', a: 'Yes — Instagram, YouTube, Facebook, Twitter, WhatsApp, and any other platform. Just follow our brand guidelines.' },
  { q: 'How long does the cookie last?', a: '90 days. If a user clicks your link and books within 90 days, you earn the commission.' },
  { q: 'Is there a cap on earnings?', a: 'No cap. The more you refer, the more you earn. Our top affiliates earn ₹50,000+ per month.' },
];

const AffiliatePage = () => {
  const { success } = useToastStore();
  const [form, setForm] = useState({ name: '', email: '', website: '', audience: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://stayeo.com?ref=YOUR_CODE');
    success('Sample link copied!');
  };

  return (
    <div className="min-h-screen pt-20 pb-16 overflow-hidden">
      {/* Hero */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Gift className="w-4 h-4" /> Affiliate Program
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Earn up to <span className="gradient-text">5% commission</span><br />on every booking
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg text-white/50 max-w-xl mx-auto mb-8">
            Share StayEo with your audience and earn real money every time someone books a hotel through your link.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-6 text-sm text-white/40 mb-10">
            {['Free to Join', '90-Day Cookie', 'Monthly Payouts', 'No Earning Cap'].map(s => (
              <span key={s} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />{s}
              </span>
            ))}
          </motion.div>

          {/* Sample link preview */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="inline-flex items-center gap-3 glass px-5 py-3 rounded-xl max-w-sm mx-auto">
            <span className="text-sm text-white/50 truncate flex-1">stayeo.com?ref=YOUR_CODE</span>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">How it works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-violet-500/30" />
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-glow-sm">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs text-violet-400 font-bold mb-1">STEP {s.step}</p>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-16">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2">Commission Tiers</h2>
            <p className="text-white/40">The more you refer, the more you earn.</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {TIERS.map((tier, i) => (
              <motion.div key={tier.name} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-5 text-center hover:border-white/20 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-bold text-white mb-1">{tier.name}</p>
                <p className="text-2xl font-black gradient-text mb-1">{tier.commission}</p>
                <p className="text-xs text-white/40 mb-2">{tier.bookings}</p>
                {tier.bonus !== '—' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    +{tier.bonus} bonus
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-3xl font-black text-white">Everything you need to succeed</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TOOLS.map((tool, i) => (
              <motion.div key={tool.title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-5 hover:border-white/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3 group-hover:bg-violet-500/30 transition-colors">
                  <tool.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{tool.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="section-container max-w-2xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <span className={`text-white/40 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-white/5 pt-3">
                    <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container max-w-xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Join the program</h2>
            <p className="text-white/40">Free to join. Start earning in minutes.</p>
          </motion.div>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-10 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-white/50">We'll send your affiliate link to <span className="text-violet-400">{form.email}</span> within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="glass rounded-2xl p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name" className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com" className="input-dark text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Website / Channel URL</label>
                <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="https://yourblog.com or youtube.com/..." className="input-dark text-sm" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Your Audience</label>
                <select value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
                  className="input-dark text-sm">
                  <option value="" className="bg-dark-900">Select audience type...</option>
                  {['Travel Blogger', 'YouTuber', 'Instagram Influencer', 'Corporate Travel Manager', 'Wedding Planner', 'Other'].map(a => (
                    <option key={a} value={a} className="bg-dark-900">{a}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" /> Apply Now — It's Free
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
};

export default AffiliatePage;
