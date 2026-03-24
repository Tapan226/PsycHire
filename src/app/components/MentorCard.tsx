import React from 'react';
import { MapPin, Briefcase, Bookmark, ArrowRight, ShieldCheck, DollarSign, Star } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import { FeaturedChip } from '@/app/components/FeaturedChip';
import { RUPEE } from '@/app/utils/currency';
import type { Mentor } from '@/app/data/mentorship';
import { getReviewsForEntity, getAverageRating } from '@/app/data/reviews';

interface MentorCardProps {
  mentor: Mentor;
  onClick?: () => void;
  onRequestMentorship?: (e: React.MouseEvent) => void;
}

export function MentorCard({ mentor, onClick, onRequestMentorship }: MentorCardProps) {
  const reviews = getReviewsForEntity(mentor.id, 'mentor');
  const avgRating = getAverageRating(reviews);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 sm:p-7 flex flex-col gap-4 sm:gap-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer
        ${mentor.isFeatured ? 'ring-1 ring-brand-secondary border-brand-secondary' : 'border-gray-100 hover:border-blue-200'}
      `}
    >
      {/* Action buttons */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 z-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
        <button
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-brand-primary hover:bg-gray-100"
          title="Save Mentor"
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark size={18} />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3">
        {mentor.isFeatured && (
          <div className="self-start"><FeaturedChip /></div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
            <ImageWithFallback src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-900 font-medium truncate">{mentor.name}</span>
              {mentor.isVerified && <ShieldCheck size={12} className="text-green-500 shrink-0" />}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <UserGroupBadge group={mentor.userGroup} size="sm" />
              {mentor.isVerifiedMentor && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-px rounded-full">
                  <Star size={8} className="fill-amber-500 text-amber-500" /> Verified Mentor
                </span>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-brand-primary transition-colors pr-8">
          {mentor.domain}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <Chip label={mentor.specializations[0]} variant="mint" />
          <Chip label={`${mentor.yearsOfExperience} yrs exp.`} variant="blue" />
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

      {/* Focus */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 font-normal">
        {mentor.mentorshipFocus}
      </p>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm font-medium">
        <div className="flex items-center gap-3 sm:gap-4 text-gray-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            <span>{mentor.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-gray-400" />
            <span>{mentor.feePerSession === 0 ? 'Free' : `${RUPEE}${mentor.feePerSession}/session`}</span>
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