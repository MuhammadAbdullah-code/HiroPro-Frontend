'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface CategoryCardProps {
  icon: IconType;
  name: string;
  description?: string;
  businessCount?: number;
  href: string;
  iconColor?: string;
}

export default function CategoryCard({ 
  icon: Icon, 
  name, 
  description,
  businessCount,
  href,
  iconColor = 'text-[var(--color-primary)]'
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <motion.div
        className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-light)] rounded-xl hover:shadow-lg transition-all cursor-pointer h-full"
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className={`text-4xl mb-3 ${iconColor}`} />
        <h3 className="text-sm font-semibold text-center text-[var(--color-text-heading)] mb-1">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-center text-[var(--color-text-muted)] mb-2 line-clamp-2">
            {description}
          </p>
        )}
        {businessCount !== undefined && (
          <span className="text-xs text-[var(--color-text-muted)]">
            {businessCount > 0 ? `${businessCount} businesses` : 'Coming soon'}
          </span>
        )}
      </motion.div>
    </Link>
  );
}
