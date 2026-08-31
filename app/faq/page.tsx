'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import ParticleBackground from '../components/ParticleBackground';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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
      transition={{ delay: index * 0.05 }}
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

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'businesses' | 'payments' | 'trust'>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = {
    customers: [
      {
        question: 'Is HirePro free to use?',
        answer: 'Yes! HirePro is completely free for customers. You can search for businesses, read reviews, compare quotes, and contact professionals without any fees.'
      },
      {
        question: 'How are businesses verified?',
        answer: 'Businesses with the verified badge have submitted proof of licensing, insurance, and relevant certifications. Our team reviews these documents to ensure they meet industry standards before awarding the verified badge.'
      },
      {
        question: 'How do I request a quote?',
        answer: 'Visit any business profile and click "Request a Quote." Fill out the form with your project details, and the business will respond within 24-48 hours with pricing and availability.'
      },
      {
        question: 'Can I trust the reviews?',
        answer: 'All reviews on HirePro are from verified customers who have worked with the business. We have systems in place to detect and prevent fake reviews, and businesses cannot delete negative reviews.'
      },
      {
        question: 'What if I have a problem with a business?',
        answer: 'If you experience issues with a business you found through HirePro, please contact our support team. While we don\'t mediate disputes, we can remove businesses that violate our terms or consistently receive poor reviews.'
      }
    ],
    businesses: [
      {
        question: 'How much does it cost to list my business?',
        answer: 'We offer a free basic listing and a Pro plan at $49/month with additional features like verified badge, priority placement, and unlimited quote responses. No per-lead fees or hidden charges.'
      },
      {
        question: 'How do I get more leads?',
        answer: 'Complete your profile with photos, detailed service descriptions, and competitive pricing. Respond quickly to quote requests, maintain a 4+ star rating, and earn the verified badge to appear higher in search results.'
      },
      {
        question: 'What is the verified badge and how do I get it?',
        answer: 'The verified badge shows customers you\'re licensed, insured, and certified. To earn it, subscribe to our Pro plan and upload proof of your business license, insurance, and relevant trade certifications. Our team reviews documents within 3-5 business days.'
      },
      {
        question: 'Can I respond to reviews?',
        answer: 'Yes! You can publicly respond to any review on your profile. This shows potential customers how you handle feedback and resolve issues. Keep responses professional and constructive.'
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel anytime from your account settings. Your subscription remains active until the end of your billing period, then converts to a free basic listing. No cancellation fees.'
      }
    ],
    payments: [
      {
        question: 'Do I pay through HirePro?',
        answer: 'No, payment happens directly between you and the business. HirePro is a directory and lead platform — we don\'t process service payments.'
      },
      {
        question: 'Are there any hidden fees for customers?',
        answer: 'No. HirePro is free for customers. You never pay us to search, compare, or contact businesses. The prices you see are what the business charges for their services.'
      },
      {
        question: 'How do businesses pay for subscriptions?',
        answer: 'Businesses pay monthly via credit card. We accept all major cards. Payments are automatically processed at the start of each billing cycle.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Subscription fees are non-refundable, but you can cancel anytime to prevent future charges. If you believe you were charged in error, contact our support team.'
      }
    ],
    trust: [
      {
        question: 'How do you prevent fake reviews?',
        answer: 'We use multiple verification methods including email verification, review patterns analysis, and manual moderation. Only customers who have interacted with a business can leave reviews.'
      },
      {
        question: 'What happens if a business has fake credentials?',
        answer: 'If we discover falsified credentials, the business is immediately removed from the platform and banned. We take verification fraud very seriously. Report suspected fraud to support@hirepro.com.'
      },
      {
        question: 'Is my personal information safe?',
        answer: 'Yes. We use industry-standard encryption and never sell your personal data. Businesses only see the information you provide in quote requests. Read our Privacy Policy for details.'
      },
      {
        question: 'Can businesses see my contact info before I hire them?',
        answer: 'Businesses only see your contact information when you submit a quote request or contact them directly. Your email and phone number are never publicly visible on the platform.'
      }
    ]
  };

  const currentFAQs = faqCategories[activeTab].filter(faq =>
    searchQuery === '' ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[var(--color-text-body)] mb-8">
            Find answers to common questions about HirePro
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] transition-colors bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
            />
          </div>
        </div>
      </motion.section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'customers' as const, label: 'For Customers' },
            { id: 'businesses' as const, label: 'For Businesses' },
            { id: 'payments' as const, label: 'Payments' },
            { id: 'trust' as const, label: 'Trust & Safety' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-[var(--color-bg-light)] text-[var(--color-text-body)] hover:bg-[var(--color-border)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {currentFAQs.length > 0 ? (
          <motion.div 
            className="bg-[var(--color-bg-white)] border border-[var(--color-border)] rounded-xl overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {currentFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-[var(--color-bg-light)] rounded-xl">
            <p className="text-[var(--color-text-muted)] text-lg">
              No FAQs found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Still Have Questions CTA */}
        <motion.div 
          className="mt-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-8 md:p-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our support team is here to help.
          </p>
          <motion.button
            onClick={() => window.location.href = '/contact'}
            className="px-8 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
