'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  FaSearch, FaList, FaHandshake, FaStar, FaUserPlus, 
  FaCheckCircle, FaBullhorn, FaTrophy, FaQuestionCircle
} from 'react-icons/fa';
import Link from 'next/link';
import ParticleBackground from '../components/ParticleBackground';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function HowItWorksPage() {
  const [activeAudience, setActiveAudience] = useState<'customers' | 'businesses'>('customers');

  const customerSteps = [
    {
      icon: FaSearch,
      number: 1,
      title: 'Search',
      description: 'Tell us what you need and where. Browse categories or search for specific services in your area.'
    },
    {
      icon: FaList,
      number: 2,
      title: 'Compare',
      description: 'Review profiles, ratings, and quotes. Check verified badges, read real customer reviews, and compare pricing.'
    },
    {
      icon: FaHandshake,
      number: 3,
      title: 'Book',
      description: 'Hire with confidence and pay securely. Request quotes, communicate directly, and book the right professional.'
    },
    {
      icon: FaStar,
      number: 4,
      title: 'Review',
      description: 'Share your experience. Rate your service and help others make informed decisions.'
    }
  ];

  const businessSteps = [
    {
      icon: FaUserPlus,
      number: 1,
      title: 'Register',
      description: 'Create your business profile in minutes. Add your services, pricing, coverage area, and business details.'
    },
    {
      icon: FaCheckCircle,
      number: 2,
      title: 'Get Verified',
      description: 'Upload your credentials. Submit proof of licensing, insurance, and trade certifications to earn the verified badge.'
    },
    {
      icon: FaBullhorn,
      number: 3,
      title: 'Receive Leads',
      description: 'Get matched with nearby customers. Receive quote requests from customers actively looking for your services.'
    },
    {
      icon: FaTrophy,
      number: 4,
      title: 'Grow',
      description: 'Win jobs and build your reputation. Deliver great service, earn 5-star reviews, and grow your business.'
    }
  ];

  const steps = activeAudience === 'customers' ? customerSteps : businessSteps;

  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] transition-colors duration-300">
      {/* Hero */}
      <motion.section 
        className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] py-20 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <ParticleBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How HirePro Works
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Whether you're looking for local services or growing your business, HirePro makes it simple.
          </p>

          {/* Audience Toggle */}
          <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setActiveAudience('customers')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeAudience === 'customers'
                  ? 'bg-white text-[var(--color-primary)]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              For Customers
            </button>
            <button
              onClick={() => setActiveAudience('businesses')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeAudience === 'businesses'
                  ? 'bg-white text-[var(--color-primary)]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              For Businesses
            </button>
          </div>
        </div>
      </motion.section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeAudience}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-16"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="relative"
              >
                <div className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}>
                  {/* Icon Side */}
                  <div className="flex-1 flex justify-center">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Number Badge */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                        {step.number}
                      </div>
                      
                      {/* Icon Circle */}
                      <div className="w-48 h-48 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-2xl">
                        <step.icon className="w-20 h-20 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-[var(--color-text-body)] leading-relaxed max-w-xl">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] mt-8"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 bg-[var(--color-bg-light)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
              {activeAudience === 'customers' ? 'Why Customers Choose HirePro' : 'Why Businesses Choose HirePro'}
            </h2>
            <p className="text-lg text-[var(--color-text-body)] max-w-2xl mx-auto">
              {activeAudience === 'customers' 
                ? 'Connect with trusted local professionals quickly and easily'
                : 'Grow your business with qualified leads and verified credibility'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {activeAudience === 'customers' ? (
              <>
                <motion.div 
                  className="bg-[var(--color-bg-white)] p-8 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="w-8 h-8 text-[var(--color-secondary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">Verified Professionals</h3>
                  <p className="text-[var(--color-text-body)]">
                    All businesses with verified badges have submitted proof of licensing, insurance, and certifications.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-[var(--color-bg-white)] p-8 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaStar className="w-8 h-8 text-[var(--color-star)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">Real Reviews</h3>
                  <p className="text-[var(--color-text-body)]">
                    Read authentic reviews from real customers to make informed decisions.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-[var(--color-bg-white)] p-8 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHandshake className="w-8 h-8 text-[var(--color-secondary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">Local & Fast</h3>
                  <p className="text-[var(--color-text-body)]">
                    Find qualified professionals in your area and get quick responses to your requests.
                  </p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  className="bg-[var(--color-bg-white)] p-8 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBullhorn className="w-8 h-8 text-[var(--color-secondary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">Quality Leads</h3>
                  <p className="text-[var(--color-text-body)]">
                    Get matched with customers actively looking for your services in your area.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-[var(--color-bg-white)] p-8 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="w-8 h-8 text-[var(--color-secondary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">Verified Badge</h3>
                  <p className="text-[var(--color-text-body)]">
                    Stand out with a verified badge that builds trust and credibility with customers.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-[var(--color-bg-white)] p-8 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrophy className="w-8 h-8 text-[var(--color-star)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">Build Reputation</h3>
                  <p className="text-[var(--color-text-body)]">
                    Earn 5-star reviews and showcase your best work to attract more customers.
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.section>

      {/* FAQ Teaser */}
      <motion.section 
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[var(--color-bg-light)] to-white border border-[var(--color-border)] rounded-2xl p-8 md:p-12 text-center">
            <FaQuestionCircle className="w-16 h-16 text-[var(--color-secondary)] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
              Have Questions?
            </h2>
            <p className="text-lg text-[var(--color-text-body)] mb-8">
              Check out our FAQ page for answers to common questions about how HirePro works.
            </p>
            <Link href="/faq">
              <motion.button
                className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View FAQs
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {activeAudience === 'customers' 
              ? 'Ready to find the perfect professional?'
              : 'Ready to grow your business?'
            }
          </h2>
          <p className="text-xl text-white/90 mb-10">
            {activeAudience === 'customers'
              ? 'Search thousands of verified local businesses and get started today.'
              : 'Join over 500 local businesses already growing with HirePro.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {activeAudience === 'customers' ? (
              <>
                <Link href="/businesses">
                  <motion.button
                    className="px-8 py-4 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Searching
                  </motion.button>
                </Link>
                <Link href="/categories">
                  <motion.button
                    className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Categories
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/add-your-business">
                  <motion.button
                    className="px-8 py-4 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    List Your Business — Free
                  </motion.button>
                </Link>
                <button
                  onClick={() => setActiveAudience('customers')}
                  className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                >
                  Looking for Services?
                </button>
              </>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
