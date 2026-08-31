'use client';

import { motion } from 'framer-motion';
import { FaBullhorn, FaCheckCircle, FaChartLine, FaDollarSign, FaStar, FaUsers } from 'react-icons/fa';
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

export default function AddYourBusinessPage() {
  const benefits = [
    {
      icon: FaBullhorn,
      title: 'More Local Leads',
      description: 'Get matched with customers actively searching for your services in your area.'
    },
    {
      icon: FaDollarSign,
      title: 'No Per-Lead Fees',
      description: 'Transparent monthly subscription — no hidden costs or per-lead charges eating into your profits.'
    },
    {
      icon: FaCheckCircle,
      title: 'Verified Badge Builds Trust',
      description: 'Stand out with a verified badge that shows customers you\'re licensed, insured, and certified.'
    },
    {
      icon: FaChartLine,
      title: 'One Dashboard for Everything',
      description: 'Manage leads, respond to quotes, track reviews, and grow your business from one simple dashboard.'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Create Your Profile',
      description: 'Add your business details, services, pricing, and coverage area in minutes.'
    },
    {
      number: 2,
      title: 'Get Verified',
      description: 'Upload your license, insurance, and certifications to earn the trusted verified badge.'
    },
    {
      number: 3,
      title: 'Start Receiving Leads',
      description: 'Get matched with customers and respond to quote requests from your dashboard.'
    }
  ];

  const testimonial = {
    quote: "Since joining HirePro, we've seen a 40% increase in qualified leads. The verified badge has been a game-changer for building trust with new customers.",
    author: "Michael Torres",
    business: "Alpine Plumbing",
    rating: 4.8
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Grow Your Business With HirePro
          </h1>
          <p className="text-xl text-white/90 mb-10">
            Join 500+ local businesses getting new customers every week — no per-lead fees.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/provider/signup"
              className="inline-flex px-10 py-4 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg shadow-xl"
            >
              Add Your Business — Free
            </Link>
          </motion.div>
          <p className="text-white/70 mt-4 text-sm">
            No credit card required to start
          </p>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section 
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
              Why Businesses Choose HirePro
            </h2>
            <p className="text-lg text-[var(--color-text-body)] max-w-2xl mx-auto">
              Everything you need to attract customers and grow your local business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="bg-[var(--color-bg-light)] p-8 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[var(--color-secondary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[var(--color-text-body)]">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it Works */}
      <motion.section 
        className="py-20 bg-[var(--color-bg-light)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
              Get Started in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[var(--color-text-body)]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Teaser */}
      <motion.section 
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[var(--color-text-body)]">
              No per-lead fees. No hidden charges. Just straightforward monthly plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="border-2 border-[var(--color-border)] rounded-xl p-8">
              <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-2">
                Free
              </h3>
              <div className="text-4xl font-bold text-[var(--color-text-heading)] mb-6">
                $0<span className="text-lg text-[var(--color-text-muted)]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Basic business listing</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Contact information displayed</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Customer reviews</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-body)] font-medium">
                Get Started Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="border-2 border-[var(--color-secondary)] rounded-xl p-8 relative">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 px-4 py-1 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-2">
                Pro
              </h3>
              <div className="text-4xl font-bold text-[var(--color-text-heading)] mb-6">
                $49<span className="text-lg text-[var(--color-text-muted)]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Everything in Free, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Verified badge</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Priority in search results</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Unlimited lead responses</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Portfolio & gallery</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5" />
                  <span className="text-[var(--color-text-body)]">Performance analytics</span>
                </li>
              </ul>
              <motion.button
                className="w-full px-6 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Pro Trial
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonial */}
      <motion.section 
        className="py-20 bg-[var(--color-bg-light)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--color-bg-white)] rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-5 h-5 text-[var(--color-star)]" />
              ))}
            </div>
            <blockquote className="text-xl text-[var(--color-text-body)] mb-6 leading-relaxed italic">
              "{testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
              <div>
                <div className="font-semibold text-[var(--color-text-heading)]">{testimonial.author}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{testimonial.business}</div>
                <div className="text-sm text-[var(--color-text-body)] flex items-center gap-1 mt-1">
                  <FaStar className="w-3 h-3 text-[var(--color-star)]" />
                  {testimonial.rating} rating · 127 reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join HirePro today and start connecting with local customers.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/provider/signup"
              className="inline-flex px-10 py-4 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg shadow-xl"
            >
              Add Your Business — Free
            </Link>
          </motion.div>
          <p className="text-white/70 mt-4">
            Have questions? <Link href="/contact" className="underline hover:text-white">Contact us</Link> or check our <Link href="/faq" className="underline hover:text-white">FAQ</Link>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
