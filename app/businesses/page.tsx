'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { 
  FaSearch, FaMapMarkerAlt, FaFilter, FaTh, FaList, FaTimes,
  FaChevronDown, FaMap
} from 'react-icons/fa';
import BusinessCard from '../components/BusinessCard';
import { Business, Category, getApiErrorMessage, hireProApi } from '../lib/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(false);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRating, setSelectedRating] = useState('all');
  const [maxDistance, setMaxDistance] = useState(25);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const selectedCategoryId = categoryOptions.find(category => category.name === selectedCategory)?.id;

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    if (query) setSearchQuery(query);
  }, []);

  useEffect(() => {
    hireProApi.categories.list().then(setCategoryOptions).catch(() => undefined);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      setApiLoading(true);
      setApiError('');
      try {
        setBusinesses(await hireProApi.businesses.list({ q: searchQuery || undefined, city: location || undefined, category_id: selectedCategoryId, verified: verifiedOnly || undefined, limit: 50 }));
      } catch (error) {
        setApiError(getApiErrorMessage(error, 'Unable to load businesses.'));
      } finally {
        setApiLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchQuery, location, selectedCategoryId, verifiedOnly]);

  const categoryNames = useMemo(() => new Map(categoryOptions.map(category => [category.id, category.name])), [categoryOptions]);

  // Filter active count
  const activeFiltersCount = [
    selectedCategory !== 'All Categories',
    selectedRating !== 'all',
    maxDistance !== 25,
    verifiedOnly
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedRating('all');
    setMaxDistance(25);
    setVerifiedOnly(false);
  };

  const filteredBusinesses = businesses.map(business => ({
    id: business.id, slug: business.id, name: business.name,
    category: categoryNames.get(business.category_id) ?? 'Local service',
    rating: 0, reviewCount: 0, verified: business.is_verified,
    specialty: business.description,
    location: [business.city, business.address].filter(Boolean).join(' · '),
  }));

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A]">
      {/* Static search hero — intentionally no animated background. */}
      <header className="border-b border-[#E4E9F1] bg-white px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[.12em] text-[#8B7CF6]"><span className="size-2 rounded-full bg-[#8B7CF6] ring-4 ring-[#EFECFE]"/>Search the network</p>
          <form onSubmit={event=>event.preventDefault()} className="flex flex-col gap-3 md:flex-row">
            {/* Service Input */}
            <label className="relative flex h-14 flex-1 items-center rounded-[14px] border border-[#E4E9F1] bg-white px-4 focus-within:border-[#0D9488] focus-within:ring-4 focus-within:ring-[#E1F5F2]">
              <FaSearch className="mr-3 shrink-0 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="What service do you need? Try plumber or house cleaning"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-[#94A3B8]"
              />
            </label>

            {/* Location Input */}
            <label className="relative flex h-14 items-center rounded-[14px] border border-[#E4E9F1] bg-white px-4 focus-within:border-[#0D9488] focus-within:ring-4 focus-within:ring-[#E1F5F2] md:w-72">
              <FaMapMarkerAlt className="mr-3 shrink-0 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Location or ZIP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-[#94A3B8]"
              />
            </label>

            <button type="submit" className="flex h-14 items-center justify-center gap-2 rounded-[14px] bg-[#0D9488] px-7 text-sm font-semibold text-white hover:bg-[#0A6F66]"><FaSearch/>Search</button>

            {/* Filters Button - Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative h-14 rounded-[14px] border border-[#E4E9F1] px-4 lg:hidden"
            >
              <FaFilter className="text-[var(--color-text-body)]" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-accent)] text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex gap-7">
          {/* Sidebar Filters - Desktop */}
          <motion.aside 
            className={`
              lg:block w-80 flex-shrink-0
              ${showFilters ? 'fixed inset-0 z-50 lg:relative' : 'hidden'}
            `}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`
              h-full bg-[var(--color-bg-white)] lg:bg-transparent
              ${showFilters ? 'overflow-y-auto p-6 lg:p-0' : ''}
            `}>
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--color-text-heading)]">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-[var(--color-bg-light)] rounded-lg"
                >
                  <FaTimes className="text-[var(--color-text-body)]" />
                </button>
              </div>

              <div className="space-y-6 rounded-[18px] border border-[#E4E9F1] bg-white p-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,.10)] lg:sticky lg:top-6">
                {/* Active Filters Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-sora font-semibold text-[#0F172A]">Refine results</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-[var(--color-secondary)] hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] bg-[var(--color-bg-white)] text-[var(--color-text-body)]"
                  >
                    {['All Categories', ...categoryOptions.map(category => category.name)].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {['all', '4.5', '4.0', '3.5', '3.0'].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={selectedRating === rating}
                          onChange={(e) => setSelectedRating(e.target.value)}
                          className="text-[var(--color-secondary)]"
                        />
                        <span className="text-[var(--color-text-body)]">
                          {rating === 'all' ? 'All ratings' : `${rating}+ stars`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
                    Distance: {maxDistance} miles
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full accent-[var(--color-secondary)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                    <span>1 mi</span>
                    <span>50 mi</span>
                  </div>
                </div>

                {/* Verified Only */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 text-[var(--color-secondary)] rounded"
                    />
                    <span className="text-[var(--color-text-body)]">
                      Verified businesses only
                    </span>
                  </label>
                </div>

                {/* Apply Button - Mobile */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden w-full px-6 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Show {filteredBusinesses.length} results
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Overlay - Mobile */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Main Content */}
          <main id="results" className="min-w-0 flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-heading)] mb-1">
                  <span className="text-[#0A6F66]">{filteredBusinesses.length}</span> businesses found
                </h1>
                {location && (
                  <p className="text-[var(--color-text-muted)]">near {location}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-10 py-2 border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-secondary)] bg-[var(--color-bg-white)] text-[var(--color-text-body)] appearance-none cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rated</option>
                    <option value="distance">Nearest</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-text-body)] hover:bg-[var(--color-bg-light)]'}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-text-body)] hover:bg-[var(--color-bg-light)]'}`}
                  >
                    <FaList />
                  </button>
                </div>

                {/* Map Toggle */}
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`hidden lg:flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg transition-colors ${
                    showMap ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-text-body)] hover:bg-[var(--color-bg-light)]'
                  }`}
                >
                  <FaMap />
                  <span>Map</span>
                </button>
              </div>
            </div>

            {/* Results */}
            {apiError && <div role="alert" className="mb-6 rounded-xl border border-[#F6C9C9] bg-[#FDECEC] p-4 text-[#7F1D1D]"><p className="font-semibold">Unable to load businesses</p><p className="mt-1 text-sm">{apiError}</p></div>}
            {apiLoading ? (
              <div className="py-16 text-center text-[var(--color-text-muted)]">Loading businesses…</div>
            ) : filteredBusinesses.length > 0 ? (
              <motion.div 
                className={`
                  ${viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}
                `}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {filteredBusinesses.map((business) => (
                  <motion.div key={business.slug} variants={fadeInUp}>
                    <BusinessCard {...business} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="rounded-[18px] border border-[#E4E9F1] bg-white px-8 py-16 text-center shadow-[0_8px_24px_-12px_rgba(15,23,42,.10)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xl text-[var(--color-text-heading)] mb-2">
                  No businesses match these filters
                </p>
                <p className="text-[var(--color-text-muted)] mb-6">
                  Try adjusting your filters or expanding your search area
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {filteredBusinesses.length > 0 && (
              <div className="flex justify-center gap-2 mt-12">
                <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-body)]">
                  Previous
                </button>
                <button className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-body)]">
                  2
                </button>
                <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-body)]">
                  3
                </button>
                <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-body)]">
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
