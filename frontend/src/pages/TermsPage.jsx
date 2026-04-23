import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, AlertTriangle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
};

const SECTIONS = [
  {
    id: 1,
    title: '1. Acceptance of Terms',
    content: `By accessing or using StayEo (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Platform.

These Terms constitute a legally binding agreement between you and StayEo Technologies Pvt. Ltd. ("StayEo", "we", "us", or "our"), a company incorporated under the Companies Act, 2013, with its registered office at Bengaluru, Karnataka, India.

We reserve the right to modify these Terms at any time. Material changes will be communicated via email and a notice on the Platform. Your continued use after the effective date of changes constitutes acceptance.

These Terms are governed by the laws of India, including the Information Technology Act, 2000, the Consumer Protection Act, 2019, and the Digital Personal Data Protection Act, 2023.`,
  },
  {
    id: 2,
    title: '2. Eligibility & Account Registration',
    content: `**Eligibility:**
- You must be at least 18 years of age to use StayEo
- You must have the legal capacity to enter into binding contracts under Indian law
- You must not be barred from using the Platform under applicable law

**Account Registration:**
- You must provide accurate, current, and complete information during registration
- You are responsible for maintaining the confidentiality of your account credentials
- You must notify us immediately at support@stayeo.com if you suspect unauthorised access to your account
- You may not create multiple accounts or transfer your account to another person
- We reserve the right to suspend or terminate accounts that violate these Terms

**One Account Per Person:**
Each individual may maintain only one active account. Creating duplicate accounts may result in permanent suspension of all associated accounts.`,
  },
  {
    id: 3,
    title: '3. Booking & Reservations',
    content: `**Making a Booking:**
When you make a booking through StayEo, you enter into a direct contract with the hotel ("Hotel Partner"). StayEo acts as an intermediary platform and is not a party to the accommodation contract.

**Booking Confirmation:**
A booking is confirmed only upon successful payment and receipt of a confirmation email from StayEo. Pending bookings are not guaranteed.

**Accuracy of Information:**
You are responsible for ensuring all booking details (dates, guest names, room type, special requests) are accurate. StayEo is not liable for losses arising from incorrect information provided by you.

**Availability:**
Hotel availability is subject to change. In the rare event that a confirmed booking cannot be honoured by the hotel, StayEo will assist in finding alternative accommodation of equal or higher standard, or provide a full refund.

**Check-in Requirements:**
Guests must present a valid government-issued photo ID at check-in. Hotels may refuse check-in if valid ID is not presented. StayEo is not liable for refused check-ins due to missing documentation.`,
  },
  {
    id: 4,
    title: '4. Pricing & Payments',
    content: `**Pricing:**
All prices displayed on StayEo are in Indian Rupees (INR) and include applicable taxes (GST) unless stated otherwise. Prices are subject to change until a booking is confirmed.

**Payment Processing:**
Payments are processed by Razorpay, a PCI-DSS compliant payment gateway. By making a payment, you agree to Razorpay's terms of service. StayEo does not store your card details.

**Payment Failure:**
If a payment fails after a booking is initiated, the booking will not be confirmed. Any amount debited will be refunded to your original payment method within 5–7 business days.

**GST:**
All bookings are subject to Goods and Services Tax (GST) as applicable under Indian law. GST invoices are available in your booking history.

**Dynamic Pricing:**
Hotel prices may vary based on demand, seasonality, and availability. The price shown at the time of booking confirmation is the final price.

**No Hidden Fees:**
The total amount shown at checkout is the final amount charged. There are no additional booking fees or service charges added by StayEo.`,
  },
  {
    id: 5,
    title: '5. Cancellation & Refund Policy',
    content: `**Standard Cancellation Policy:**
Most hotels on StayEo offer free cancellation up to 24 hours before check-in. The specific cancellation policy for each booking is displayed on the hotel detail page and booking confirmation.

**How to Cancel:**
Cancel bookings through your "My Bookings" page or by contacting support@stayeo.com. Cancellations must be made before the hotel's stated deadline.

**Refund Processing:**
- Free cancellations: Full refund within 5–7 business days to original payment method
- Partial refunds (where applicable): Processed within 7–10 business days
- Non-refundable bookings: No refund will be issued

**No-Show Policy:**
If you fail to check in without cancelling, the booking will be treated as a no-show. No-show charges are determined by the hotel's policy and may result in forfeiture of the full booking amount.

**Force Majeure:**
In cases of natural disasters, government-mandated travel restrictions, or other force majeure events, StayEo will work with hotel partners to offer flexible cancellation or rescheduling options.

**Disputes:**
If you believe a refund has been incorrectly processed, contact support@stayeo.com within 30 days of the cancellation.`,
  },
  {
    id: 6,
    title: '6. User Conduct & Prohibited Activities',
    content: `You agree not to use StayEo for any unlawful or prohibited purpose. Specifically, you must not:

**Account & Platform Abuse:**
- Create fake accounts or impersonate any person or entity
- Use automated tools, bots, or scrapers to access the Platform
- Attempt to gain unauthorised access to any part of the Platform or its systems
- Interfere with or disrupt the Platform's infrastructure

**Booking Abuse:**
- Make speculative, false, or fraudulent bookings
- Book hotels with no intention of staying (blocking inventory)
- Use stolen or unauthorised payment methods
- Attempt to circumvent the Platform to book directly with hotels after discovery

**Content Violations:**
- Post false, misleading, or defamatory reviews
- Upload content that infringes intellectual property rights
- Share content that is obscene, hateful, or violates applicable law

**Commercial Misuse:**
- Resell or sublicense access to the Platform
- Use StayEo data for commercial purposes without written permission

Violation of these rules may result in immediate account suspension, cancellation of bookings, and legal action where appropriate.`,
  },
  {
    id: 7,
    title: '7. Reviews & User Content',
    content: `**Submitting Reviews:**
You may submit reviews for hotels you have stayed at through StayEo. By submitting a review, you grant StayEo a non-exclusive, royalty-free, perpetual licence to display, reproduce, and distribute the review on the Platform.

**Review Standards:**
Reviews must be honest, based on your personal experience, and comply with our community guidelines. We reserve the right to remove reviews that are:
- Fake, incentivised, or submitted by someone who did not stay at the hotel
- Defamatory, abusive, or in violation of applicable law
- Irrelevant to the hotel experience (e.g., complaints about booking process)

**Responsibility:**
You are solely responsible for the content you submit. StayEo does not endorse any user-submitted content and is not liable for any claims arising from it.

**Hotel Responses:**
Hotels may respond to reviews. StayEo does not edit or moderate hotel responses but reserves the right to remove responses that violate our guidelines.`,
  },
  {
    id: 8,
    title: '8. Intellectual Property',
    content: `**StayEo's IP:**
All content on the Platform — including the StayEo name, logo, design, software, text, images, and data — is owned by or licensed to StayEo Technologies Pvt. Ltd. and is protected by Indian and international intellectual property laws.

**Permitted Use:**
You may access and use the Platform for personal, non-commercial purposes only. You may not copy, reproduce, distribute, modify, or create derivative works from any Platform content without our prior written consent.

**Your Content:**
You retain ownership of content you submit (reviews, photos). By submitting content, you grant StayEo a licence to use it as described in Section 7.

**Feedback:**
If you provide feedback or suggestions about the Platform, you grant StayEo the right to use that feedback without restriction or compensation.

**DMCA / Copyright Complaints:**
If you believe content on the Platform infringes your copyright, contact legal@stayeo.com with details of the alleged infringement.`,
  },
  {
    id: 9,
    title: '9. Limitation of Liability',
    content: `**Platform as Intermediary:**
StayEo is a technology platform that connects travelers with hotel partners. We are not responsible for the quality, safety, or legality of hotels listed on the Platform, or for the accuracy of hotel descriptions and photos provided by hotel partners.

**Limitation:**
To the maximum extent permitted by applicable Indian law, StayEo's total liability to you for any claim arising from your use of the Platform shall not exceed the amount paid by you for the specific booking giving rise to the claim.

**Exclusions:**
StayEo is not liable for:
- Indirect, incidental, special, or consequential damages
- Loss of profits, data, or goodwill
- Damages arising from hotel service failures, property damage, or personal injury during your stay
- Force majeure events beyond our reasonable control

**Consumer Rights:**
Nothing in these Terms limits your rights under the Consumer Protection Act, 2019 or other applicable Indian consumer protection laws.`,
  },
  {
    id: 10,
    title: '10. Governing Law & Dispute Resolution',
    content: `**Governing Law:**
These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles.

**Dispute Resolution:**
In the event of a dispute, we encourage you to first contact our support team at support@stayeo.com. We aim to resolve most disputes within 15 business days.

**Arbitration:**
If a dispute cannot be resolved through our support process, it shall be referred to arbitration under the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in Bengaluru, Karnataka, in the English language, before a sole arbitrator mutually agreed upon by the parties.

**Consumer Forum:**
Nothing in this clause prevents you from approaching the appropriate Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019.

**Jurisdiction:**
For matters not subject to arbitration, the courts of Bengaluru, Karnataka shall have exclusive jurisdiction.

**Class Action Waiver:**
You agree to resolve disputes with StayEo on an individual basis and waive any right to participate in class action proceedings.`,
  },
  {
    id: 11,
    title: '11. Contact Information',
    content: `For any questions about these Terms of Service, contact us:

**StayEo Technologies Pvt. Ltd.**
Email: legal@stayeo.com
Support: support@stayeo.com
Phone: +91 1800-STAYEO (Mon–Fri, 9 AM–6 PM IST)
Address: 4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru – 560103, Karnataka, India

**Grievance Officer (as per IT Act, 2000):**
Name: Arjun Mehta
Email: grievance@stayeo.com
Response time: Within 24 hours of receipt

These Terms were last updated on April 23, 2025.`,
  },
];

