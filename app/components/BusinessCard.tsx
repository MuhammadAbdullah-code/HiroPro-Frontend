'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import StarRating from './StarRating';
import VerifiedBadge from './VerifiedBadge';
import { useState } from 'react';
import { getApiErrorMessage, hireProApi, hydrateApiToken } from '../lib/api';

interface BusinessCardProps {
  id?: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  specialty?: string;
  imageUrl?: string;
  verified?: boolean;
  location?: string;
}

export default function BusinessCard({
  id,
  slug,
  name,
  category,
  rating,
  reviewCount,
  distance,
  specialty,
  imageUrl,
  verified = false,
  location
}: BusinessCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    setFavoriteError('');
    try {
      hydrateApiToken();
      const result = await hireProApi.businesses.toggleFavorite(id);
      setIsFavorite(result.is_favorite);
    } catch (error) {
      setFavoriteError(getApiErrorMessage(error, 'Unable to update favorite'));
    }
  };

  return (
    <Link href={`/businesses/${slug}`}>
      <motion.div
        className="bg-[var(--color-bg-white)] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
        whileHover={{ y: -10 }}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
          {imageUrl && (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          )}
          <motion.button
            onClick={handleFavorite}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaHeart 
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'text-[var(--color-accent)] fill-current' : 'text-gray-400'
              }`} 
            />
          </motion.button>
          {favoriteError && <span className="sr-only" role="alert">{favoriteError}</span>}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-1 line-clamp-1">
                {name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[var(--color-text-muted)]">{category}</span>
                {verified && <VerifiedBadge size="sm" />}
              </div>
            </div>
          </div>

          {specialty && (
            <p className="text-sm text-[var(--color-text-body)] mb-3 line-clamp-2">
              {specialty}
            </p>
          )}

          {location && (
            <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] mb-3">
              <FaMapMarkerAlt className="w-3 h-3" />
              <span>{location}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
            {distance && (
              <span className="text-xs text-[var(--color-text-muted)]">{distance}</span>
            )}
          </div>

          <motion.button
            className="w-full mt-4 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/businesses/${slug}`;
            }}
          >
            View Details
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}
