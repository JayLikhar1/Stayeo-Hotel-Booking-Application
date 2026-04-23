import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Hotel, Twitter, Instagram, Linkedin, Github, Youtube,
  Mail, Phone, MapPin, Shield, Award, Star,
  MessageCircle, ArrowRight, CheckCircle, ExternalLink,
  BookOpen, Users, Link2, Gift, FileText, AlertCircle,
  Clock, Zap, Heart, Building2
} from 'lucide-react';

// ─── Link list helper ─────────────────────────────────────────────────────────
const FooterLinks = ({ links }) => (
  <ul className="space-y-2.5">
    {links.map((link) => (
      <li key={link.label}>
        {link.external ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer"
            className="text-sm text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 group">
            {link.icon && <link.icon className="w-3.5 h-3.5 text-violet-400/60 group-hover:text-violet-400 transition-colors flex-shrink-0" />}
            {link.label}
            {link.external && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />}
          </a>
        ) : (
          <Link to={link.href}
            className="text-sm text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 group">
            {link.icon && <link.icon className="w-3.5 h-3.5 text-violet-400/60 group-hover:text-violet-400 transition-colors flex-shrink-0" />}
            {link.label}
            {link.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium">
                {link.badge}
              </span>
            )}
          </Link>
        )}
      </li>
    ))}
  </ul>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  // ── Link data ──────────────────────────────────────────────────────
  const exploreLinks = [
    { label: 'All Hotels',          href: '/hotels' },
    { label: 'Top Destinations',    href: '/hotels?featured=true',           icon: MapPin },
    { label: 'Last-Minute Deals',   href: '/hotels?sort=price',              icon: Zap,    badge: 'Hot' },
    { label: 'Weekend Getaways',    href: '/hotels?search=weekend',          icon: Clock },
    { label: 'Honeymoon Packages',  href: '/hotels?tags=Romantic',           icon: Heart },
    { label: 'Business Travel',     href: '/hotels?tags=Business',           icon: Building2 },
    { label: 'Luxury Collection',   href: '/hotels?category=Ultra-Luxury' },
    { label: 'Budget Friendly',     href: '/hotels?category=Budget' },
  ];

  const supportLinks = [
    { label: 'Help Center / FAQ',      href: '/help',              icon: MessageCircle },
    { label: 'Contact Us',             href: '/about#contact',     icon: Mail },
    { label: 'Report an Issue',        href: 'mailto:support@stayeo.com?subject=Issue Report', external: true, icon: AlertCircle },
    { label: 'Cancellation Policy',    href: '/terms#cancellation',icon: FileText },
    { label: 'Refund Status Tracker',  href: '/my-bookings',       icon: CheckCircle },
  ];

  const companyLinks = [
    { label: 'About Us',         href: '/about' },
    { label: 'Careers',          href: '/careers', badge: 'Hiring' },
    { label: 'Press',            href: '/press' },
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',    href: '/privacy#cookies' },
    { label: 'Refund Policy',    href: '/terms#refunds' },
  ];

  const communityLinks = [
    { label: 'Write a Review',       href: '/write-review',                                                        icon: Star },
    { label: 'Become a Partner',     href: '/partner',                                                             icon: Link2,  badge: 'B2B' },
    { label: 'Affiliate Program',    href: '/affiliate',                                                           icon: Gift },
    { label: 'Travel Blog',          href: '/blog',                                                                icon: BookOpen },
    { label: 'Refer a Friend',       href: '/refer',                                                               icon: Users,  badge: '₹500' },
  ];

  const MEDIA_LOGOS = [
    { name: 'Economic Times', short: 'ET',  gradient: 'from-orange-500 to-red-500' },
    { name: 'YourStory',      short: 'YS',  gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Inc42',          short: 'I42', gradient: 'from-violet-500 to-purple-600' },
    { name: 'TechCrunch',     short: 'TC',  gradient: 'from-green-500 to-emerald-500' },
  ];

  const SECURITY_BADGES = [
    { label: 'Razorpay Secured',  icon: Shield,  color: 'text-blue-400' },
    { label: 'SSL Certified',     icon: Shield,  color: 'text-emerald-400' },
    { label: 'PCI-DSS Compliant', icon: Shield,  color: 'text-violet-400' },
  ];

  return (
    <footer className="bg-dark-950 border-t border-white/5 mt-20">

      {/* ── Gradient divider ──────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      {/* ── Newsletter Banner ─────────────────────────────────────── */}
      <div className="border-b border-white/5 bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10">
        <div className="section-container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Get exclusive travel deals</h3>
              <p className="text-sm text-white/40">Join 25,000+ travelers. Unsubscribe anytime.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-dark py-2.5 text-sm flex-1 md:w-64"
              />
              <button type="submit"
                className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 flex-shrink-0">
                {subscribed ? (
                  <><CheckCircle className="w-4 h-4" /> Subscribed!</>
                ) : (
                  <>Subscribe <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ──────────────────────────────────────── */}
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand — spans 2 cols */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow-sm">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">StayEo</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              India's AI-enhanced hotel booking platform. Discover premium stays across 50+ cities — from Tier-1 metros to hidden Tier-3 gems.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5 mb-6">
              {[
                { Icon: Twitter,   href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
                { Icon: Youtube,   href: '#', label: 'YouTube' },
                { Icon: Github,    href: '#', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Contact */}
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5 text-sm text-white/40">
                <Mail className="w-4 h-4 text-violet-400 flex-shrink-0" />
                support@stayeo.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/40">
                <Phone className="w-4 h-4 text-violet-400 flex-shrink-0" />
                +91 1800-STAYEO (Toll Free)
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/40">
                <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                4th Floor, Prestige Tech Park,<br />Outer Ring Road, Bengaluru – 560103
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
              Explore
            </h4>
            <FooterLinks links={exploreLinks} />
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
              Support
            </h4>
            <FooterLinks links={supportLinks} />
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
              Company
            </h4>
            <FooterLinks links={companyLinks} />
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
              Community
            </h4>
            <FooterLinks links={communityLinks} />
          </div>
        </div>

        {/* ── As Seen In ──────────────────────────────────────────── */}
        <div className="border-t border-white/5 mt-12 pt-10">
          <p className="text-xs text-white/25 uppercase tracking-widest font-medium text-center mb-5">
            As Seen In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {MEDIA_LOGOS.map((m) => (
              <div key={m.name}
                className="flex items-center gap-2 glass px-4 py-2 rounded-xl hover:border-white/20 transition-all group cursor-default">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${m.gradient} flex items-center justify-center text-[10px] font-black text-white flex-shrink-0`}>
                  {m.short}
                </div>
                <span className="text-sm font-medium text-white/50 group-hover:text-white/70 transition-colors">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Awards ──────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {[
            { label: 'Best Travel Startup 2024',  org: 'India Startup Awards' },
            { label: 'Top 50 Startups to Watch',  org: 'Inc42 · 2024' },
            { label: 'Best UX in Travel',         org: 'Google Play · 2023' },
          ].map((award) => (
            <div key={award.label}
              className="flex items-center gap-2 glass px-4 py-2 rounded-xl border border-yellow-500/10 hover:border-yellow-500/20 transition-all group">
              <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors leading-none">
                  {award.label}
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">{award.org}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Security Badges ─────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {SECURITY_BADGES.map((badge) => (
            <div key={badge.label}
              className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 transition-colors">
              <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
              {badge.label}
            </div>
          ))}
        </div>

        {/* ── Legal & Compliance ──────────────────────────────────── */}
        <div className="border-t border-white/5 mt-10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Grievance Officer */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs font-semibold text-white/60 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                Grievance Officer (IT Act, 2000)
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                <span className="text-white/60 font-medium">Arjun Mehta</span> · grievance@stayeo.com<br />
                Response within 24 hours · Mon–Fri, 9 AM–6 PM IST
              </p>
            </div>

            {/* Company details */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs font-semibold text-white/60 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-violet-400" />
                Company Details
              </p>
              <p className="text-xs text-white/40 leading-relaxed space-y-0.5">
                <span className="block"><span className="text-white/50">CIN:</span> U63040KA2022PTC165432</span>
                <span className="block"><span className="text-white/50">GST:</span> 29AABCS1234A1Z5</span>
                <span className="block"><span className="text-white/50">Reg. Office:</span> Prestige Tech Park, Bengaluru – 560103</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────────────────── */}
        <div className="border-t border-white/5 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-xs text-white/25 text-center md:text-left">
              © {new Date().getFullYear()} StayEo Technologies Pvt. Ltd. All rights reserved.
              <span className="mx-2 text-white/10">·</span>
              Made with <Heart className="w-3 h-3 text-red-400 inline mx-0.5" /> in India
            </p>

            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {[
                { label: 'Privacy',  href: '/privacy' },
                { label: 'Terms',    href: '/terms' },
                { label: 'Cookies',  href: '/privacy#cookies' },
                { label: 'Refunds',  href: '/terms#refunds' },
                { label: 'Sitemap',  href: '/sitemap' },
              ].map((l) => (
                <Link key={l.label} to={l.href}
                  className="text-xs text-white/25 hover:text-white/50 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Powered by */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/20">Powered by</span>
              <span className="text-xs font-semibold gradient-text">AI + MERN Stack</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
