import React from 'react';
import { Star } from 'lucide-react';

interface FeaturedChipProps {
  className?: string;
}

export const FeaturedChip = ({ className = "" }: FeaturedChipProps) => {
  return (
    <div className={`inline-flex items-center gap-1 bg-brand-secondary text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm select-none ${className}`}>
      <Star size={10} className="fill-current" strokeWidth={0} />
      <span>Featured</span>
    </div>
  );
};
