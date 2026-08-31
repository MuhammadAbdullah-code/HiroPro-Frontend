'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle,
  FaGlobe, FaStar, FaThumbsUp, FaRegClock, FaDollarSign, FaComments,
  FaChevronLeft, FaChevronRight, FaHeart, FaShare
} from 'react-icons/fa';
import StarRating from '@/app/components/StarRating';
import VerifiedBadge from '@/app/components/VerifiedBadge';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Mock data - will be replaced with API call
const businessData = {
  name: 'Alpine Plumbing',
  category: 'Plumbing',
  verified: true,
  rating: 4.8,
  reviewCount: 127,
  about: 'Alpine Plumbing has been serving the Bay Area for over 15 years. We specialize in residential and commercial plumbing services, from emergency repairs to complete system installations. Our team of licensed, insured professionals is committed to delivering quality work and exceptional customer service. Available 24/7 for emergency calls.',
  services: [
    { name: 'Emergency Plumbing', price: 'Starting at $150' },
    { name: 'Water Heater Installation', price: '$800 - $2,500' },
    { name: 'Drain Cleaning', price: '$120 - $300' },
    { name: 'Pipe Repair/Replacement', price: 'Quote required' },
    { name: 'Fixture Installation', price: '$80 - $250' },
    { name: 'Leak Detection', price: '$150 - $400' },
  ],
  hours: [
    { day: 'Monday', hours: '7:00 AM - 6:00 PM' },
    { day: 'Tuesday', hours: '7:00 AM - 6:00 PM' },
    { day: 'Wednesday', hours: '7:00 AM - 6:00 PM' },
    { day: 'Thursday', hours: '7:00 AM - 6:00 PM' },
    { day: 'Friday', hours: '7:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ],
  contact: {
    phone: '(555) 123-4567',
    email: 'contact@alpineplumbing.com',
    website: 'www.alpineplumbing.com',
    address: '123 Main Street, San Francisco, CA 94102'
  },
  coverage: ['San Francisco', 'Oakland', 'Berkeley', 'Daly City', 'South San Francisco'],
  portfolio: [
    '/placeholder1.jpg', '/placeholder2.jpg', '/placeholder3.jpg',
    '/placeholder4.jpg', '/placeholder5.jpg', '/placeholder6.jpg'
  ],
  reviews: [
    {
      id: 1,
      author: 'Sarah Johnson',
      rating: 5,
      date: '2 weeks ago',
      text: 'Excellent service! They arrived on time, diagnosed the problem quickly, and fixed our water heater the same day. The technician was professional and explained everything clearly. Highly recommend!',
      ratings: { quality: 5, timeliness: 5, value: 5, communication: 5 },
      businessResponse: 'Thank you Sarah! We\'re glad we could help with your water heater. We appreciate your business!'
    },
    {
      id: 2,
      author: 'Michael Chen',
      rating: 5,
      date: '1 month ago',
      text: 'Had an emergency pipe burst at 2 AM and Alpine Plumbing was there within an hour. They fixed the issue efficiently and cleaned up afterward. Fair pricing for emergency service.',
      ratings: { quality: 5, timeliness: 5, value: 4, communication: 5 }
    },
    {
      id: 3,
      author: 'Emily Rodriguez',
      rating: 4,
      date: '2 months ago',
      text: 'Good experience overall. The plumber was knowledgeable and did quality work. Only minor issue was they were 30 minutes late, but they called ahead to let me know.',
      ratings: { quality: 5, timeliness: 3, value: 4, communication: 5 }
    },
  ]
};

export default function BusinessProfilePage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews' | 'portfolio'>('about');
  const [reviewSort, setReviewSort] = useState('newest');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services & Pricing' },
    { id: 'reviews', label: `Reviews (${businessData.reviewCount})` },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  const ratingBreakdown = {
    5: 78,
    4: 32,
    3: 12,
    2: 3,
    1: 2
  };

  const avgRatings = {
    quality: 4.9,
    timeliness: 4.7,
    value: 4.6,
    communication: 4.8
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] transition-colors duration-300">
      {/* Header/Hero */}
      <motion.section 
        className="bg-[var(--color-bg-light)]"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo */}
              <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-4xl font-bold text-[var(--color-primary)]">AP</span>
              </div>

              {/* Business Info */}
              <div className="flex-1 pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-[var(--color-text-heading)]">
                        {businessData.name}
                      </h1>
                      {businessData.verified && <VerifiedBadge size="lg" showText />}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-[var(--color-text-muted)]">{businessData.category}</span>
                      <StarRating 
                        rating={businessData.rating} 
                        reviewCount={businessData.reviewCount}
                        size="md"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="hidden md:flex gap-2">
                    <motion.button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-3 border border-[var(--color-border)] rounded-lg hover:bg-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaHeart className={isFavorite ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'} />
                    </motion.button>
                    <motion.button
                      className="p-3 border border-[var(--color-border)] rounded-lg hover:bg-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShare className="text-[var(--color-text-muted)]" />
                    </motion.button>
                  </div>
                </div>

                {/* Contact Quick Info */}
                <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-body)]">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[var(--color-text-muted)]" />
                    <span>{businessData.contact.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-[var(--color-text-muted)]" />
                    <a href={`tel:${businessData.contact.phone}`} className="hover:text-[var(--color-secondary)]">
                      {businessData.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button - Sticky on Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-border)] z-40">
              <motion.button
                onClick={() => setShowQuoteModal(true)}
                className="w-full px-6 py-4 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request a Quote
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-[var(--color-border)]">
            <div className="flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 px-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-[var(--color-secondary)] text-[var(--color-secondary)] font-semibold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* About Tab */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4">About</h2>
                  <p className="text-[var(--color-text-body)] leading-relaxed">
                    {businessData.about}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-4">Coverage Area</h3>
                  <div className="flex flex-wrap gap-2">
                    {businessData.coverage.map((city) => (
                      <span
                        key={city}
                        className="px-4 py-2 bg-[var(--color-bg-light)] rounded-full text-[var(--color-text-body)]"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-4">Business Hours</h3>
                  <div className="space-y-2">
                    {businessData.hours.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                        <span className="text-[var(--color-text-body)] font-medium">{schedule.day}</span>
                        <span className="text-[var(--color-text-muted)]">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">Services & Pricing</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {businessData.services.map((service, index) => (
                    <div
                      key={index}
                      className="p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-secondary)] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-[var(--color-text-heading)]">{service.name}</h3>
                        <FaDollarSign className="text-[var(--color-secondary)]" />
                      </div>
                      <p className="text-[var(--color-text-muted)]">{service.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[var(--color-bg-light)] rounded-lg">
                  <p className="text-sm text-[var(--color-text-body)]">
                    <strong>Note:</strong> Prices are estimates and may vary based on job complexity. Request a quote for accurate pricing.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Rating Summary */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4">Overall Rating</h2>
                    <div className="flex items-end gap-4 mb-6">
                      <div className="text-5xl font-bold text-[var(--color-text-heading)]">
                        {businessData.rating}
                      </div>
                      <div>
                        <StarRating rating={businessData.rating} size="lg" showNumber={false} />
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          Based on {businessData.reviewCount} reviews
                        </p>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                      {Object.entries(ratingBreakdown).reverse().map(([stars, count]) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm text-[var(--color-text-body)] w-12">{stars} star</span>
                          <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-star)]"
                              style={{ width: `${(count / businessData.reviewCount) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-[var(--color-text-muted)] w-8">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-4">Rating Categories</h3>
                    <div className="space-y-4">
                      {Object.entries(avgRatings).map(([category, rating]) => (
                        <div key={category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-[var(--color-text-body)] capitalize flex items-center gap-2">
                              {category === 'quality' && <FaCheckCircle className="text-[var(--color-secondary)]" />}
                              {category === 'timeliness' && <FaRegClock className="text-[var(--color-secondary)]" />}
                              {category === 'value' && <FaDollarSign className="text-[var(--color-secondary)]" />}
                              {category === 'communication' && <FaComments className="text-[var(--color-secondary)]" />}
                              {category}
                            </span>
                            <span className="font-semibold text-[var(--color-text-heading)]">{rating}</span>
                          </div>
                          <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-secondary)]"
                              style={{ width: `${(rating / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)]">Customer Reviews</h3>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                    className="px-4 py-2 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {businessData.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 border border-[var(--color-border)] rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-[var(--color-text-heading)]">{review.author}</h4>
                              <p className="text-sm text-[var(--color-text-muted)]">{review.date}</p>
                            </div>
                          </div>
                          <StarRating rating={review.rating} size="sm" showNumber={false} />
                        </div>
                        <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]">
                          <FaThumbsUp />
                        </button>
                      </div>

                      <p className="text-[var(--color-text-body)] leading-relaxed mb-4">{review.text}</p>

                      {/* Category Ratings */}
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        {Object.entries(review.ratings).map(([category, rating]) => (
                          <div key={category} className="flex items-center gap-2">
                            <span className="text-[var(--color-text-muted)] capitalize">{category}:</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-3 h-3 ${i < rating ? 'text-[var(--color-star)]' : 'text-[var(--color-border)]'}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Business Response */}
                      {review.businessResponse && (
                        <div className="mt-4 pl-4 border-l-4 border-[var(--color-secondary)] bg-[var(--color-bg-light)] p-4 rounded">
                          <p className="text-sm font-semibold text-[var(--color-text-heading)] mb-1">
                            Response from {businessData.name}
                          </p>
                          <p className="text-sm text-[var(--color-text-body)]">{review.businessResponse}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center">
                  <button className="px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-body)]">
                    Load More Reviews
                  </button>
                </div>
              </motion.div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {businessData.portfolio.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {/* Image would go here */}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Request Quote Card */}
              <div className="bg-[var(--color-bg-light)] p-6 rounded-xl border border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-4">Get a Quote</h3>
                <p className="text-sm text-[var(--color-text-body)] mb-6">
                  Request a free quote and hear back within 24 hours.
                </p>
                <motion.button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full px-6 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Request a Quote
                </motion.button>
              </div>

              {/* Contact Info */}
              <div className="bg-[var(--color-bg-white)] p-6 rounded-xl border border-[var(--color-border)] space-y-4">
                <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <a href={`tel:${businessData.contact.phone}`} className="flex items-center gap-3 text-[var(--color-text-body)] hover:text-[var(--color-secondary)]">
                    <FaPhone className="text-[var(--color-text-muted)]" />
                    <span>{businessData.contact.phone}</span>
                  </a>
                  <a href={`mailto:${businessData.contact.email}`} className="flex items-center gap-3 text-[var(--color-text-body)] hover:text-[var(--color-secondary)]">
                    <FaEnvelope className="text-[var(--color-text-muted)]" />
                    <span className="text-sm">{businessData.contact.email}</span>
                  </a>
                  <a href={`https://${businessData.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-text-body)] hover:text-[var(--color-secondary)]">
                    <FaGlobe className="text-[var(--color-text-muted)]" />
                    <span className="text-sm">{businessData.contact.website}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
