import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Users, Copy, Share2, CheckCircle, ArrowRight,
  Mail, MessageCircle, Twitter, Smartphone, IndianRupee
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

const HOW_IT_WORKS = [
  { step: '01', title: 'Get Your Code',    desc: 'Sign in to get your unique referral code. Every account gets one automatically.' },
  { step: '02', title: 'Share with Friends', desc: 'Share your code via WhatsApp, email, or social media. No limit on how many friends you can refer.' },
  { step: '03', title: 'Friend Books',     desc: 'Your friend signs up using your code and completes their first booking on StayEo.' },
  { step: '04', title: 'Both Earn ₹500',  desc: 'You get ₹500 in StayEo credits. Your friend gets ₹500 off their first booking. Win-win.' },
];

const FAQS = [
  { q: 'When do I receive my ₹500 credit?', a: 'Credits are added to your account within 24 hours of your friend completing their first booking.' },
  { q: 'Is there a limit on how many friends I can refer?', a: 'No limit! Refer 10 friends, earn ₹5,000. Refer 100 friends, earn ₹50,000. The sky\'s the limit.' },
  { q: 'Can my friend use the ₹500 on any hotel?', a: 'Yes — the ₹500 discount applies to any hotel booking on StayEo with a minimum booking value of ₹2,000.' },
  { q: 'Do credits expire?', a: 'Credits are valid for 12 months from the date they are issued.' },
  { q: 'What if my friend already has an account?', a: 'The referral only counts for new accounts. Your friend must sign up using your referral link or code.' },
  { q: 'Can I use my own referral code?', a: 'No — referral codes are for new users only and cannot be applied to your own account.' },
];

const ReferPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { success, info } = useToastStore();
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Generate a deterministic referral code from user ID
  const referralCode = isAuthenticated
    ? `STAY${user?._id?.slice(-6).toUpperCase() || 'XXXXXX'}`
    : 'STAYXXXXXX';

  const referralLink = `https://stayeo.com/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    success('Referral link copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleEmailInvite = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setEmailSent(true);
    success(`Invite sent to ${emailInput}!`);
    setEmailInput('');
    setTimeout(() => setEmailSent(false), 4000);
  };

  const shareVia = (platform) => {
    const msg = `Hey! I've been using StayEo to book hotels across India — it's amazing. Use my code ${referralCode} to get ₹500 off your first booking! ${referralLink}`;
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(msg)}`,
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,
      email:    `mailto:?subject=Get ₹500 off your first hotel booking!&body=${encodeURIComponent(msg)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen pt-20 pb-16 overflow-hidden">
      {/* Hero */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Gift className="w-4 h-4" /> Refer & Earn
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Give <span className="gradient-text">₹500</span>, Get <span className="gradient-text">₹500</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg text-white/50 max-w-xl mx-auto mb-10">
            Refer a friend to StayEo. They get ₹500 off their first booking. You get ₹500 in credits. No limits, no expiry games.
          </motion.p>

          {/* Referral Card */}
          {isAuthenticated ? (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="max-w-lg mx-auto glass rounded-2xl p-6 shadow-glow-sm">
              <p className="text-xs text-white/40 mb-2">Your Referral Code</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl font-black tracking-widest gradient-text">{referralCode}</span>
              </div>
              <div className="flex items-center gap-2 bg-dark-800/50 rounded-xl px-4 py-3 mb-4">
                <span className="text-sm text-white/50 flex-1 truncate">{referralLink}</span>
                <button onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                    copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                  }`}>
                  {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => shareVia('whatsapp')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all text-sm font-medium">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button onClick={() => shareVia('twitter')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-all text-sm font-medium">
                  <Twitter className="w-4 h-4" /> Twitter
                </button>
                <button onClick={() => shareVia('email')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-all text-sm font-medium">
                  <Mail className="w-4 h-4" /> Email
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="max-w-sm mx-auto glass rounded-2xl p-6 text-center">
              <Gift className="w-10 h-10 text-violet-400 mx-auto mb-3" />
              <p className="text-white/60 mb-4">Sign in to get your personal referral code and start earning.</p>
              <Link to="/login" className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
                Sign In to Get Code <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-dark-900/30">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: '₹500',   label: 'You Earn',           icon: IndianRupee, color: 'text-violet-400' },
              { value: '₹500',   label: 'Friend Saves',       icon: Gift,        color: 'text-emerald-400' },
              { value: '∞',      label: 'No Referral Limit',  icon: Users,       color: 'text-blue-400' },
              { value: '12mo',   label: 'Credit Validity',    icon: CheckCircle, color: 'text-amber-400' },
            ].map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-5 text-center">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-black gradient-text mb-1">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
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
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} className="text-center">
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

      {/* Email invite */}
      {isAuthenticated && (
        <section className="py-10 bg-dark-900/30">
          <div className="section-container max-w-lg">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="glass rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-400" /> Invite by Email
              </h3>
              <form onSubmit={handleEmailInvite} className="flex gap-2">
                <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                  placeholder="friend@example.com" className="input-dark text-sm flex-1" />
                <button type="submit"
                  className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 flex-shrink-0">
                  {emailSent ? <><CheckCircle className="w-4 h-4" /> Sent!</> : <>Send Invite</>}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16">
        <div className="section-container max-w-2xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-3xl font-black text-white">Questions?</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <span className={`text-white/40 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
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
    </div>
  );
};

export default ReferPage;
