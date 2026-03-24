import React from 'react';
import {
  MapPin,
  Calendar,
  Zap,
  Clock,
  Globe,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { Chip } from '@/app/components/Chip';
import type {
  ReferralUrgency,
  ReferralStatus,
  ReferralPerson,
} from '@/app/data/referrals';

interface ReferralCardProps {
  title: string;
  specialization: string;
  location: string;
  urgency: ReferralUrgency;
  deadline: string;
  status: ReferralStatus;
  postedBy: ReferralPerson;
  mode?: string;
  onClick?: () => void;
  onRespond?: () => void;
  onShare?: (e: React.MouseEvent) => void;
  showRespond?: boolean;
}

const URGENCY_CONFIG: Record<ReferralUrgency, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  Immediate: {
    bg: 'bg-red-100',
    text: 'text-red-700 border border-red-200',
    icon: <Zap size={10} className="fill-current" />,
    label: 'Immediate',
  },
  Scheduled: {
    bg: 'bg-amber-100',
    text: 'text-amber-700 border border-amber-200',
    icon: <Calendar size={10} />,
    label: 'Scheduled',
  },
  Exploratory: {
    bg: 'bg-blue-100',
    text: 'text-blue-700 border border-blue-200',
    icon: <Clock size={10} />,
    label: 'Exploratory',
  },
};

function getDeadlineLabel(deadline: string): { label: string; isUrgent: boolean; isPast: boolean } {
  const now = new Date();
  const dl = new Date(deadline);
  const diffMs = dl.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Expired', isUrgent: false, isPast: true };
  if (diffDays === 0) return { label: 'Due today', isUrgent: true, isPast: false };
  if (diffDays === 1) return { label: '1 day left', isUrgent: true, isPast: false };
  if (diffDays <= 3) return { label: `${diffDays} days left`, isUrgent: true, isPast: false };
  if (diffDays <= 7) return { label: `${diffDays} days left`, isUrgent: false, isPast: false };
  if (diffDays <= 30) return { label: `${Math.ceil(diffDays / 7)} weeks left`, isUrgent: false, isPast: false };
  return { label: `${Math.ceil(diffDays / 30)} months left`, isUrgent: false, isPast: false };
}

export function ReferralCard({
  title,
  specialization,
  location,
  urgency,
  deadline,
  status,
  postedBy,
  mode,
  onClick,
  onRespond,
  onShare,
  showRespond = true,
}: ReferralCardProps) {
  const urgencyStyle = URGENCY_CONFIG[urgency];
  const deadlineInfo = getDeadlineLabel(deadline);
  const isActive = status === 'Open';
  const isRemote = mode === 'Remote' || location === 'Remote';

  return (
    <div
      className={`bg-white rounded-xl border p-5 sm:p-7 flex flex-col gap-4 sm:gap-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer
        ${urgency === 'Immediate' && isActive ? 'ring-1 ring-red-200 border-red-200' : 'border-gray-100 hover:border-blue-200'}
      `}
      onClick={onClick}
    >
      {/* Action Buttons (Absolute Top Right) */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 z-10 transition-opacity duration-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
        <button
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-brand-primary hover:bg-gray-100"
          title="Share"
          onClick={(e) => { e.stopPropagation(); onShare?.(e); }}
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3">
        {/* Urgency badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider self-start ${urgencyStyle.bg} ${urgencyStyle.text}`}>
          {urgencyStyle.icon}
          {urgencyStyle.label}
        </span>

        {/* Title */}
        <p className="text-xl font-bold text-gray-900 leading-tight group-hover:text-brand-primary transition-colors pr-8">
          {title}
        </p>

        {/* Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <Chip label={specialization} variant="mint" />
          {mode && <Chip label={mode} variant="slate" />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm font-medium">
        <div className="flex items-center gap-3 sm:gap-4 text-gray-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            {isRemote ? <Globe size={16} className="text-gray-400" /> : <MapPin size={16} className="text-gray-400" />}
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} className={deadlineInfo.isUrgent ? 'text-red-400' : 'text-gray-400'} />
            <span className={deadlineInfo.isUrgent ? 'font-semibold text-red-600' : deadlineInfo.isPast ? 'text-gray-400' : ''}>
              {deadlineInfo.label}
            </span>
          </div>
        </div>

        {showRespond && isActive && (
          <button
            onClick={(e) => { e.stopPropagation(); onRespond?.(); }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors group/btn"
          >
            Respond <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}