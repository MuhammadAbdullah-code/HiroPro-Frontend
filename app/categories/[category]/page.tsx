'use client';

import { motion } from 'framer-motion';
import { use, useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import BusinessCard from '@/app/components/BusinessCard';
import Link from 'next/link';
import { CategoryDetail, hireProApi } from '@/app/lib/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Mock data - will be replaced with API call based on params
const categoryData = {
  plumbing: {
    name: 'Plumbing',
    description: 'Find trusted, licensed plumbers near you for emergency repairs, installations, drain cleaning, and all your plumbing needs.',
    businesses: [
      { slug: 'alpine-plumbing', name: 'Alpine Plumbing', category: 'Plumbing', rating: 4.8, reviewCount: 127, verified: true, specialty: 'Emergency repairs, water heater installation', location: '2.3 miles away' },
      { slug: 'reliable-pipes', name: 'Reliable Pipes Co', category: 'Plumbing', rating: 4.9, reviewCount: 203, verified: true, specialty: 'Residential & commercial plumbing', location: '3.1 miles away' },
      { slug: 'quick-fix-plumbing', name: 'Quick Fix Plumbing', category: 'Plumbing', rating: 4.7, reviewCount: 156, verified: true, specialty: '24/7 emergency service', location: '1.8 miles away' },
      { slug: 'master-plumbers', name: 'Master Plumbers LLC', category: 'Plumbing', rating: 4.6, reviewCount: 89, verified: false, specialty: 'Drain cleaning, pipe replacement', location: '4.2 miles away' },
    ],
    cities: [
      { name: 'San Francisco', slug: 'san-francisco', count: 34 },
      { name: 'Oakland', slug: 'oakland', count: 28 },
      { name: 'San Jose', slug: 'san-jose', count: 22 },
      { name: 'Berkeley', slug: 'berkeley', count: 18 },
      { name: 'Palo Alto', slug: 'palo-alto', count: 15 },
    ],
    faqs: [
      {
        question: 'How much does a plumber cost?',
        answer: 'Plumbing costs vary by job type. Simple repairs like fixing a leaky faucet typically cost $150-$300, while more complex jobs like water heater installation can range from $800-$2,500. Emergency after-hours service usually includes a premium of $50-$150. Always get quotes from multiple plumbers before committing to a job.'
      },
      {
        question: 'What should I look for when hiring a plumber?',
        answer: 'Look for licensed and insured plumbers with good reviews. Verify they have experience with your specific issue, offer upfront pricing, and provide warranties on their work. On HirePro, our verified badge means the plumber has submitted proof of licensing, insurance, and trade certification.'
      },
      {
        question: 'Are plumbers available for emergencies?',
        answer: 'Yes, many plumbers offer 24/7 emergency services for urgent issues like burst pipes, major leaks, or sewer backups. Emergency service typically costs more than regular appointments. Check each plumber\'s profile to see their availability and emergency rates.'
      },
      {
        question: 'Do I need a permit for plumbing work?',
        answer: 'Major plumbing work like water heater installation, re-piping, or sewer line work typically requires a permit. Your plumber should handle permit applications and inspections. Minor repairs like fixing leaks or replacing fixtures usually don\'t require permits.'
      },
      {
        question: 'How long does typical plumbing work take?',
        answer: 'Simple repairs (leaky faucet, running toilet) take 1-2 hours. Water heater installation takes 2-4 hours. Re-piping a house can take 2-5 days. Your plumber should provide a time estimate when giving you a quote.'
      }
    ]
  },
  // Default fallback for other categories
  default: {
    name: 'Service',
    description: 'Find trusted professionals in this category.',
    businesses: [],
    cities: [],
    faqs: []
  }
};

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-[var(--color-border)] last:border-b-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-[var(--color-bg-light)] transition-colors"
      >
        <span className="font-semibold text-[var(--color-text-heading)] pr-8">
          {question}
        </span>
        {isOpen ? (
          <FaChevronUp className="text-[var(--color-secondary)] flex-shrink-0" />
        ) : (
          <FaChevronDown className="text-[var(--color-text-muted)] flex-shrink-0" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-5 text-[var(--color-text-body)] leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CategoryDetailPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [location, setLocation] = useState('');
  const [remoteCategory,setRemoteCategory]=useState<CategoryDetail|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{setLoading(true);setError('');hireProApi.categories.get(category).then(setRemoteCategory).catch(()=>setError('Unable to load the latest category details.')).finally(()=>setLoading(false))},[category]);
  
  // Get category data or use default
  const fallbackData = categoryData[category as keyof typeof categoryData] || {
    ...categoryData.default,
    name: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  };
  const data = remoteCategory ? {...fallbackData,name:remoteCategory.name,description:remoteCategory.description,faqs:remoteCategory.faqs} : fallbackData;

  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] transition-colors duration-300">
      {/* Header */}
      <motion.section 
        className="bg-[var(--color-bg-light)] py-16"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <nav className="text-sm text-[var(--color-text-muted)] mb-4">
              <Link href="/categories" className="hover:text-[var(--color-secondary)]">
                Categories
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--color-text-heading)]">{data.name}</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-heading)] mb-4">
              Find Trusted {data.name} Near You
            </h1>
            <p className="text-lg text-[var(--color-text-body)] mb-8">
              {data.description}
            </p>
            {loading&&<p className="mb-5 text-sm text-[var(--color-text-muted)]">Loading category details…</p>}
            {error&&<p role="alert" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}

            {/* Location Input */}
            <div className="flex gap-2 max-w-xl">
              <div className="flex-1 relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Enter your location or ZIP code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] transition-colors bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
                />
              </div>
              <motion.button
                className="px-6 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Search
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top-rated Businesses */}
        {data.businesses.length > 0 && (
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="flex items-center justify-between mb-6">
              <motion.h2 
                className="text-2xl font-bold text-[var(--color-text-heading)]"
                variants={fadeInUp}
              >
                Top-rated in {data.name}
              </motion.h2>
              <Link 
                href={`/businesses?category=${category}`}
                className="text-[var(--color-secondary)] hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.businesses.map((business, index) => (
                <motion.div key={business.slug} variants={fadeInUp}>
                  <BusinessCard {...business} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Available Cities */}
        {data.cities.length > 0 && (
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">
              Available in these cities
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.cities.map((city, index) => (
                <motion.div
                  key={city.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={`/categories/${category}/${city.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] rounded-full transition-colors"
                  >
                    <span className="text-[var(--color-text-heading)] font-medium">
                      {city.name}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm">
                      ({city.count})
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* FAQ Section */}
        {data.faqs.length > 0 && (
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border)] rounded-xl overflow-hidden">
              {data.faqs.map((faq, index) => (
                <FAQItem 
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA for Providers */}
        <motion.section
          className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-8 md:p-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Are you a {data.name} professional?
          </h2>
          <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
            List your business on HirePro and connect with customers actively looking for your services.
          </p>
          <motion.button
            className="px-8 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            List Your Business — It's Free
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
}
