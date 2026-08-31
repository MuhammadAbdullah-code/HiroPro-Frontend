'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  FaHome, FaBroom, FaWrench, FaBolt, FaCar, FaCut, FaUtensils, 
  FaPaintRoller, FaTree, FaSnowflake, FaTools, FaHammer,
  FaLaptop, FaCamera, FaMusic, FaDumbbell, FaDog, FaBaby,
  FaSearch, FaTimes
} from 'react-icons/fa';
import CategoryCard from '../components/CategoryCard';
import ParticleBackground from '../components/ParticleBackground';
import { Category, hireProApi } from '../lib/api';

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

// Mock data - will be replaced with API call
const categoryGroups = [
  {
    name: 'Home Services',
    categories: [
      { icon: FaWrench, name: 'Plumbing', description: 'Emergency repairs, installations', businessCount: 84, slug: 'plumbing' },
      { icon: FaBolt, name: 'Electrical', description: 'Wiring, repairs, installations', businessCount: 72, slug: 'electrical' },
      { icon: FaPaintRoller, name: 'Painting', description: 'Interior & exterior painting', businessCount: 56, slug: 'painting' },
      { icon: FaBroom, name: 'Cleaning', description: 'Home & office cleaning', businessCount: 91, slug: 'cleaning' },
      { icon: FaSnowflake, name: 'HVAC', description: 'Heating & cooling services', businessCount: 43, slug: 'hvac' },
      { icon: FaHammer, name: 'General Contracting', description: 'Renovations & remodeling', businessCount: 67, slug: 'contracting' },
    ]
  },
  {
    name: 'Outdoor & Landscaping',
    categories: [
      { icon: FaTree, name: 'Landscaping', description: 'Lawn care & garden design', businessCount: 52, slug: 'landscaping' },
      { icon: FaTools, name: 'Fencing', description: 'Installation & repair', businessCount: 28, slug: 'fencing' },
      { icon: FaHome, name: 'Roofing', description: 'Roof repair & replacement', businessCount: 34, slug: 'roofing' },
    ]
  },
  {
    name: 'Automotive',
    categories: [
      { icon: FaCar, name: 'Auto Repair', description: 'Mechanic services & diagnostics', businessCount: 78, slug: 'auto-repair' },
      { icon: FaCar, name: 'Auto Detailing', description: 'Car washing & detailing', businessCount: 45, slug: 'auto-detailing' },
      { icon: FaCar, name: 'Tire Services', description: 'Tire sales & installation', businessCount: 31, slug: 'tire-services' },
    ]
  },
  {
    name: 'Beauty & Wellness',
    categories: [
      { icon: FaCut, name: 'Hair Salons', description: 'Haircuts, styling, coloring', businessCount: 89, slug: 'hair-salons' },
      { icon: FaCut, name: 'Barbershops', description: 'Men\'s grooming services', businessCount: 54, slug: 'barbershops' },
      { icon: FaDumbbell, name: 'Personal Training', description: 'Fitness & wellness coaching', businessCount: 42, slug: 'personal-training' },
    ]
  },
  {
    name: 'Professional Services',
    categories: [
      { icon: FaLaptop, name: 'IT Services', description: 'Computer repair & support', businessCount: 38, slug: 'it-services' },
      { icon: FaCamera, name: 'Photography', description: 'Event & portrait photography', businessCount: 61, slug: 'photography' },
      { icon: FaMusic, name: 'Music Lessons', description: 'Instrument instruction', businessCount: 27, slug: 'music-lessons' },
    ]
  },
  {
    name: 'Pet & Childcare',
    categories: [
      { icon: FaDog, name: 'Pet Grooming', description: 'Professional pet care', businessCount: 36, slug: 'pet-grooming' },
      { icon: FaDog, name: 'Pet Training', description: 'Obedience & behavior training', businessCount: 22, slug: 'pet-training' },
      { icon: FaBaby, name: 'Childcare', description: 'Daycare & babysitting', businessCount: 48, slug: 'childcare' },
    ]
  },
  {
    name: 'Food & Catering',
    categories: [
      { icon: FaUtensils, name: 'Catering', description: 'Event catering services', businessCount: 55, slug: 'catering' },
      { icon: FaUtensils, name: 'Private Chefs', description: 'Personal cooking services', businessCount: 19, slug: 'private-chefs' },
    ]
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [apiCategories, setApiCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(()=>{hireProApi.categories.list(100).then(setApiCategories).catch(()=>setError('Unable to load the latest categories. Showing the available category directory.')).finally(()=>setLoading(false))},[]);

  const categoryIcons = [FaWrench,FaBolt,FaPaintRoller,FaBroom,FaSnowflake,FaHammer,FaTree,FaTools,FaHome,FaCar,FaCut,FaDumbbell,FaLaptop,FaCamera,FaMusic,FaDog,FaBaby,FaUtensils];
  const displayGroups = apiCategories ? [{name:'All Categories',categories:apiCategories.map((category,index)=>({icon:categoryIcons[index%categoryIcons.length],name:category.name,description:category.description,businessCount:undefined,slug:category.slug}))}] : categoryGroups;

  // Filter categories based on search
  const filteredGroups = displayGroups.map(group => ({
    ...group,
    categories: group.categories.filter(cat =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.categories.length > 0);

  const scrollToGroup = (groupName: string) => {
    const element = document.getElementById(groupName.replace(/\s+/g, '-').toLowerCase());
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveGroup(groupName);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] transition-colors duration-300">
      {/* Header */}
      <motion.section 
        className="bg-[var(--color-bg-light)] py-16 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <ParticleBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-heading)] mb-4">
              Browse All Categories
            </h1>
            <p className="text-lg text-[var(--color-text-body)] mb-8">
              From home repairs to personal care — find the right professional for every job.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] transition-colors bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sticky Sidebar - Desktop */}
          <motion.aside 
            className="hidden lg:block w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-24 space-y-2">
              <h3 className="font-semibold text-[var(--color-text-heading)] mb-4">Quick Jump</h3>
              {displayGroups.map((group) => (
                <button
                  key={group.name}
                  onClick={() => scrollToGroup(group.name)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeGroup === group.name
                      ? 'bg-[var(--color-secondary)] text-white'
                      : 'text-[var(--color-text-body)] hover:bg-[var(--color-bg-light)]'
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading&&<p className="mb-6 text-sm text-[var(--color-text-muted)]">Loading categories…</p>}
            {error&&<p role="alert" className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
            {filteredGroups.length > 0 ? (
              <div className="space-y-12">
                {filteredGroups.map((group, groupIndex) => (
                  <motion.section
                    key={group.name}
                    id={group.name.replace(/\s+/g, '-').toLowerCase()}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={staggerContainer}
                  >
                    <motion.h2 
                      className="text-2xl font-bold text-[var(--color-text-heading)] mb-6"
                      variants={fadeInUp}
                    >
                      {group.name}
                    </motion.h2>
                    <motion.div 
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      variants={staggerContainer}
                    >
                      {group.categories.map((category) => (
                        <motion.div key={category.slug} variants={fadeInUp}>
                          <CategoryCard
                            icon={category.icon}
                            name={category.name}
                            description={category.description}
                            businessCount={category.businessCount}
                            href={`/categories/${category.slug}`}
                            iconColor={`text-${['blue', 'green', 'red', 'yellow', 'purple', 'pink'][groupIndex % 6]}-500`}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.section>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xl text-[var(--color-text-muted)]">
                  No categories found matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] py-16 mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't see your category?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            We're always expanding. Let us know what services you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request a Category
            </motion.button>
            <motion.button
              className="px-8 py-3 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              List Your Business
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
