'use client';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showNumber = true,
  reviewCount 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className={`${sizeClasses[size]} text-[var(--color-star)]`} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className={`${sizeClasses[size]} text-[var(--color-star)]`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`${sizeClasses[size]} text-[var(--color-border)]`} />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars}
      </div>
      {showNumber && (
        <span className={`font-semibold text-[var(--color-text-heading)] ${textSizes[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`text-[var(--color-text-muted)] ${textSizes[size]}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
