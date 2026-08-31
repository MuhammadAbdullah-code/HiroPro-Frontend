'use client';

import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  tooltipText?: string;
}

export default function VerifiedBadge({ 
  size = 'md', 
  showText = false,
  tooltipText = "This business has verified ID, trade certification, and insurance documents."
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base'
  };

  return (
    <motion.div 
      className="inline-flex items-center gap-1 group relative"
      whileHover={{ scale: 1.05 }}
      title={tooltipText}
    >
      <FaCheckCircle className={`${sizeClasses[size]} text-[var(--color-secondary)]`} />
      {showText && (
        <span className={`font-medium text-[var(--color-secondary)] ${sizeClasses[size]}`}>
          Verified
        </span>
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {tooltipText}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </motion.div>
  );
}
