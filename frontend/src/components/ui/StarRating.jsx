import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 'sm', showNumber = true, reviewCount }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizes[size]} ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-white/20'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-white/80">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-white/40 font-normal ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default StarRating;
