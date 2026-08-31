'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaMapMarkerAlt, 
  FaSearch, 
  FaStar, 
  FaUsers, 
  FaHeart, 
  FaCheckCircle, 
  FaList, 
  FaPhone, 
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaHome,
  FaBroom,
  FaWrench,
  FaBolt,
  FaCar,
  FaCut,
  FaUtensils,
  FaEllipsisH,
  FaArrowRight,
  FaClock,
  FaMoon,
  FaSun
} from "react-icons/fa";
import { useTheme } from "./context/ThemeContext";
import ParticleBackground from "./components/ParticleBackground";
import { useEffect, useState } from "react";
import { defaultHomepageContent, HomepageContent, homepageContentFromApi, readHomepageContent, readHomepagePreview } from "./lib/homepage-content";
import { hireProApi } from "./lib/api";

type DisplayTestimonial = { id: string; name: string; review: string; rating: number; avatarUrl?: string | null; verified: boolean };
type DisplayCategory = { icon: typeof FaHome; label: string; color: string; href: string };
const categoryIcons = [FaHome,FaBroom,FaWrench,FaBolt,FaCar,FaCut,FaUtensils];
const categoryColors = ['text-blue-500','text-green-500','text-red-500','text-yellow-500','text-gray-600','text-pink-500','text-orange-500'];
const fallbackCategories: DisplayCategory[] = [
  { icon: FaHome, label: 'Home Services', color: 'text-blue-500', href: '/categories/home-services' },
  { icon: FaBroom, label: 'Cleaning', color: 'text-green-500', href: '/businesses?q=cleaning' },
  { icon: FaWrench, label: 'Plumbing', color: 'text-red-500', href: '/businesses?q=plumbing' },
  { icon: FaBolt, label: 'Electrical', color: 'text-yellow-500', href: '/businesses?q=electrical' },
  { icon: FaCar, label: 'Auto Repair', color: 'text-gray-600', href: '/businesses?q=auto%20repair' },
  { icon: FaCut, label: 'Beauty & Salon', color: 'text-pink-500', href: '/categories/health-wellness' },
  { icon: FaUtensils, label: 'Catering', color: 'text-orange-500', href: '/categories/events' },
  { icon: FaEllipsisH, label: 'More', color: 'text-purple-500', href: '/categories' },
];
type HomepageStats = { businesses: number; customers: number; categories: number; averageRating: number };
const fallbackStats: HomepageStats = { businesses: 500, customers: 10000, categories: 50, averageRating: 4.8 };
const fallbackTestimonials: DisplayTestimonial[] = [
  { id: 'emma', name: 'Emma W.', review: 'Amazing platform! Found a reliable plumber for my emergency. Quick, professional, and affordable.', rating: 5, verified: true },
  { id: 'sarah', name: 'Sarah Rose', review: 'Great experience with local electricians. The review system helped me choose confidently.', rating: 5, verified: true },
  { id: 'mark', name: 'Mark Edward', review: 'I was able to easily find local businesses nearby. The ratings were spot on!', rating: 5, verified: true },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
  }
};

