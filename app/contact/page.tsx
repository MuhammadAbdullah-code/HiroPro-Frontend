'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import ParticleBackground from '../components/ParticleBackground';
import { getApiErrorMessage, hireProApi } from '../lib/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'customer',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await hireProApi.contact.send({
        name: formData.name,
        email: formData.email,
        subject: formData.topic,
        message: formData.message,
      });
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', topic: 'customer', message: '' });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not send your message. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] transition-colors duration-300">
      {/* Hero */}
      <motion.section 
        className="bg-[var(--color-bg-light)] py-16 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <ParticleBackground />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-heading)] mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-[var(--color-text-body)] mb-6">
            Have a question? We're here to help. Check our FAQ first or send us a message below.
          </p>
          <Link href="/faq">
            <motion.button
              className="px-6 py-3 border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-lg hover:bg-[var(--color-secondary)] hover:text-white transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse FAQ
            </motion.button>
          </Link>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <motion.aside
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bg-[var(--color-bg-light)] p-6 rounded-xl">
              <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaEnvelope className="w-5 h-5 text-[var(--color-secondary)] mt-1" />
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">Email</p>
                    <a href="mailto:support@hirepro.com" className="text-[var(--color-text-body)] hover:text-[var(--color-secondary)]">
                      support@hirepro.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhone className="w-5 h-5 text-[var(--color-secondary)] mt-1" />
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">Phone</p>
                    <a href="tel:+15551234567" className="text-[var(--color-text-body)] hover:text-[var(--color-secondary)]">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaClock className="w-5 h-5 text-[var(--color-secondary)] mt-1" />
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">Hours</p>
                    <p className="text-[var(--color-text-body)]">Mon-Fri: 9:00 AM - 6:00 PM PST</p>
                    <p className="text-[var(--color-text-body)]">Sat-Sun: Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-[var(--color-secondary)] mt-1" />
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">Address</p>
                    <p className="text-[var(--color-text-body)]">
                      123 Tech Street<br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-bg-light)] p-6 rounded-xl">
              <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-3">
                Response Time
              </h3>
              <p className="text-[var(--color-text-body)] text-sm">
                We typically respond within 1 business day. For urgent issues, please call us directly.
              </p>
            </div>
          </motion.aside>

          {/* Contact Form */}
          <motion.div
            className="md:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bg-[var(--color-bg-light)] p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">
                Send Us a Message
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <p className="font-semibold">Thanks — we'll get back to you within 1 business day.</p>
                </div>
              )}
              {error && (
                <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] transition-colors bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] transition-colors bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Topic */}
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
                    Topic
                  </label>
                  <select
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] transition-colors bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
                  >
                    <option value="customer">Customer Support</option>
                    <option value="business">Business Support</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] transition-colors bg-[var(--color-bg-white)] text-[var(--color-text-body)] resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
