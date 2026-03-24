import React from 'react';
import {
  Bookmark,
  Share2,
  ArrowRight,
  Zap,
  Clock,
  CalendarDays,
  Banknote,
} from 'lucide-react';
import { Chip, ChipVariant } from '@/app/components/Chip';
import { FeaturedChip } from '@/app/components/FeaturedChip';
import type { FundingType, FundingStatus } from '@/app/data/funding';

/* ── Status badge config ── */

const STATUS_CONFIG: Record<FundingStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  Open: {
    bg: 'bg-green-100',
    text: 'text-green-700 border border-green-200',
    icon: <Zap size={10} />,
    label: 'Open',
  },
  'Closing Soon': {
    bg: 'bg-amber-100',
    text: 'text-amber-700 border border-amber-200',
    icon: <Clock size={10} />,
    label: 'Closing Soon',
  },
  Closed: {
    bg: 'bg-gray-100',
    text: 'text-gray-500 border border-gray-200',
    icon: <Clock size={10} />,
    label: 'Closed',
  },
};

const TYPE_VARIANT: Record<FundingType, ChipVariant> = {
  Scholarship: 'blue',
  Grant: 'amber',
  Fellowship: 'purple',
};

/* ── Props ── */

interface FundingCardProps {
  id: string;
  title: string;
  offeredBy: string;
  type: FundingType;
  amount: string;
  deadline: string;
  targetAudience: string;
  status: FundingStatus;
  isSaved?: boolean;
  isFeatured?: boolean;
  compact?: boolean;
  onClick?: () => void;
  onSave?: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  // Allow extra props when spreading FundingOpportunity
  [key: string]: any;
}

/* ── Component ── */

export function FundingCard({
  title,
  offeredBy,
  type,
  amount,
  deadline,
  targetAudience,
  status,
  isSaved = false,
  isFeatured = false,
  compact = false,
  onClick,
  onSave,
  onShare,
}: FundingCardProps) {
  const statusCfg = STATUS_CONFIG[status];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${compact ? 'p-4 gap-3' : 'p-7 gap-6'} flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer
        ${isFeatured ? 'ring-1 ring-brand-secondary border-brand-secondary' : 'border-gray-100 hover:border-emerald-200'}
        ${status === 'Closed' ? 'opacity-70' : ''}
      `}
    >
      {/* ── Hover actions ── */}
      {!compact && (
      <div
        className={`absolute top-5 right-5 flex items-center gap-2 z-10 transition-opacity duration-200 ${
          isSaved ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
        }`}
      >
        <button
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-brand-primary hover:bg-gray-100"
          title="Share"
          onClick={(e) => { e.stopPropagation(); onShare?.(e); }}
        >
          <Share2 size={18} />
        </button>
        <button
          className={`p-2 rounded-full transition-colors ${
            isSaved ? 'text-brand-primary bg-gray-50' : 'text-gray-400 hover:text-brand-primary hover:bg-gray-100'
          }`}
          title={isSaved ? 'Saved' : 'Save'}
          onClick={(e) => { e.stopPropagation(); onSave?.(e); }}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col gap-3">
        {/* Featured + Status badge row */}
        <div className="flex items-center gap-2 flex-wrap">
          {isFeatured && <FeaturedChip className="self-start" />}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text}`}>
            {statusCfg.icon}
            {statusCfg.label}
          </span>
        </div>

        {/* Offered by */}
        <span className={`text-sm text-gray-500 font-medium ${compact ? 'pr-2' : 'pr-12'}`}>{offeredBy}</span>

        {/* Title */}
        <p style={{ fontSize: compact ? 15 : undefined }} className={`text-gray-900 group-hover:text-brand-primary transition-colors ${compact ? 'pr-2 line-clamp-2' : 'pr-8'}`}>
          {title}
        </p>

        {/* Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <Chip label={type} variant={TYPE_VARIANT[type]} />
          <Chip label={targetAudience.length > 40 ? targetAudience.slice(0, 37) + '...' : targetAudience} variant="slate" />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-1.5">
            <Banknote size={16} className="text-gray-400" />
            <span>{amount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays size={16} className="text-gray-400" />
            <span>{deadline}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-brand-primary text-sm font-semibold hover:underline group/btn">
          <span>View Details</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}