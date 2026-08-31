'use client';

import { motion } from 'framer-motion';
import { FaHeart, FaUsers, FaHandshake, FaLightbulb, FaMapMarkerAlt, FaAward } from 'react-icons/fa';
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

export default function AboutPage() {
  const values = [
    {
      icon: FaHeart,
      title: 'Trust',
      description: 'We verify every business to ensure customers can hire with confidence and peace of mind.'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Local',
      description: 'We believe in supporting local businesses and strengthening community connections.'
    },
    {
      icon: FaHandshake,
      title: 'Fair',
      description: 'No hidden fees, no per-lead charges. Transparent pricing for businesses, free for customers.'
    },
    {
      icon: FaLightbulb,
      title: 'Simple',
      description: 'Finding services or growing your business should be easy. We remove the complexity.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Local Businesses' },
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Service Categories' },
    { number: '4.8', label: 'Average Rating' }
  ];

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
            About HirePro
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            We're building the easiest way to connect local service providers with the customers who need them.
          </p>
        </div>
      </motion.section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-[var(--color-text-body)] leading-relaxed mb-8">
              HirePro was founded with a simple belief: finding quality local services shouldn't be hard, 
              and growing a local business shouldn't be expensive. We connect verified professionals with 
              customers in their community, making it easy for both sides to succeed.
            </p>
            <p className="text-lg text-[var(--color-text-body)] leading-relaxed">
              Unlike traditional lead-generation platforms that charge per-lead fees, we offer businesses 
              a transparent subscription model. This means service providers can focus on what they do best 
              — delivering quality work — without worrying about unpredictable costs eating into their margins.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <motion.section 
        className="py-20 bg-[var(--color-bg-light)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
              Our Values
            </h2>
            <p className="text-lg text-[var(--color-text-body)] max-w-2xl mx-auto">
              These principles guide everything we do at HirePro.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="bg-[var(--color-bg-white)] p-8 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[var(--color-secondary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3">
                  {value.title}
                </h3>
                <p className="text-[var(--color-text-body)]">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section 
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
              Growing Together
            </h2>
            <p className="text-lg text-[var(--color-text-body)]">
              We're proud of the community we're building.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-[var(--color-secondary)] mb-2">
                  {stat.number}
                </div>
                <div className="text-[var(--color-text-body)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story */}
      <motion.section 
        className="py-20 bg-[var(--color-bg-light)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-6 text-center">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-[var(--color-text-body)] leading-relaxed">
            <p>
              HirePro started when our founder needed an emergency plumber at 2 AM. After calling five different 
              numbers from a Google search — half of which didn't answer, and the other half quoted wildly 
              different prices — he realized there had to be a better way.
            </p>
            <p>
              Customers needed a reliable way to find verified, reviewed local services. And local businesses 
              needed an affordable way to reach customers without paying crushing per-lead fees that made every 
              job feel like a gamble.
            </p>
            <p>
              So we built HirePro: a platform where businesses pay a fair subscription price to be listed, and 
              customers can search and compare for free. No hidden fees. No per-lead charges. Just transparent 
              connections between people who need work done and the professionals who can do it.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Whether you're looking for services or offering them, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/businesses">
                <motion.button
                  className="px-8 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search Now
                </motion.button>
              </Link>
              <Link href="/add-your-business">
                <motion.button
                  className="px-8 py-3 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  List Your Business
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
