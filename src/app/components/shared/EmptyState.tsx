/**
 * EmptyState — Polished, branded empty-state card for
 * saved / applied / search / general "nothing here" screens.
 */

import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  Search,
  FileText,
  Users,
  Calendar,
  GraduationCap,
  Wallet,
  MessageCircle,
  FolderOpen,
} from 'lucide-react';

export type EmptyVariant =
  | 'saved-jobs'
  | 'saved-projects'
  | 'applied'
  | 'search'
  | 'general'
  | 'members'
  | 'events'
  | 'courses'
  | 'funding'
  | 'messages';

interface EmptyStateProps {
  variant: EmptyVariant;
  /** Override the title */
  title?: string;
  /** Override the description */
  description?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA callback */
  onAction?: () => void;
  /** Extra className on the outer wrapper */
  className?: string;
}

const VARIANTS: Record<EmptyVariant, {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  ringColor: string;
  title: string;
  description: string;
  actionLabel: string;
}> = {
  'saved-jobs': {
    icon: Bookmark,
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#1e40af]',
    ringColor: 'ring-blue-100',
    title: 'No saved jobs yet',
    description: 'Tap the bookmark icon on any job listing to save it here for quick access later.',
    actionLabel: 'Explore Jobs',
  },
  'saved-projects': {
    icon: Bookmark,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    ringColor: 'ring-teal-100',
    title: 'No saved projects yet',
    description: 'Tap the bookmark icon on any project to save it here for quick access later.',
    actionLabel: 'Explore Projects',
  },
  'applied': {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    ringColor: 'ring-emerald-100',
    title: 'No applications yet',
    description: 'When you apply to jobs, you can track their status right here.',
    actionLabel: 'Browse Opportunities',
  },
  'search': {
    icon: Search,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-400',
    ringColor: 'ring-gray-100',
    title: 'No results found',
    description: 'Try adjusting your search terms or clearing some filters to see more results.',
    actionLabel: 'Clear Filters',
  },
  'general': {
    icon: FolderOpen,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-400',
    ringColor: 'ring-gray-100',
    title: 'Nothing here yet',
    description: 'There\'s nothing to display right now. Check back later or explore other sections.',
    actionLabel: 'Go Back',
  },
  'members': {
    icon: Users,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    ringColor: 'ring-indigo-100',
    title: 'No members found',
    description: 'No one matches your current search. Try different keywords.',
    actionLabel: 'Clear Search',
  },
  'events': {
    icon: Calendar,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    ringColor: 'ring-violet-100',
    title: 'No upcoming events',
    description: 'There are no events matching your filters. Check back soon or adjust your search.',
    actionLabel: 'See All Events',
  },
  'courses': {
    icon: GraduationCap,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    ringColor: 'ring-amber-100',
    title: 'No courses found',
    description: 'No courses match your current filters. Try broadening your search criteria.',
    actionLabel: 'Reset Filters',
  },
  'funding': {
    icon: Wallet,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    ringColor: 'ring-emerald-100',
    title: 'No funding opportunities',
    description: 'No funding matches your criteria right now. New opportunities are added regularly.',
    actionLabel: 'Browse All',
  },
  'messages': {
    icon: MessageCircle,
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#1e40af]',
    ringColor: 'ring-blue-100',
    title: 'No messages yet',
    description: 'Start a conversation with someone from your network.',
    actionLabel: 'Find People',
  },
};

export function EmptyState({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  const config = VARIANTS[variant];
  const Icon = config.icon;
  const displayTitle = title || config.title;
  const displayDesc = description || config.description;
  const displayAction = actionLabel || config.actionLabel;

  return (
    <div className={`flex flex-col items-center justify-center py-16 sm:py-20 px-6 ${className}`}>
      {/* Icon with decorative rings */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div className={`absolute inset-0 -m-3 rounded-full ring-1 ${config.ringColor} opacity-40`} />
        <div className={`absolute inset-0 -m-6 rounded-full ring-1 ${config.ringColor} opacity-20`} />
        {/* Icon circle */}
        <div className={`relative w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center`}>
          <Icon size={26} className={config.iconColor} strokeWidth={1.8} />
        </div>
      </div>

      {/* Text */}
      <p style={{ fontSize: 17, fontWeight: 700, lineHeight: '1.3' }} className="text-gray-900 text-center mb-2">
        {displayTitle}
      </p>
      <p style={{ fontSize: 13, lineHeight: '1.6' }} className="text-gray-500 text-center max-w-sm">
        {displayDesc}
      </p>

      {/* CTA */}
      {onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e40af]/5 text-[#1e40af] hover:bg-[#1e40af]/10 transition-colors"
          style={{ fontSize: 13, fontWeight: 600 }}
        >
          {displayAction}
        </button>
      )}
    </div>
  );
}
