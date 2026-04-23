import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ChevronDown, ArrowRight, Zap, Heart, Globe, Users, Coffee, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const PERKS = [
  { icon: Laptop,  title: 'Remote-First',       desc: 'Work from anywhere in India. We care about output, not office hours.' },
  { icon: Heart,   title: 'Health Coverage',     desc: 'Comprehensive medical, dental, and mental health insurance for you and your family.' },
  { icon: Zap,     title: 'Learning Budget',     desc: '₹50,000/year for courses, books, conferences — invest in yourself.' },
  { icon: Globe,   title: 'Travel Perks',        desc: 'Free stays at partner hotels. Because we believe in experiencing what we build.' },
  { icon: Coffee,  title: 'Flexible Hours',      desc: 'Async-friendly culture. Own your schedule, deliver great work.' },
  { icon: Users,   title: 'Equity for All',      desc: 'Every full-time employee gets ESOPs. We grow together.' },
];

const JOBS = [
  {
    id: 1,
    title: 'Senior Full-Stack Engineer',
    dept: 'Engineering',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    experience: '4–7 years',
    description: 'We\'re looking for a senior engineer to own critical parts of our booking infrastructure. You\'ll work across React, Node.js, and MongoDB to build features used by thousands of travelers daily.',
    responsibilities: [
      'Design and build scalable backend APIs using Node.js and Express',
      'Develop performant React frontends with a focus on UX',
      'Collaborate with design and product to ship features end-to-end',
      'Mentor junior engineers and contribute to technical decisions',
      'Improve system reliability, performance, and observability',
    ],
    requirements: [
      '4+ years of full-stack development experience',
      'Strong proficiency in React 18, Node.js, MongoDB',
      'Experience with payment integrations (Razorpay, Stripe)',
      'Familiarity with cloud platforms (AWS/GCP)',
      'Excellent communication and ownership mindset',
    ],
  },
  {
    id: 2,
    title: 'Product Designer (UI/UX)',
    dept: 'Design',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    experience: '3–5 years',
    description: 'Join our design team to craft beautiful, intuitive experiences for millions of Indian travelers. You\'ll own the end-to-end design process from research to pixel-perfect delivery.',
    responsibilities: [
      'Lead UX research, user interviews, and usability testing',
      'Create wireframes, prototypes, and high-fidelity designs in Figma',
      'Build and maintain our design system',
      'Collaborate closely with engineering to ensure pixel-perfect implementation',
      'Define and track design metrics and success criteria',
    ],
    requirements: [
      '3+ years of product design experience',
      'Expert-level Figma skills',
      'Strong portfolio demonstrating mobile and web design',
      'Experience with design systems and component libraries',
      'Passion for travel and hospitality products',
    ],
  },
  {
    id: 3,
    title: 'Growth Marketing Manager',
    dept: 'Marketing',
    location: 'Mumbai / Remote',
    type: 'Full-time',
    experience: '3–6 years',
    description: 'Drive StayEo\'s user acquisition and retention strategy. You\'ll own performance marketing, SEO, and lifecycle campaigns to grow our traveler base across India.',
    responsibilities: [
      'Plan and execute paid campaigns across Google, Meta, and travel platforms',
      'Own SEO strategy and content marketing roadmap',
      'Build and optimize email and push notification campaigns',
      'Analyze funnel metrics and run A/B experiments',
      'Collaborate with product to improve conversion rates',
    ],
    requirements: [
      '3+ years in growth or performance marketing',
      'Hands-on experience with Google Ads, Meta Ads, and analytics tools',
      'Strong analytical skills and data-driven mindset',
      'Experience in travel, e-commerce, or marketplace businesses preferred',
      'Excellent written communication skills',
    ],
  },
  {
    id: 4,
    title: 'Hotel Partnerships Manager',
    dept: 'Business Development',
    location: 'Delhi / Mumbai / Bengaluru',
    type: 'Full-time',
    experience: '2–5 years',
    description: 'Expand StayEo\'s hotel network by onboarding and managing relationships with premium properties across India. You\'ll be the face of StayEo to our hotel partners.',
    responsibilities: [
      'Identify, pitch, and onboard new hotel partners across Tier-1, 2, and 3 cities',
      'Negotiate commercial terms and partnership agreements',
      'Manage ongoing relationships with existing hotel partners',
      'Work with the product team to improve the partner experience',
      'Represent StayEo at hospitality industry events',
    ],
    requirements: [
      '2+ years in hospitality, travel, or B2B sales',
      'Strong network in the Indian hotel industry preferred',
      'Excellent negotiation and relationship management skills',
      'Willingness to travel frequently across India',
      'Self-starter with a hunter mentality',
    ],
  },
  {
    id: 5,
    title: 'Data Analyst',
    dept: 'Data & Analytics',
    location: 'Remote',
    type: 'Full-time',
    experience: '2–4 years',
    description: 'Turn StayEo\'s data into insights that drive product and business decisions. You\'ll work with engineering, product, and marketing to build dashboards, run analyses, and surface opportunities.',
    responsibilities: [
      'Build and maintain dashboards in Metabase / Looker',
      'Analyze booking funnels, user behavior, and revenue metrics',
      'Run A/B test analyses and present findings to stakeholders',
      'Partner with engineering to instrument new data pipelines',
      'Develop predictive models for demand forecasting',
    ],
    requirements: [
      '2+ years of data analysis experience',
      'Proficiency in SQL and Python (pandas, numpy)',
      'Experience with BI tools (Metabase, Looker, Tableau)',
      'Strong statistical knowledge',
      'Ability to communicate insights clearly to non-technical audiences',
    ],
  },
  {
    id: 6,
    title: 'Customer Experience Lead',
    dept: 'Operations',
    location: 'Bengaluru',
    type: 'Full-time',
    experience: '2–4 years',
    description: 'Be the champion for our guests. You\'ll lead a small team handling booking support, complaints, and feedback — ensuring every traveler has a seamless experience.',
    responsibilities: [
      'Manage and mentor a team of 3–5 CX associates',
      'Handle escalated guest complaints with empathy and speed',
      'Build SOPs and knowledge bases for the support team',
      'Analyze support tickets to identify product improvement opportunities',
      'Maintain CSAT scores above 4.5/5',
    ],
    requirements: [
      '2+ years in customer support or operations, preferably in travel/hospitality',
      'Strong empathy and problem-solving skills',
      'Experience with support tools (Freshdesk, Zendesk)',
      'Excellent written and verbal communication in English and Hindi',
      'Calm under pressure with a solutions-first mindset',
    ],
  },
];

