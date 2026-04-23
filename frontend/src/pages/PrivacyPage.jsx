import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
};

const SECTIONS = [
  {
    id: 1,
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us and information generated through your use of StayEo.

**Information you provide:**
- Account information: name, email address, phone number, and password when you register
- Profile information: profile photo, preferences, and communication settings
- Booking information: check-in/check-out dates, guest details, special requests, and payment information
- Communications: messages you send to us via support, email, or feedback forms

**Information collected automatically:**
- Usage data: pages visited, features used, search queries, and booking history
- Device information: IP address, browser type, operating system, and device identifiers
- Location data: city-level location inferred from IP address (we do not collect precise GPS location without explicit consent)
- Cookies and similar tracking technologies (see Section 6)

**Information from third parties:**
- Payment processors (Razorpay) provide transaction confirmation and fraud signals
- Social login providers (if you choose to sign in via Google or similar) provide basic profile information`,
  },
  {
    id: 2,
    title: '2. How We Use Your Information',
    content: `We use the information we collect to provide, improve, and personalise the StayEo experience.

**Core service delivery:**
- Process and confirm hotel bookings
- Send booking confirmations, receipts, and pre-stay reminders
- Handle payment processing and fraud prevention
- Provide customer support and resolve disputes

**Personalisation & recommendations:**
- Suggest hotels based on your search history and preferences
- Customise search results and featured properties
- Send relevant promotional offers (only with your consent)

**Platform improvement:**
- Analyse usage patterns to improve features and fix bugs
- Conduct A/B testing to optimise the user experience
- Train and improve our AI recommendation models using anonymised data

**Legal & safety:**
- Comply with applicable Indian laws and regulations
- Detect and prevent fraud, abuse, and security incidents
- Enforce our Terms of Service`,
  },
  {
    id: 3,
    title: '3. How We Share Your Information',
    content: `We do not sell your personal information. We share it only in the following circumstances:

**Hotel partners:**
When you make a booking, we share your name, contact details, and booking details with the relevant hotel to fulfil your reservation. Hotels are contractually required to handle this data in accordance with applicable privacy laws.

**Payment processors:**
We share payment information with Razorpay to process transactions. Razorpay's privacy policy governs their use of this data.

**Service providers:**
We work with trusted third-party vendors for cloud hosting (AWS), email delivery (Nodemailer), analytics, and customer support tools. These vendors process data only on our behalf and under strict data processing agreements.

**Legal requirements:**
We may disclose information if required by law, court order, or government authority, or to protect the rights, property, or safety of StayEo, our users, or the public.

**Business transfers:**
In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of that transaction. We will notify you before your information is transferred and becomes subject to a different privacy policy.`,
  },
  {
    id: 4,
    title: '4. Data Retention',
    content: `We retain your personal information for as long as necessary to provide our services and comply with legal obligations.

**Account data:** Retained for the duration of your account and for 3 years after account deletion, to comply with tax and financial record-keeping requirements under Indian law.

**Booking records:** Retained for 7 years from the date of the booking to comply with the Information Technology Act, 2000 and GST regulations.

**Payment data:** We do not store full card numbers. Transaction records are retained for 7 years as required by financial regulations.

**Marketing data:** Retained until you withdraw consent or unsubscribe, whichever comes first.

**Support communications:** Retained for 2 years from the date of resolution.

You may request deletion of your account and associated data at any time by contacting privacy@stayeo.com. Note that some data may be retained for legal compliance even after account deletion.`,
  },
  {
    id: 5,
    title: '5. Your Rights & Choices',
    content: `Under the Digital Personal Data Protection Act, 2023 (DPDPA) and applicable Indian privacy laws, you have the following rights:

**Right to access:** Request a copy of the personal data we hold about you.

**Right to correction:** Request correction of inaccurate or incomplete personal data.

**Right to erasure:** Request deletion of your personal data, subject to legal retention requirements.

**Right to data portability:** Request your data in a structured, machine-readable format.

**Right to withdraw consent:** Withdraw consent for marketing communications at any time via account settings or by clicking "unsubscribe" in any email.

**Right to grievance redressal:** Lodge a complaint with our Data Protection Officer.

**How to exercise your rights:**
Email privacy@stayeo.com with the subject line "Privacy Request" and your registered email address. We will respond within 30 days. For urgent matters, call our support line at +91 1800-STAYEO.`,
  },
  {
    id: 6,
    title: '6. Cookies & Tracking',
    content: `We use cookies and similar technologies to operate and improve StayEo.

**Essential cookies:** Required for the platform to function (authentication, session management, security). Cannot be disabled.

**Analytics cookies:** Help us understand how users interact with StayEo (page views, feature usage, error tracking). We use anonymised data only.

**Preference cookies:** Remember your settings such as language, currency, and search filters.

**Marketing cookies:** Used to show relevant ads on third-party platforms. Only activated with your explicit consent.

**Managing cookies:**
You can control cookies through your browser settings. Note that disabling essential cookies will prevent you from using core features like booking and account management.

We do not use cookies to track you across unrelated websites or sell cookie data to third parties.`,
  },
  {
    id: 7,
    title: '7. Data Security',
    content: `We implement industry-standard security measures to protect your personal information.

**Technical safeguards:**
- All data transmitted between your browser and our servers is encrypted using TLS 1.3
- Passwords are hashed using bcrypt with a cost factor of 12 — we never store plaintext passwords
- Payment data is processed by Razorpay and never stored on our servers
- JWT tokens are signed with a 256-bit secret and expire after 7 days
- Database access is restricted to authorised personnel via role-based access controls

**Organisational safeguards:**
- Regular security audits and penetration testing
- Employee training on data handling and privacy best practices
- Incident response plan for data breaches

**In the event of a breach:**
We will notify affected users and relevant authorities within 72 hours of becoming aware of a data breach, as required by applicable law.

No system is 100% secure. If you discover a security vulnerability, please report it responsibly to security@stayeo.com.`,
  },
  {
    id: 8,
    title: '8. Children\'s Privacy',
    content: `StayEo is not directed at children under the age of 18. We do not knowingly collect personal information from minors.

If you are a parent or guardian and believe your child has provided us with personal information, please contact privacy@stayeo.com immediately. We will promptly delete such information from our systems.

Users must be at least 18 years old to create an account and make bookings on StayEo.`,
  },
  {
    id: 9,
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.

When we make material changes, we will:
- Update the "Last Updated" date at the top of this page
- Send an email notification to registered users
- Display a prominent notice on the StayEo platform for 30 days

Your continued use of StayEo after the effective date of the updated policy constitutes your acceptance of the changes. If you do not agree with the updated policy, you may delete your account.`,
  },
  {
    id: 10,
    title: '10. Contact & Grievance Officer',
    content: `For any privacy-related questions, requests, or complaints, contact our Data Protection Officer:

**Data Protection Officer**
StayEo Technologies Pvt. Ltd.
Email: privacy@stayeo.com
Phone: +91 1800-STAYEO (Mon–Fri, 9 AM–6 PM IST)
Address: 4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru – 560103, Karnataka, India

**Grievance Redressal:**
If you are not satisfied with our response, you may escalate your complaint to the Data Protection Board of India once it is constituted under the DPDPA, 2023.

We aim to acknowledge all privacy requests within 48 hours and resolve them within 30 days.`,
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
        return <li key={i} className="text-sm text-white/50 ml-4 leading-relaxed">{line.slice(2)}</li>;
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

const PrivacyPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
        <div className="section-container text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Shield className="w-4 h-4" /> Privacy Policy
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl md:text-5xl font-black text-white mb-4">
            Your Privacy, <span className="gradient-text">Our Responsibility</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/50 max-w-xl mx-auto leading-relaxed mb-4">
            We believe privacy is a right, not a feature. This policy explains exactly what data we collect, why we collect it, and how you can control it.
          </motion.p>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="text-xs text-white/30">
            Last updated: April 23, 2025 · Effective: April 23, 2025
          </motion.p>
        </div>
      </section>

      {/* Quick summary */}
      <section className="pb-8">
        <div className="section-container max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-bold text-violet-300 mb-3">TL;DR — The Short Version</h2>
            <ul className="space-y-2">
              {[
                'We collect only what we need to run the booking platform.',
                'We never sell your personal data to third parties.',
                'Your payment data is handled by Razorpay — we never store card numbers.',
                'You can access, correct, or delete your data at any time.',
                'We use industry-standard encryption and security practices.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Accordion sections */}
          <div className="space-y-3">
            {SECTIONS.map((section, i) => (
              <AccordionItem key={section.id} section={section} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
