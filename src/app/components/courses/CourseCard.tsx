import React, { useState } from 'react';
import { Course, CourseBadge } from '@/app/data/courses';
import { Bookmark, ArrowRight, Share2, Award, ShieldCheck, Star, Zap, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';
import { FeaturedChip } from '@/app/components/FeaturedChip';
import { toastBookmarkAdded, toastBookmarkRemoved } from '@/app/components/shared/toasts';

/* ── Badge styling ── */
const BADGE_CONFIG: Record<CourseBadge, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  'Accredited': { icon: <ShieldCheck size={10} />, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Most Popular': { icon: <Star size={10} className="fill-current" />, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Starting Soon': { icon: <Zap size={10} />, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Latest Added': { icon: <Sparkles size={10} />, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

interface CourseCardProps {
  course: Course;
  onClick: (courseId: string) => void;
  compact?: boolean;
  onShare?: (courseId: string) => void;
  onSave?: (courseId: string) => void;
}

export function CourseCard({ course, onClick, compact = false, onShare, onSave }: CourseCardProps) {
  const [isSaved, setIsSaved] = useState(course.isSaved || false);

  const currencySymbol = course.currency === 'USD' ? '$' : course.currency === 'GBP' ? '£' : course.currency === 'INR' ? '₹' : course.currency;

  return (
    <div
      onClick={() => onClick(course.id)}
      className={`bg-white rounded-xl border ${compact ? 'p-4 gap-3' : 'p-5 sm:p-7 gap-4 sm:gap-6'} flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer
        ${course.isFeatured ? 'ring-1 ring-brand-secondary border-brand-secondary' : 'border-gray-100 hover:border-indigo-200'}
      `}
    >
      {/* ── Hover actions (top-5 right-5, size 18) ── */}
      {!compact && (
      <div
        className={`absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 z-10 transition-opacity duration-200 ${
          isSaved ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
        }`}
      >
        <button
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-brand-primary hover:bg-gray-100"
          title="Share Course"
          onClick={(e) => { e.stopPropagation(); onShare?.(course.id); }}
        >
          <Share2 size={18} />
        </button>
        <button
          className={`p-2 rounded-full transition-colors ${
            isSaved ? 'text-brand-primary bg-gray-50' : 'text-gray-400 hover:text-brand-primary hover:bg-gray-100'
          }`}
          title={isSaved ? 'Saved' : 'Save Course'}
          onClick={(e) => {
            e.stopPropagation();
            const next = !isSaved;
            setIsSaved(next);
            if (next) { toastBookmarkAdded('course'); } else { toastBookmarkRemoved('course'); }
            onSave?.(course.id);
          }}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      )}

      {/* ── Header: FeaturedChip → Badge → Provider → Title → Metadata chips ── */}
      <div className="flex flex-col gap-3">
        {/* Featured + Badge row */}
        <div className="flex items-center gap-2 flex-wrap">
          {course.isFeatured && <FeaturedChip className="self-start" />}
          {course.badge && BADGE_CONFIG[course.badge] && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${BADGE_CONFIG[course.badge].bg} ${BADGE_CONFIG[course.badge].text} ${BADGE_CONFIG[course.badge].border}`}>
              {BADGE_CONFIG[course.badge].icon}
              {course.badge}
            </span>
          )}
        </div>

        {/* Provider row */}
        <div className={`flex items-center gap-3 ${compact ? 'pr-2' : 'pr-8 sm:pr-12'}`}>
          <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0`}>
            <ImageWithFallback
              src={course.provider.logoUrl}
              alt={course.provider.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-500 font-medium truncate">{course.provider.name}</span>
        </div>

        {/* Title */}
        <p style={{ fontSize: compact ? 15 : undefined }} className={`text-gray-900 group-hover:text-brand-primary transition-colors ${compact ? 'pr-2 line-clamp-2' : 'pr-8'}`}>
          {course.title}
        </p>

        {/* Metadata chips row */}
        <div className="flex items-center gap-2 flex-wrap">
          {course.specializations?.[0] && (
            <Chip label={course.specializations[0]} variant="blue" />
          )}
          <Chip label={course.courseType} variant="slate" />
          <Chip label={course.mode} variant={course.mode === 'Online' ? 'mint' : course.mode === 'Hybrid' ? 'amber' : 'purple'} />
        </div>
      </div>

      {/* ── Description ── */}
      {!compact && (
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 font-normal">
        {course.description}
      </p>
      )}

      {/* ── Footer with divider ── */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm font-medium">
        <div className="flex items-center gap-3 sm:gap-4 text-gray-500 flex-wrap">
          {course.outcomes?.[0] && (
            <div className="flex items-center gap-1.5">
              <Award size={14} className="text-gray-400" />
              <span>{course.outcomes[0]}</span>
            </div>
          )}
          {!course.isFree && course.price > 0 && (
            <div className="flex items-center gap-1.5">
              <span>{currencySymbol}{course.price}</span>
            </div>
          )}
          {course.isFree && (
            <span className="text-green-600 font-semibold">Free</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-brand-primary text-sm font-semibold hover:underline group/btn">
          <span>View Course</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}