const AccordionItem = ({ section, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="text-sm font-semibold text-white mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-sm text-white/50 ml-4 leading-relaxed list-none flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />{line.slice(2)}
        </li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-sm text-white/50 leading-relaxed">{line}</p>;
    });
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible"
      viewport={{ once: true }} custom={index}
      className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-white">{section.title}</h3>
        <ChevronDown className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <div className="px-6 pb-6 border-t border-white/5 pt-4 space-y-1">
              {renderContent(section.content)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TermsPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <FileText className="w-4 h-4" /> Terms of Service
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl md:text-5xl font-black text-white mb-4">
            Terms of <span className="gradient-text">Service</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/50 max-w-xl mx-auto leading-relaxed mb-4">
            Please read these terms carefully before using StayEo. They govern your use of our platform and the bookings you make through it.
          </motion.p>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="text-xs text-white/30">
            Last updated: April 23, 2025 · Effective: April 23, 2025
          </motion.p>
        </div>
      </section>

      <section className="pb-16">
        <div className="section-container max-w-3xl">
          {/* Important notice */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300 mb-1">Important</p>
              <p className="text-sm text-amber-300/70 leading-relaxed">
                By creating an account or making a booking on StayEo, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.
              </p>
            </div>
          </motion.div>

          {/* Accordion */}
          <div className="space-y-3">
            {SECTIONS.map((section, i) => (
              <AccordionItem key={section.id} section={section} index={i} />
            ))}
          </div>

          {/* Footer note */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-8 text-center">
            <p className="text-sm text-white/30">
              Questions about these terms?{' '}
              <a href="mailto:legal@stayeo.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                legal@stayeo.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