function numericStat(stats: Record<string, number>, keys: string[], fallback: number) {
  for (const key of keys) {
    const value = Number(stats[key]);
    if (Number.isFinite(value) && value >= 0) return value;
  }
  return fallback;
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en', { notation: value >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value);
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [testimonials, setTestimonials] = useState<DisplayTestimonial[]>(fallbackTestimonials);
  const [homepageStats, setHomepageStats] = useState<HomepageStats>(fallbackStats);
  const [categories, setCategories] = useState<DisplayCategory[]>(fallbackCategories);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  useEffect(() => {
    const update = () => setContent(readHomepageContent());
    const preview = new URLSearchParams(window.location.search).get('preview') === '1' ? readHomepagePreview() : null;
    if (preview) {
      setContent(preview);
      document.title = `${preview.seoTitle} (Preview)`;
      return;
    }
    hireProApi.homepageContent().then(value => {
      const published = homepageContentFromApi(value);
      setContent(published);
      document.title = published.seoTitle;
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta) meta.content = published.seoDescription;
    }).catch(() => setContent(readHomepageContent()));
    window.addEventListener('storage', update);
    window.addEventListener('hirepro:homepage-updated', update);
    return () => { window.removeEventListener('storage', update); window.removeEventListener('hirepro:homepage-updated', update); };
  }, []);
  useEffect(() => {
    hireProApi.homepageStats().then(stats => setHomepageStats({
      businesses: numericStat(stats, ['businesses', 'local_businesses', 'business_count', 'total_businesses'], fallbackStats.businesses),
      customers: numericStat(stats, ['customers', 'happy_customers', 'customer_count', 'total_customers', 'users'], fallbackStats.customers),
      categories: numericStat(stats, ['categories', 'category_count', 'total_categories'], fallbackStats.categories),
      averageRating: numericStat(stats, ['average_rating', 'avg_rating', 'rating'], fallbackStats.averageRating),
    })).catch(() => undefined);
  }, []);
  useEffect(() => {
    hireProApi.categories.list(7).then(items => {
      if (!items.length) return;
      setCategories([
        ...items.map((category,index)=>({icon:categoryIcons[index%categoryIcons.length],label:category.name,color:categoryColors[index%categoryColors.length],href:`/categories/${category.slug}`})),
        {icon:FaEllipsisH,label:'More',color:'text-purple-500',href:'/categories'},
      ]);
    }).catch(() => undefined);
  }, []);
  useEffect(() => {
    hireProApi.testimonials(true, 3).then(items => {
      if (!items.length) return;
      setTestimonials(items.map((item, index) => ({
        id: String(item.id ?? index),
        name: String(item.name ?? item.full_name ?? item.customer_name ?? 'HirePro customer'),
        review: String(item.review ?? item.comment ?? item.content ?? ''),
        rating: Math.max(1, Math.min(5, Number(item.rating ?? 5))),
        avatarUrl: item.avatar_url,
        verified: item.is_verified !== false,
      })).filter(item => item.review));
    }).catch(() => undefined);
  }, []);

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;
    setNewsletterStatus('submitting');
    setNewsletterMessage('');
    try {
      await hireProApi.subscribeNewsletter(email);
      setNewsletterEmail('');
      setNewsletterStatus('success');
      setNewsletterMessage('You’re subscribed. Watch your inbox for HirePro updates.');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Unable to subscribe right now. Please try again.');
    }
  };
  
  const businesses = [
    { name: 'Alpine Plumbing', category: 'Plumbing', rating: 4.8, reviews: 127 },
    { name: 'Bright Electricians', category: 'Electrical', rating: 4.9, reviews: 203 },
    { name: 'Elite Car Washing', category: 'Auto Care', rating: 4.7, reviews: 156 },
    { name: 'CleanCare Services', category: 'Cleaning', rating: 5.0, reviews: 89 },
  ];

  const stepIcons = [FaSearch, FaList, FaCheckCircle];

  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] transition-colors duration-300">
      {/* Header/Navigation */}
      <motion.header 
        className="border-b border-[var(--color-border)] bg-[var(--color-bg-white)] sticky top-0 z-50 transition-colors duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <motion.div 
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <FaMapMarkerAlt className="w-6 h-6 text-[var(--color-primary)]" />
                <span className="text-xl font-bold text-[var(--color-primary)]">HirePro</span>
              </motion.div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', href: '/' },
                { label: 'Businesses', href: '/businesses' },
                { label: 'Browse', href: '/categories' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'About Us', href: '/about' }
              ].map((item, index) => (
                <Link key={item.label} href={item.href}>
                  <motion.span
                    className="text-[var(--color-text-body)] hover:text-[var(--color-primary)] cursor-pointer"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--color-bg-light)] text-[var(--color-text-body)] hover:bg-[var(--color-border)] transition-colors"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
              </motion.button>
              <Link href="/add-your-business">
                <motion.button 
                  className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Your Business
                </motion.button>
              </Link>
              <Link href="/customer/login">
                <motion.button 
                  className="text-[var(--color-text-body)]"
                  whileHover={{ scale: 1.05 }}
                >
                  Login
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Without Search Box */}
      <section className="bg-[var(--color-bg-light)] py-16 overflow-hidden relative">
        <ParticleBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h1 
                className="text-5xl font-bold text-[var(--color-text-heading)] leading-tight mb-4"
                variants={fadeInUp}
              >
                {content.heroTitle} <span className="text-[var(--color-secondary)]">{content.heroAccent}</span> {content.heroSuffix}
              </motion.h1>
              <motion.p 
                className="text-[var(--color-text-body)] text-lg mb-8"
                variants={fadeInUp}
              >
                {content.heroDescription}
              </motion.p>

              {/* Popular Searches */}
              <motion.div 
                className="flex flex-wrap gap-2"
                variants={fadeInUp}
              >
                <span className="text-[var(--color-text-muted)] text-sm">Popular Searches:</span>
                {content.popularSearches.map((item, index) => (
                  <motion.button 
                    key={item} 
                    className="px-3 py-1 bg-white border border-[var(--color-border)] rounded-full text-sm text-[var(--color-text-body)] hover:border-[var(--color-secondary)] transition-colors"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image/Phone Mockup */}
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <motion.div 
                className="bg-white rounded-3xl shadow-2xl p-6 border-8 border-[var(--color-primary-dark)] max-w-sm mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#12122E] mb-1">What service</h3>
                  <p className="text-[#6B7280] text-sm">are you looking for?</p>
                </div>
                <motion.div 
                  className="grid grid-cols-3 gap-3 mb-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    { icon: FaHome, label: 'Home', color: 'text-blue-500' },
                    { icon: FaBolt, label: 'Electric', color: 'text-yellow-500' },
                    { icon: FaWrench, label: 'Plumbing', color: 'text-red-500' },
                    { icon: FaCut, label: 'Beauty', color: 'text-pink-500' },
                    { icon: FaBroom, label: 'Cleaning', color: 'text-green-500' },
                    { icon: FaCar, label: 'Auto', color: 'text-gray-600' },
                  ].map((service, index) => (
                    <motion.div 
                      key={service.label} 
                      className="flex flex-col items-center justify-center p-3 bg-[var(--color-bg-light)] rounded-lg cursor-pointer"
                      variants={scaleIn}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <service.icon className={`text-2xl mb-1 ${service.color}`} />
                      <span className="text-xs text-center text-[var(--color-text-body)]">{service.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#12122E]">Trusted Local Businesses</h4>
                    <span className="text-sm text-[var(--color-primary)]">→</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      ></motion.div>
                    ))}
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs text-[#6B7280]"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      +8
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
              {/* Decorative elements */}
              <motion.div 
                className="absolute top-10 right-0 w-16 h-16 grid grid-cols-2 gap-2"
                initial={{ opacity: 0, rotate: -180 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {[
                  'var(--color-accent)',
                  'var(--color-secondary)',
                  'var(--color-primary)',
                  'var(--color-star)'
                ].map((color, i) => (
                  <motion.div 
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity 
                    }}
                  ></motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className={`${content.sections.categories ? '' : 'hidden'} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)]">{content.categoriesTitle}</h2>
            <Link href="/categories">
              <motion.span 
                className="text-[var(--color-secondary)] hover:underline cursor-pointer"
                whileHover={{ x: 5 }}
              >
                View All Categories
              </motion.span>
            </Link>
          </motion.div>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.label} 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={category.href} aria-label={`Browse ${category.label}`} className="flex min-h-36 flex-col items-center justify-center rounded-xl bg-[var(--color-bg-light)] p-6 transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-offset-2">
                  <category.icon className={`text-4xl mb-2 ${category.color}`} />
                  <span className="text-sm text-center text-[var(--color-text-body)]">{category.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Local Businesses */}
      <section className={`${content.sections.featured ? '' : 'hidden'} py-16 bg-[var(--color-bg-light)]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)]">{content.featuredTitle}</h2>
            <Link href="/businesses">
              <motion.span 
                className="text-[var(--color-secondary)] hover:underline cursor-pointer"
                whileHover={{ x: 5 }}
              >
                View All Businesses
              </motion.span>
            </Link>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {businesses.map((business, index) => (
              <motion.div 
                key={business.name} 
                className="bg-[var(--color-bg-white)] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                  <motion.div 
                    className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaHeart className="w-4 h-4 text-[var(--color-accent)]" />
                  </motion.div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-1">{business.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">{business.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FaStar className="w-4 h-4 text-[var(--color-star)]" />
                      <span className="font-semibold text-[var(--color-text-heading)]">{business.rating}</span>
                      <span className="text-sm text-[var(--color-text-muted)]">({business.reviews})</span>
                    </div>
                    <motion.button 
                      className="text-[var(--color-secondary)] text-sm font-medium hover:underline"
                      whileHover={{ scale: 1.05 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`${content.sections.process ? '' : 'hidden'} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-3">{content.processTitle}</h2>
            <p className="text-[var(--color-text-body)] mb-12">{content.processSubtitle}</p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {content.processSteps.map((step, index) => {
              const StepIcon = stepIcons[index] ?? FaCheckCircle;
              return (
              <motion.div 
                key={step.title} 
                className="relative"
                variants={fadeInUp}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-[var(--color-primary)] rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <StepIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">{step.title}</h3>
                <p className="text-[var(--color-text-body)]">{step.description}</p>
                {index < 2 && (
                  <motion.div 
                    className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-[var(--color-border)]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  ></motion.div>
                )}
              </motion.div>
            )})}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner - Are you a local business? */}
      <section className={`${content.sections.cta ? '' : 'hidden'} py-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
            >
              <h2 className="text-3xl font-bold text-white mb-4">{content.ctaTitle}</h2>
              <p className="text-white/90 mb-6">{content.ctaDescription}</p>
              <Link href={content.ctaButtonUrl || '/add-your-business'}>
                <motion.button 
                  className="px-8 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {content.ctaButton}
                </motion.button>
              </Link>
            </motion.div>
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="grid grid-cols-2 gap-4 text-center text-white"
                  variants={staggerContainer}
                >
                  {[
                    { value: formatCount(homepageStats.businesses), label: 'Local Businesses', icon: FaUsers },
                    { value: formatCount(homepageStats.customers), label: 'Happy Customers', icon: FaUsers },
                    { value: formatCount(homepageStats.categories), label: 'Categories', icon: FaList },
                    { value: homepageStats.averageRating.toFixed(1), label: 'Average Rating', icon: FaStar }
                  ].map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      variants={scaleIn}
                    >
                      <motion.div 
                        className="text-3xl font-bold mb-1 flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        {stat.value}
                        {stat.label === 'Average Rating' && <stat.icon className="w-6 h-6 text-[var(--color-star)]" />}
                      </motion.div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className={`${content.sections.stats ? '' : 'hidden'} py-8 border-y border-[var(--color-border)]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: FaUsers, value: formatCount(homepageStats.businesses), label: 'Local Businesses' },
              { icon: FaUsers, value: formatCount(homepageStats.customers), label: 'Happy Customers' },
              { icon: FaList, value: formatCount(homepageStats.categories), label: 'Categories' },
              { icon: FaStar, value: homepageStats.averageRating.toFixed(1), label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                variants={fadeInUp}
              >
                <motion.div 
                  className="flex items-center justify-center gap-2 mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <stat.icon className="w-6 h-6 text-[var(--color-secondary)]" />
                  <div className="text-3xl font-bold text-[var(--color-text-heading)]">{stat.value}</div>
                </motion.div>
                <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What People Say - Testimonials */}
      <section className={`${content.sections.testimonials ? '' : 'hidden'} py-16 bg-[var(--color-bg-light)]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)]">{content.testimonialsTitle}</h2>
            <Link href="/businesses">
              <motion.span 
                className="text-[var(--color-secondary)] hover:underline cursor-pointer"
                whileHover={{ x: 5 }}
              >
                View All Reviews
              </motion.span>
            </Link>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                className="bg-[var(--color-bg-white)] rounded-xl p-6 shadow-md"
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <FaStar className="w-5 h-5 text-[var(--color-star)]" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-[var(--color-text-body)] mb-4">{testimonial.review}</p>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                    style={testimonial.avatarUrl?{backgroundImage:`url(${testimonial.avatarUrl})`,backgroundSize:'cover',backgroundPosition:'center'}:undefined}
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <div className="font-semibold text-[var(--color-text-heading)]">{testimonial.name}</div>
                    <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                      <FaCheckCircle className="w-4 h-4 text-[var(--color-secondary)]" />
                      <span>{testimonial.verified?'Verified User':'HirePro User'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Request Guide */}
      <section className={`${content.sections.app ? '' : 'hidden'} py-16 overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-light)] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--color-secondary)] opacity-10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-secondary)]">
                <FaCheckCircle className="h-4 w-4" />
                Before you book
              </span>
              <h2 className="mb-4 text-3xl font-bold leading-tight text-[var(--color-text-heading)] sm:text-4xl">
                Get a better quote with a clearer request
              </h2>
              <p className="mb-7 text-lg leading-8 text-[var(--color-text-body)]">
                Tell local professionals what matters up front. A useful brief means fewer follow-up questions, more accurate quotes, and a faster decision.
              </p>
              <div className="mb-8 space-y-4">
                {[
                  'Describe the result you need, not just the problem',
                  'Add your area and preferred time window',
                  'Mention access details, size, or materials'
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-3 text-[var(--color-text-body)]">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-secondary)] text-white">
                      <FaCheckCircle className="h-3.5 w-3.5" />
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
              <Link href="/customer/login?serviceRequest=1">
                <motion.span
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start a service request <FaArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-5 shadow-xl sm:p-7">
                <div className="mb-6 flex items-center justify-between border-b border-[var(--color-border)] pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-secondary)]">Request preview</p>
                    <h3 className="mt-1 text-xl font-bold text-[var(--color-text-heading)]">Kitchen tap repair</h3>
                  </div>
                  <span className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">Ready to share</span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-[var(--color-border)] p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">What needs doing?</p>
                    <p className="text-sm leading-6 text-[var(--color-text-body)]">The tap is dripping continuously and the handle feels loose. I&apos;d like it repaired or replaced if needed.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><FaMapMarkerAlt /></span>
                      <div><p className="text-xs text-[var(--color-text-muted)]">Location</p><p className="text-sm font-semibold text-[var(--color-text-heading)]">Within my area</p></div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]"><FaClock /></span>
                      <div><p className="text-xs text-[var(--color-text-muted)]">Preferred time</p><p className="text-sm font-semibold text-[var(--color-text-heading)]">This week</p></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-[var(--color-primary)] px-4 py-3 text-white">
                  <span className="text-sm font-medium">Brief completeness</span>
                  <span className="text-sm font-bold">3 of 3 details</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl border-2 border-[var(--color-secondary)]/30" />
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`${content.sections.newsletter ? '' : 'hidden'} py-16 bg-[var(--color-bg-light)]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
            >
              <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">Stay Updated</h2>
              <p className="text-[var(--color-text-body)] mb-6">
                Subscribe to our newsletter for tips, news, what's updates, and special offers.
              </p>
              <motion.form 
                onSubmit={subscribe}
                className="flex flex-col gap-2 sm:flex-row"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={event=>{setNewsletterEmail(event.target.value);if(newsletterStatus!=='idle'){setNewsletterStatus('idle');setNewsletterMessage('')}}}
                  placeholder="Enter your email address" 
                  aria-label="Email address"
                  className="flex-1 px-4 py-3 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)]"
                />
                <motion.button 
                  type="submit"
                  disabled={newsletterStatus==='submitting'}
                  className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {newsletterStatus==='submitting'?'Subscribing…':'Subscribe'}
                </motion.button>
              </motion.form>
              {newsletterMessage&&<p role={newsletterStatus==='error'?'alert':'status'} className={`mt-3 text-sm ${newsletterStatus==='error'?'text-red-600':'text-[#237A4B]'}`}>{newsletterMessage}</p>}
            </motion.div>
            <motion.div 
              className="flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <div className="relative w-64 h-64">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-6"
                  animate={{ rotate: [6, 8, 6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
                <motion.div 
                  className="absolute inset-0 bg-white rounded-3xl shadow-xl flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaEnvelope className="w-32 h-32 text-[var(--color-secondary)]" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="bg-[var(--color-primary-dark)] text-white py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-5 gap-8 mb-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="md:col-span-2"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2 mb-4">
                <FaMapMarkerAlt className="w-6 h-6" />
                <span className="text-xl font-bold">HirePro</span>
              </div>
              <p className="text-white/80 mb-4">
                {content.footerDescription}
              </p>
              <div className="flex gap-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                  <motion.button 
                    key={index}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
            {[
              {
                title: 'For Customers',
                links: [
                  { label: 'Search Businesses', href: '/businesses' },
                  { label: 'Browse Categories', href: '/categories' },
                  { label: 'Write a Review', href: '/businesses' },
                  { label: 'FAQs', href: '/faq' }
                ]
              },
              {
                title: 'For Businesses',
                links: [
                  { label: 'Add Your Business', href: '/add-your-business' },
                  { label: 'Business Login', href: '/provider/login?businessLogin=1' },
                  { label: 'Advertise', href: '/add-your-business' },
                  { label: 'Resources', href: '/how-it-works' }
                ]
              },
              {
                title: 'Company',
                links: [
                  { label: 'About Us', href: '/about' },
                  { label: 'Careers', href: '/about' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Terms & Conditions', href: '/terms' }
                ]
              }
            ].map((column, index) => (
              <motion.div 
                key={column.title}
                variants={fadeInUp}
              >
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2 text-white/80">
                  {column.links.map((link) => (
                    <motion.li 
                      key={link.label}
                      whileHover={{ x: 5 }}
                    >
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          <motion.div 
            className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <FaPhone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
              <FaEnvelope className="w-4 h-4 ml-4" />
              <span>support@hirepro.com</span>
            </div>
            <p className="text-white/60 text-sm">© 2025 HirePro. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
