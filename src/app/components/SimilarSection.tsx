import React from 'react';
import { ChevronRight } from 'lucide-react';

/* ══════════════════════════════════════════════
   SimilarSection — layout wrapper for "Similar X"
   strips at the bottom of detail pages.
   Renders actual module cards as children.
   ══════════════════════════════════════════════ */

interface SimilarSectionProps {
  /** e.g. "Similar Jobs" */
  title: string;
  /** e.g. "Explore more in Jobs" */
  exploreLabel?: string;
  onExploreClick?: () => void;
  /** Accent color for the explore link */
  accent?: 'blue' | 'teal' | 'indigo' | 'emerald' | 'amber';
  children: React.ReactNode;
}

const ACCENT_TEXT = {
  blue: 'text-blue-600',
  teal: 'text-teal-600',
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
};

export function SimilarSection({
  title,
  exploreLabel,
  onExploreClick,
  accent = 'blue',
  children,
}: SimilarSectionProps) {
  return (
    <div className="w-full bg-gray-50/60 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <p style={{ fontSize: 16 }} className="text-gray-900" role="heading" aria-level={2}>
            {title}
          </p>
          {exploreLabel && onExploreClick && (
            <button
              onClick={onExploreClick}
              className={`flex items-center gap-1 ${ACCENT_TEXT[accent]} transition-colors`}
              style={{ fontSize: 13 }}
            >
              {exploreLabel}
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Card grid — rendered by parent */}
        {children}
      </div>
    </div>
  );
}