const DEPT_COLORS = {
  Engineering: 'badge-purple',
  Design: 'badge-green',
  Marketing: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Business Development': 'badge-yellow',
  'Data & Analytics': 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  Operations: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
};

const JobCard = ({ job, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible"
      viewport={{ once: true }} custom={index}
      className="glass rounded-2xl overflow-hidden hover:border-white/20 transition-all">
      {/* Header */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`badge text-xs ${DEPT_COLORS[job.dept] || 'badge-purple'}`}>{job.dept}</span>
            <span className="badge bg-white/5 text-white/40 border border-white/10 text-xs">{job.type}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-violet-400" />{job.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-violet-400" />{job.experience}</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/40 flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <div className="px-6 pb-6 border-t border-white/5 pt-5 space-y-5">
              <p className="text-sm text-white/60 leading-relaxed">{job.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Responsibilities</h4>
                  <ul className="space-y-2">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href={`mailto:careers@stayeo.com?subject=Application: ${job.title}`}
                className="inline-flex items-center gap-2 btn-primary px-6 py-2.5 text-sm">
                Apply Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CareersPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const depts = ['All', ...new Set(JOBS.map(j => j.dept))];
  const filtered = activeFilter === 'All' ? JOBS : JOBS.filter(j => j.dept === activeFilter);

  return (
    <div className="min-h-screen pt-20 pb-16 overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Briefcase className="w-4 h-4" /> We're Hiring
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Build the future of<br />
            <span className="gradient-text">travel in India</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
            Join a team of passionate builders, designers, and travel enthusiasts working to make every hotel booking in India seamless, transparent, and delightful.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-violet-400" /> 40+ team members</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-violet-400" /> Bengaluru, Mumbai, Delhi & Remote</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-violet-400" /> Series A funded</span>
          </motion.div>
        </div>
      </section>

      {/* ── Perks ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-dark-900/30">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-2xl font-black text-white">Why StayEo?</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((perk, i) => (
              <motion.div key={perk.title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-white/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/30 transition-colors">
                  <perk.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{perk.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{perk.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ───────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="section-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white">Open Positions</h2>
              <p className="text-white/40 text-sm mt-1">{filtered.length} role{filtered.length !== 1 ? 's' : ''} available</p>
            </div>
            {/* Dept filter */}
            <div className="flex flex-wrap gap-2">
              {depts.map(d => (
                <button key={d} onClick={() => setActiveFilter(d)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    activeFilter === d
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {filtered.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </div>

          {/* General application */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-10 glass rounded-2xl p-8 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Don't see your role?</h3>
            <p className="text-white/50 text-sm mb-5">We're always looking for exceptional people. Send us your resume and tell us how you'd contribute.</p>
            <a href="mailto:careers@stayeo.com?subject=General Application"
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
              Send Open Application <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
