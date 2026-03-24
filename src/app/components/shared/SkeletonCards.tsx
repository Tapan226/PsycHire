/**
 * SkeletonCards — Shimmer loading placeholders for every card type.
 * Matches the dimensions of JobCard, ProjectCard, ReferralCard,
 * CourseCard, FundingCard, EventCard, and PersonCard.
 */

import React from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';

/* ── Job Card Skeleton ── */

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 h-full">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
      </div>
      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      {/* Details */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Project Card Skeleton ── */

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-4/5 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
      </div>
      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      {/* Body */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      {/* Skills */}
      <div className="flex gap-1.5 flex-wrap">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-18 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Referral Card Skeleton ── */

export function ReferralCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3.5 h-full">
      {/* Top badge row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      {/* Title */}
      <Skeleton className="h-4 w-3/4" />
      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      {/* Meta row */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Course Card Skeleton ── */

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full">
      {/* Image area */}
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        {/* Title */}
        <Skeleton className="h-4 w-4/5" />
        {/* Description */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/* ── Funding Card Skeleton ── */

export function FundingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3.5 h-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      {/* Amount bar */}
      <Skeleton className="h-8 w-full rounded-lg" />
      {/* Description */}
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Person Card Skeleton ── */

export function PersonCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3 h-full">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-20" />
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-full rounded-lg mt-2" />
    </div>
  );
}

/* ── Event Card Skeleton ── */

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start gap-3">
        <Skeleton className="w-12 h-14 rounded-xl shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Company Card Skeleton ── */

export function CompanyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Mentor/Supervisor Card Skeleton ── */

export function MentorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <Skeleton className="w-14 h-14 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-1" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-8 w-full rounded-lg mt-1" />
    </div>
  );
}

/* ── Application Tracker Row Skeleton ── */

export function ApplicationRowSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

/* ── Grid Skeleton Wrapper ── */

interface SkeletonGridProps {
  count?: number;
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function SkeletonGrid({ count = 4, columns = 2, children }: SkeletonGridProps) {
  const colClass =
    columns === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1';

  return (
    <div className={`grid ${colClass} gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`skel-${i}`} className="h-full">
          {children}
        </div>
      ))}
    </div>
  );
}
