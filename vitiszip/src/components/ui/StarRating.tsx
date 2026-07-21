'use client';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
};

export default function StarRating({ rating: ratingRaw, count, size = 'sm', showCount = true, className }: Props) {
  const rating = Number(ratingRaw) || 0;
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const iconSize = sizes[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              iconSize,
              star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
            )}
          />
        ))}
      </div>
      {rating > 0 && (
        <span className={cn('font-medium text-gray-700', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {rating.toFixed(1)}
        </span>
      )}
      {showCount && count !== undefined && (
        <span className={cn('text-gray-400', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
