import React from 'react';

export type ChipVariant = 'mint' | 'blue' | 'purple' | 'amber' | 'rose' | 'slate';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  className?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  // Desaturated, neutral-leaning backgrounds with black/dark text
  mint:   "bg-[#E0EFEA] text-gray-900", // Muted Mint
  blue:   "bg-[#E0EBF5] text-gray-900", // Muted Blue
  purple: "bg-[#EBE0F5] text-gray-900", // Muted Purple
  amber:  "bg-[#F5EFE0] text-gray-900", // Muted Amber/Beige
  rose:   "bg-[#F5E0E5] text-gray-900", // Muted Rose
  slate:  "bg-[#F0F2F5] text-gray-900", // Muted Slate
};

export const Chip = ({ label, variant = 'slate', className = '' }: ChipProps) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  );
};
