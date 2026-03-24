import React from 'react';
import { MapPin, Bookmark, ArrowRight, ShieldCheck, DollarSign, Star, Wifi, Users } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import { FeaturedChip } from '@/app/components/FeaturedChip';
import type { Supervisor } from '@/app/data/supervision';
import { RUPEE } from '@/app/utils/currency';
import { getReviewsForEntity, getAverageRating } from '@/app/data/reviews';

interface SupervisorCardProps {
  supervisor: Supervisor;
  onClick?: () => void;
}

export function SupervisorCard({ supervisor, onClick }: SupervisorCardProps) {
  const reviews = getReviewsForEntity(supervisor.id, 'supervisor');
  const avgRating = getAverageRating(reviews);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 sm:p-7 flex flex-col gap-4 sm:gap-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer
        ${supervisor.isFeatured ? 'ring-1 ring-brand-secondary border-brand-secondary' : 'border-gray-100 hover:border-blue-200'}
      `}
    >
      {/* Action buttons */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 z-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
        <button
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-brand-primary hover:bg-gray-100"
          title="Save Supervisor"
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark size={18} />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3">
        {supervisor.isFeatured && (
          <div className="self-start"><FeaturedChip /></div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
            <ImageWithFallback src={supervisor.avatarUrl} alt={supervisor.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-900 font-medium truncate">{supervisor.name}</span>
              {supervisor.isVerified && <ShieldCheck size={12} className="text-green-500 shrink-0" />}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <UserGroupBadge group={supervisor.userGroup} size="sm" />
              {supervisor.isVerifiedSupervisor && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-px rounded-full">
                  <Star size={8} className="fill-purple-500 text-purple-500" /> Supervisor
                </span>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-brand-primary transition-colors pr-8">
          {supervisor.domain}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <Chip label={supervisor.specializations[0]} variant="mint" />
          <Chip label={`${supervisor.yearsOfSupervisionExperience} yrs sup.`} variant="blue" />
        </div>

        {/* Rating aggregate */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={13} fill="#f59e0b" className="text-amber-400" />
            <span className="text-amber-600" style={{ fontSize: 13, fontWeight: 700 }}>{avgRating.toFixed(1)}</span>
            <span className="text-gray-400" style={{ fontSize: 12 }}>({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        )}
      </div>

      {/* Mode + Session Type */}
      <div className="flex items-center gap-2 sm:gap-3 text-[12px] text-gray-500 flex-wrap">
        <span className="flex items-center gap-1"><Wifi size={12} className="text-gray-400" /> {supervisor.mode}</span>
        <span className="text-gray-300">&middot;</span>
        <span className="flex items-center gap-1"><Users size={12} className="text-gray-400" /> {supervisor.sessionType}</span>
        <span className="text-gray-300">&middot;</span>
        <span>{supervisor.purposes[0]}</span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm font-medium">
        <div className="flex items-center gap-3 sm:gap-4 text-gray-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            <span>{supervisor.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-gray-400" />
            <span>{supervisor.isPaid ? `${RUPEE}${supervisor.feePerSession}/session` : 'Free'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-brand-primary text-sm font-semibold hover:underline group/btn">
          <span>View Profile</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}